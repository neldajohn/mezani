import Database from "better-sqlite3";
import path from "node:path";
import fs from "node:fs";
import os from "node:os";

// Serverless hosts (Vercel, etc.) ship a read-only deployment filesystem
// except for the OS temp dir, so the db has to live there in production.
const DATA_DIR = process.env.VERCEL
  ? path.join(os.tmpdir(), "mezani-data")
  : path.join(process.cwd(), "data");
const DB_PATH = path.join(DATA_DIR, "mezani.db");

declare global {
  var __mezaniDb: Database.Database | undefined;
}

function createDb(): Database.Database {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  const db = new Database(DB_PATH);
  db.pragma("journal_mode = WAL");

  db.exec(`
    CREATE TABLE IF NOT EXISTS restaurants (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      city TEXT NOT NULL,
      neighborhood TEXT NOT NULL,
      cuisine TEXT NOT NULL,
      price_range INTEGER NOT NULL,
      rating REAL NOT NULL,
      review_count INTEGER NOT NULL,
      description TEXT NOT NULL,
      address TEXT NOT NULL,
      phone TEXT NOT NULL,
      opens_at TEXT NOT NULL,
      closes_at TEXT NOT NULL,
      accent TEXT NOT NULL,
      emoji TEXT NOT NULL,
      popular_dishes TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS reservations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      code TEXT UNIQUE NOT NULL,
      restaurant_id INTEGER NOT NULL,
      full_name TEXT NOT NULL,
      phone TEXT NOT NULL,
      email TEXT,
      party_size INTEGER NOT NULL,
      reservation_date TEXT NOT NULL,
      reservation_time TEXT NOT NULL,
      special_request TEXT,
      status TEXT NOT NULL DEFAULT 'imethibitishwa',
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (restaurant_id) REFERENCES restaurants(id)
    );

    CREATE TABLE IF NOT EXISTS menu_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      restaurant_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      price INTEGER NOT NULL,
      sort_order INTEGER NOT NULL DEFAULT 0,
      FOREIGN KEY (restaurant_id) REFERENCES restaurants(id)
    );

    CREATE TABLE IF NOT EXISTS reservation_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      reservation_id INTEGER NOT NULL,
      menu_item_id INTEGER NOT NULL,
      quantity INTEGER NOT NULL,
      FOREIGN KEY (reservation_id) REFERENCES reservations(id),
      FOREIGN KEY (menu_item_id) REFERENCES menu_items(id)
    );

    CREATE TABLE IF NOT EXISTS restaurant_accounts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      whatsapp_number TEXT UNIQUE NOT NULL,
      restaurant_id INTEGER,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (restaurant_id) REFERENCES restaurants(id)
    );

    CREATE TABLE IF NOT EXISTS login_codes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      whatsapp_number TEXT NOT NULL,
      code TEXT NOT NULL,
      expires_at TEXT NOT NULL,
      consumed_at TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS owner_sessions (
      token TEXT PRIMARY KEY,
      account_id INTEGER NOT NULL,
      expires_at TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (account_id) REFERENCES restaurant_accounts(id)
    );
  `);

  return db;
}

export function getDb(): Database.Database {
  if (!global.__mezaniDb) {
    global.__mezaniDb = createDb();
  }
  return global.__mezaniDb;
}
