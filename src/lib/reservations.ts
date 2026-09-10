import { getDb } from "./db";
import { getRestaurantById } from "./restaurants";
import type {
  Reservation,
  ReservationItem,
  ReservationWithRestaurant,
} from "./types";

type ReservationRow = {
  id: number;
  code: string;
  restaurant_id: number;
  full_name: string;
  phone: string;
  email: string | null;
  party_size: number;
  reservation_date: string;
  reservation_time: string;
  special_request: string | null;
  status: string;
  created_at: string;
};

function rowToReservation(row: ReservationRow): Reservation {
  return {
    id: row.id,
    code: row.code,
    restaurantId: row.restaurant_id,
    fullName: row.full_name,
    phone: row.phone,
    email: row.email,
    partySize: row.party_size,
    reservationDate: row.reservation_date,
    reservationTime: row.reservation_time,
    specialRequest: row.special_request,
    status: row.status,
    createdAt: row.created_at,
  };
}

function generateCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "MZ-";
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

export type NewReservationItem = {
  menuItemId: number;
  quantity: number;
};

export type NewReservation = {
  restaurantId: number;
  fullName: string;
  phone: string;
  email?: string | null;
  partySize: number;
  reservationDate: string;
  reservationTime: string;
  specialRequest?: string | null;
  items?: NewReservationItem[];
};

export function createReservation(data: NewReservation): Reservation {
  const db = getDb();
  const code = generateCode();

  const insert = db.prepare(`
    INSERT INTO reservations
      (code, restaurant_id, full_name, phone, email, party_size,
       reservation_date, reservation_time, special_request)
    VALUES
      (@code, @restaurantId, @fullName, @phone, @email, @partySize,
       @reservationDate, @reservationTime, @specialRequest)
  `);

  const insertItem = db.prepare(`
    INSERT INTO reservation_items (reservation_id, menu_item_id, quantity)
    VALUES (@reservationId, @menuItemId, @quantity)
  `);

  const reservationId = db.transaction(() => {
    const result = insert.run({
      code,
      restaurantId: data.restaurantId,
      fullName: data.fullName,
      phone: data.phone,
      email: data.email ?? null,
      partySize: data.partySize,
      reservationDate: data.reservationDate,
      reservationTime: data.reservationTime,
      specialRequest: data.specialRequest ?? null,
    });

    for (const item of data.items ?? []) {
      insertItem.run({
        reservationId: result.lastInsertRowid,
        menuItemId: item.menuItemId,
        quantity: item.quantity,
      });
    }

    return result.lastInsertRowid;
  })();

  const row = db
    .prepare("SELECT * FROM reservations WHERE id = ?")
    .get(reservationId) as ReservationRow;

  return rowToReservation(row);
}

function getReservationItems(reservationId: number): ReservationItem[] {
  const db = getDb();
  const rows = db
    .prepare(
      `SELECT mi.id as menu_item_id, mi.name, mi.price, ri.quantity
       FROM reservation_items ri
       JOIN menu_items mi ON mi.id = ri.menu_item_id
       WHERE ri.reservation_id = ?`,
    )
    .all(reservationId) as {
    menu_item_id: number;
    name: string;
    price: number;
    quantity: number;
  }[];

  return rows.map((row) => ({
    menuItemId: row.menu_item_id,
    name: row.name,
    price: row.price,
    quantity: row.quantity,
  }));
}

export function getReservationByCode(code: string): ReservationWithRestaurant | null {
  const db = getDb();
  const row = db
    .prepare("SELECT * FROM reservations WHERE code = ?")
    .get(code) as ReservationRow | undefined;

  if (!row) return null;
  const reservation = rowToReservation(row);
  const restaurant = getRestaurantById(reservation.restaurantId);
  if (!restaurant) return null;

  return {
    ...reservation,
    restaurant,
    items: getReservationItems(reservation.id),
  };
}

export function getReservationsForRestaurant(
  restaurantId: number,
): Reservation[] {
  const db = getDb();
  const rows = db
    .prepare(
      "SELECT * FROM reservations WHERE restaurant_id = ? ORDER BY reservation_date DESC, reservation_time DESC",
    )
    .all(restaurantId) as ReservationRow[];
  return rows.map(rowToReservation);
}
