import { cookies } from "next/headers";
import { getAccountBySessionToken, destroySession } from "./owner-auth";
import type { RestaurantAccount } from "./types";

const COOKIE_NAME = "mezani_owner_session";

export async function getSessionAccount(): Promise<RestaurantAccount | null> {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return getAccountBySessionToken(token);
}

export async function setSessionCookie(token: string): Promise<void> {
  const store = await cookies();
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function clearSessionCookie(): Promise<void> {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  if (token) destroySession(token);
  store.delete(COOKIE_NAME);
}
