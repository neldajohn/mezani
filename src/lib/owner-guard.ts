import { redirect } from "next/navigation";
import { getSessionAccount } from "./owner-session";
import type { RestaurantAccount } from "./types";

export async function requireOwnerAccount(): Promise<RestaurantAccount> {
  const account = await getSessionAccount();
  if (!account) {
    redirect("/mmiliki");
  }
  return account;
}
