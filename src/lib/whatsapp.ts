import type { ReservationWithRestaurant } from "./types";

function toWhatsAppDigits(phone: string): string {
  return phone.replace(/\D/g, "");
}

function formatDateSw(iso: string): string {
  const date = new Date(`${iso}T00:00:00`);
  return date.toLocaleDateString("sw-TZ", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function buildReservationWhatsAppLink(
  reservation: ReservationWithRestaurant,
): string {
  const { restaurant } = reservation;
  const number = toWhatsAppDigits(restaurant.phone);

  const lines = [
    `Habari ${restaurant.name}! Ningependa kuthibitisha nafasi yangu:`,
    ``,
    `Jina: ${reservation.fullName}`,
    `Tarehe: ${formatDateSw(reservation.reservationDate)}`,
    `Saa: ${reservation.reservationTime}`,
    `Idadi ya Watu: ${reservation.partySize}`,
    `Namba ya Nafasi: ${reservation.code}`,
  ];

  if (reservation.items.length > 0) {
    lines.push(``, `Menyu:`);
    let total = 0;
    for (const item of reservation.items) {
      lines.push(`- ${item.name} x${item.quantity}`);
      total += item.price * item.quantity;
    }
    lines.push(`Jumla ya menyu: TSh ${total.toLocaleString("sw-TZ")}`);
  }

  if (reservation.specialRequest) {
    lines.push(`Maombi maalum: ${reservation.specialRequest}`);
  }

  lines.push(``, `Asante!`);

  const text = encodeURIComponent(lines.join("\n"));
  return `https://wa.me/${number}?text=${text}`;
}
