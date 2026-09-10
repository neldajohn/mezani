import { getDb } from "./db";
import { ensureSeeded } from "./restaurants";
import type { MenuItem } from "./types";

type MenuItemRow = {
  id: number;
  restaurant_id: number;
  name: string;
  category: string;
  price: number;
};

function rowToMenuItem(row: MenuItemRow): MenuItem {
  return {
    id: row.id,
    restaurantId: row.restaurant_id,
    name: row.name,
    category: row.category,
    price: row.price,
  };
}

export function getMenuItems(restaurantId: number): MenuItem[] {
  ensureSeeded();
  const db = getDb();
  const rows = db
    .prepare(
      "SELECT * FROM menu_items WHERE restaurant_id = ? ORDER BY sort_order, id",
    )
    .all(restaurantId) as MenuItemRow[];
  return rows.map(rowToMenuItem);
}

export function getMenuItemsByIds(ids: number[]): MenuItem[] {
  if (ids.length === 0) return [];
  const db = getDb();
  const placeholders = ids.map(() => "?").join(",");
  const rows = db
    .prepare(`SELECT * FROM menu_items WHERE id IN (${placeholders})`)
    .all(...ids) as MenuItemRow[];
  return rows.map(rowToMenuItem);
}

export type NewMenuItem = {
  restaurantId: number;
  name: string;
  category: string;
  price: number;
};

export function addMenuItem(data: NewMenuItem): MenuItem {
  const db = getDb();
  const { count } = db
    .prepare("SELECT COUNT(*) as count FROM menu_items WHERE restaurant_id = ?")
    .get(data.restaurantId) as { count: number };

  const result = db
    .prepare(
      `INSERT INTO menu_items (restaurant_id, name, category, price, sort_order)
       VALUES (@restaurantId, @name, @category, @price, @sortOrder)`,
    )
    .run({ ...data, sortOrder: count });

  const row = db
    .prepare("SELECT * FROM menu_items WHERE id = ?")
    .get(result.lastInsertRowid) as MenuItemRow;
  return rowToMenuItem(row);
}

export function updateMenuItem(
  id: number,
  data: Partial<Pick<NewMenuItem, "name" | "category" | "price">>,
): void {
  const db = getDb();
  const fields: string[] = [];
  const params: Record<string, unknown> = { id };

  for (const key of ["name", "category", "price"] as const) {
    if (data[key] !== undefined) {
      fields.push(`${key} = @${key}`);
      params[key] = data[key];
    }
  }

  if (fields.length === 0) return;
  db.prepare(`UPDATE menu_items SET ${fields.join(", ")} WHERE id = @id`).run(
    params,
  );
}

export function deleteMenuItem(id: number, restaurantId: number): void {
  const db = getDb();
  db.prepare(
    "DELETE FROM menu_items WHERE id = ? AND restaurant_id = ?",
  ).run(id, restaurantId);
}
