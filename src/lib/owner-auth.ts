import crypto from "node:crypto";
import { getDb } from "./db";
import type { RestaurantAccount } from "./types";

const CODE_TTL_MINUTES = 10;
const SESSION_TTL_DAYS = 30;

export function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("255")) return digits;
  if (digits.startsWith("0")) return `255${digits.slice(1)}`;
  return digits;
}

function minutesFromNow(minutes: number): string {
  return new Date(Date.now() + minutes * 60_000).toISOString();
}

function daysFromNow(days: number): string {
  return new Date(Date.now() + days * 24 * 60 * 60_000).toISOString();
}

/**
 * Generates and stores a login code for the given WhatsApp number.
 *
 * There is no real WhatsApp Business API wired up (that needs a Meta or
 * Twilio business account with credentials this project doesn't have), so
 * the code is simply returned here and shown on-screen by the caller in
 * dev-mode instead of being sent as an actual WhatsApp message. Swapping in
 * real delivery later just means calling that API with this code instead
 * of rendering it.
 */
export function requestLoginCode(whatsappNumber: string): string {
  const db = getDb();
  const code = crypto.randomInt(100000, 999999).toString();

  db.prepare(
    `INSERT INTO login_codes (whatsapp_number, code, expires_at)
     VALUES (?, ?, ?)`,
  ).run(whatsappNumber, code, minutesFromNow(CODE_TTL_MINUTES));

  return code;
}

function findOrCreateAccount(whatsappNumber: string): number {
  const db = getDb();
  const existing = db
    .prepare("SELECT id FROM restaurant_accounts WHERE whatsapp_number = ?")
    .get(whatsappNumber) as { id: number } | undefined;

  if (existing) return existing.id;

  const result = db
    .prepare(
      "INSERT INTO restaurant_accounts (whatsapp_number) VALUES (?)",
    )
    .run(whatsappNumber);
  return Number(result.lastInsertRowid);
}

export type VerifiedLogin = {
  token: string;
  account: RestaurantAccount;
};

export function verifyLoginCode(
  whatsappNumber: string,
  code: string,
): VerifiedLogin | null {
  const db = getDb();
  const row = db
    .prepare(
      `SELECT id FROM login_codes
       WHERE whatsapp_number = ? AND code = ? AND consumed_at IS NULL
         AND expires_at > ?
       ORDER BY id DESC LIMIT 1`,
    )
    .get(whatsappNumber, code, new Date().toISOString()) as
    | { id: number }
    | undefined;

  if (!row) return null;

  db.prepare("UPDATE login_codes SET consumed_at = ? WHERE id = ?").run(
    new Date().toISOString(),
    row.id,
  );

  const accountId = findOrCreateAccount(whatsappNumber);
  const token = crypto.randomBytes(32).toString("hex");

  db.prepare(
    `INSERT INTO owner_sessions (token, account_id, expires_at)
     VALUES (?, ?, ?)`,
  ).run(token, accountId, daysFromNow(SESSION_TTL_DAYS));

  const accountRow = db
    .prepare(
      "SELECT id, whatsapp_number, restaurant_id FROM restaurant_accounts WHERE id = ?",
    )
    .get(accountId) as {
    id: number;
    whatsapp_number: string;
    restaurant_id: number | null;
  };

  return { token, account: rowToAccount(accountRow) };
}

function rowToAccount(row: {
  id: number;
  whatsapp_number: string;
  restaurant_id: number | null;
}): RestaurantAccount {
  return {
    id: row.id,
    whatsappNumber: row.whatsapp_number,
    restaurantId: row.restaurant_id,
  };
}

export function getAccountBySessionToken(
  token: string,
): RestaurantAccount | null {
  const db = getDb();
  const row = db
    .prepare(
      `SELECT ra.id, ra.whatsapp_number, ra.restaurant_id
       FROM owner_sessions os
       JOIN restaurant_accounts ra ON ra.id = os.account_id
       WHERE os.token = ? AND os.expires_at > ?`,
    )
    .get(token, new Date().toISOString()) as
    | { id: number; whatsapp_number: string; restaurant_id: number | null }
    | undefined;

  return row ? rowToAccount(row) : null;
}

export function destroySession(token: string): void {
  const db = getDb();
  db.prepare("DELETE FROM owner_sessions WHERE token = ?").run(token);
}

export function linkAccountToRestaurant(
  accountId: number,
  restaurantId: number,
): void {
  const db = getDb();
  db.prepare(
    "UPDATE restaurant_accounts SET restaurant_id = ? WHERE id = ?",
  ).run(restaurantId, accountId);
}
