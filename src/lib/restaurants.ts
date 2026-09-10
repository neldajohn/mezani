import { getDb } from "./db";
import { SEED_RESTAURANTS } from "./seed-data";
import { classifyDish, estimatePrice } from "./menu";
import type { Restaurant } from "./types";

type RestaurantRow = {
  id: number;
  slug: string;
  name: string;
  city: string;
  neighborhood: string;
  cuisine: string;
  price_range: number;
  rating: number;
  review_count: number;
  description: string;
  address: string;
  phone: string;
  opens_at: string;
  closes_at: string;
  accent: string;
  emoji: string;
  popular_dishes: string;
};

function rowToRestaurant(row: RestaurantRow): Restaurant {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    city: row.city,
    neighborhood: row.neighborhood,
    cuisine: row.cuisine,
    priceRange: row.price_range,
    rating: row.rating,
    reviewCount: row.review_count,
    description: row.description,
    address: row.address,
    phone: row.phone,
    opensAt: row.opens_at,
    closesAt: row.closes_at,
    accent: row.accent,
    emoji: row.emoji,
    popularDishes: JSON.parse(row.popular_dishes),
  };
}

let seeded = false;

export function ensureSeeded() {
  if (seeded) return;
  const db = getDb();
  const { count } = db
    .prepare("SELECT COUNT(*) as count FROM restaurants")
    .get() as { count: number };

  if (count === 0) {
    const insertRestaurant = db.prepare(`
      INSERT INTO restaurants
        (slug, name, city, neighborhood, cuisine, price_range, rating, review_count,
         description, address, phone, opens_at, closes_at, accent, emoji, popular_dishes)
      VALUES
        (@slug, @name, @city, @neighborhood, @cuisine, @priceRange, @rating, @reviewCount,
         @description, @address, @phone, @opensAt, @closesAt, @accent, @emoji, @popularDishes)
    `);

    const insertMenuItem = db.prepare(`
      INSERT INTO menu_items (restaurant_id, name, category, price, sort_order)
      VALUES (@restaurantId, @name, @category, @price, @sortOrder)
    `);

    const insertAll = db.transaction(() => {
      for (const r of SEED_RESTAURANTS) {
        const result = insertRestaurant.run({
          ...r,
          popularDishes: JSON.stringify(r.popularDishes),
        });
        const restaurantId = result.lastInsertRowid;

        r.popularDishes.forEach((dish, index) => {
          insertMenuItem.run({
            restaurantId,
            name: dish,
            category: classifyDish(dish),
            price: estimatePrice(dish, r.priceRange),
            sortOrder: index,
          });
        });
      }
    });

    insertAll();
  }

  seeded = true;
}

export type RestaurantFilters = {
  city?: string;
  cuisine?: string;
  query?: string;
};

export function listRestaurants(filters: RestaurantFilters = {}): Restaurant[] {
  ensureSeeded();
  const db = getDb();

  const clauses: string[] = [];
  const params: Record<string, string> = {};

  if (filters.city) {
    clauses.push("city = @city");
    params.city = filters.city;
  }
  if (filters.cuisine) {
    clauses.push("cuisine = @cuisine");
    params.cuisine = filters.cuisine;
  }
  if (filters.query) {
    clauses.push("(name LIKE @query OR cuisine LIKE @query OR neighborhood LIKE @query)");
    params.query = `%${filters.query}%`;
  }

  const where = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";
  const rows = db
    .prepare(`SELECT * FROM restaurants ${where} ORDER BY rating DESC`)
    .all(params) as RestaurantRow[];

  return rows.map(rowToRestaurant);
}

export function getRestaurantBySlug(slug: string): Restaurant | null {
  ensureSeeded();
  const db = getDb();
  const row = db
    .prepare("SELECT * FROM restaurants WHERE slug = ?")
    .get(slug) as RestaurantRow | undefined;
  return row ? rowToRestaurant(row) : null;
}

export function getRestaurantById(id: number): Restaurant | null {
  ensureSeeded();
  const db = getDb();
  const row = db
    .prepare("SELECT * FROM restaurants WHERE id = ?")
    .get(id) as RestaurantRow | undefined;
  return row ? rowToRestaurant(row) : null;
}

export function getFeaturedRestaurants(limit = 6): Restaurant[] {
  ensureSeeded();
  const db = getDb();
  const rows = db
    .prepare("SELECT * FROM restaurants ORDER BY rating DESC, review_count DESC LIMIT ?")
    .all(limit) as RestaurantRow[];
  return rows.map(rowToRestaurant);
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export type NewRestaurant = {
  name: string;
  city: string;
  neighborhood: string;
  cuisine: string;
  priceRange: number;
  description: string;
  address: string;
  phone: string;
  opensAt: string;
  closesAt: string;
};

export function createRestaurant(data: NewRestaurant): Restaurant {
  ensureSeeded();
  const db = getDb();

  let slug = slugify(`${data.name}-${data.city}`);
  if (getRestaurantBySlug(slug)) {
    slug = `${slug}-${Date.now().toString(36)}`;
  }

  const result = db
    .prepare(
      `INSERT INTO restaurants
        (slug, name, city, neighborhood, cuisine, price_range, rating, review_count,
         description, address, phone, opens_at, closes_at, accent, emoji, popular_dishes)
       VALUES
        (@slug, @name, @city, @neighborhood, @cuisine, @priceRange, 0, 0,
         @description, @address, @phone, @opensAt, @closesAt, @accent, @emoji, @popularDishes)`,
    )
    .run({
      ...data,
      slug,
      accent: "from-forest to-forest-dark",
      emoji: "🍽️",
      popularDishes: "[]",
    });

  return getRestaurantById(Number(result.lastInsertRowid))!;
}

export type RestaurantUpdate = Partial<NewRestaurant>;

export function updateRestaurant(id: number, data: RestaurantUpdate): void {
  const db = getDb();
  const fields: string[] = [];
  const params: Record<string, unknown> = { id };

  const columnMap: Record<keyof NewRestaurant, string> = {
    name: "name",
    city: "city",
    neighborhood: "neighborhood",
    cuisine: "cuisine",
    priceRange: "price_range",
    description: "description",
    address: "address",
    phone: "phone",
    opensAt: "opens_at",
    closesAt: "closes_at",
  };

  for (const [key, column] of Object.entries(columnMap) as [
    keyof NewRestaurant,
    string,
  ][]) {
    if (data[key] !== undefined) {
      fields.push(`${column} = @${key}`);
      params[key] = data[key];
    }
  }

  if (fields.length === 0) return;

  db.prepare(`UPDATE restaurants SET ${fields.join(", ")} WHERE id = @id`).run(
    params,
  );
}
