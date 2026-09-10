"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import {
  normalizePhone,
  requestLoginCode,
  verifyLoginCode,
  linkAccountToRestaurant,
} from "@/lib/owner-auth";
import { setSessionCookie, clearSessionCookie } from "@/lib/owner-session";
import { createRestaurant, updateRestaurant } from "@/lib/restaurants";
import { addMenuItem, updateMenuItem, deleteMenuItem } from "@/lib/menu-items";
import { requireOwnerAccount } from "@/lib/owner-guard";

export type ActionState = {
  error?: string;
};

export async function requestLoginCodeAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const phone = String(formData.get("phone") ?? "").trim();
  if (phone.replace(/\D/g, "").length < 9) {
    return { error: "Tafadhali jaza namba sahihi ya WhatsApp." };
  }

  const whatsappNumber = normalizePhone(phone);
  const code = requestLoginCode(whatsappNumber);

  redirect(
    `/mmiliki/thibitisha?simu=${encodeURIComponent(whatsappNumber)}&dev_code=${code}`,
  );
}

export async function verifyLoginCodeAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const whatsappNumber = String(formData.get("whatsappNumber") ?? "");
  const code = String(formData.get("code") ?? "").trim();

  const result = verifyLoginCode(whatsappNumber, code);
  if (!result) {
    return { error: "Namba ya uthibitisho si sahihi au imeisha muda wake." };
  }

  await setSessionCookie(result.token);

  if (result.account.restaurantId) {
    redirect("/mmiliki/dashibodi");
  } else {
    redirect("/mmiliki/anzisha");
  }
}

export async function logoutAction(): Promise<void> {
  await clearSessionCookie();
  redirect("/mmiliki");
}

const newRestaurantSchema = z.object({
  name: z.string().trim().min(2, "Jaza jina la mkahawa"),
  city: z.string().trim().min(2, "Chagua jiji"),
  neighborhood: z.string().trim().min(2, "Jaza eneo/mtaa"),
  cuisine: z.string().trim().min(2, "Chagua aina ya chakula"),
  priceRange: z.coerce.number().int().min(1).max(3),
  description: z.string().trim().min(10, "Jaza maelezo mafupi"),
  address: z.string().trim().min(4, "Jaza anwani"),
  phone: z.string().trim().min(9, "Jaza namba ya simu"),
  opensAt: z.string().min(1, "Chagua saa ya kufungua"),
  closesAt: z.string().min(1, "Chagua saa ya kufunga"),
});

export async function createRestaurantAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const account = await requireOwnerAccount();
  const parsed = newRestaurantSchema.safeParse(Object.fromEntries(formData));

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Taarifa si sahihi." };
  }

  const restaurant = createRestaurant(parsed.data);
  linkAccountToRestaurant(account.id, restaurant.id);

  redirect("/mmiliki/dashibodi");
}

const restaurantUpdateSchema = newRestaurantSchema.partial();

export async function updateRestaurantAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const account = await requireOwnerAccount();
  if (!account.restaurantId) {
    return { error: "Hakuna mkahawa uliounganishwa na akaunti hii." };
  }

  const parsed = restaurantUpdateSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Taarifa si sahihi." };
  }

  updateRestaurant(account.restaurantId, parsed.data);
  revalidatePath("/mmiliki/dashibodi");
  return {};
}

const menuItemSchema = z.object({
  name: z.string().trim().min(2, "Jaza jina la chakula"),
  category: z.enum(["Chakula Kikuu", "Vitafunio", "Vinywaji"]),
  price: z.coerce.number().int().min(0, "Jaza bei sahihi"),
});

export async function addMenuItemAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const account = await requireOwnerAccount();
  if (!account.restaurantId) {
    return { error: "Hakuna mkahawa uliounganishwa na akaunti hii." };
  }

  const parsed = menuItemSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Taarifa si sahihi." };
  }

  addMenuItem({ restaurantId: account.restaurantId, ...parsed.data });
  revalidatePath("/mmiliki/dashibodi/menyu");
  return {};
}

export async function updateMenuItemAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireOwnerAccount();
  const id = Number(formData.get("id"));
  const parsed = menuItemSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Taarifa si sahihi." };
  }

  updateMenuItem(id, parsed.data);
  revalidatePath("/mmiliki/dashibodi/menyu");
  return {};
}

export async function deleteMenuItemAction(formData: FormData): Promise<void> {
  const account = await requireOwnerAccount();
  if (!account.restaurantId) return;

  const id = Number(formData.get("id"));
  deleteMenuItem(id, account.restaurantId);
  revalidatePath("/mmiliki/dashibodi/menyu");
}
