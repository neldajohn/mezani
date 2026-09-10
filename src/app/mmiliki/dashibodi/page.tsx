import { requireOwnerAccount } from "@/lib/owner-guard";
import { getRestaurantById } from "@/lib/restaurants";
import { getReservationsForRestaurant } from "@/lib/reservations";
import { ProfileForm } from "@/components/owner/ProfileForm";

function formatDate(iso: string): string {
  const date = new Date(`${iso}T00:00:00`);
  return date.toLocaleDateString("sw-TZ", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default async function DashibodiPage() {
  const account = await requireOwnerAccount();
  const restaurant = getRestaurantById(account.restaurantId!)!;
  const reservations = getReservationsForRestaurant(restaurant.id);

  return (
    <div className="flex flex-col gap-8">
      <section className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-forest-dark">Taarifa za Mkahawa</h2>
        <div className="mt-4">
          <ProfileForm restaurant={restaurant} />
        </div>
      </section>

      <section className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-forest-dark">
          Nafasi Zilizowekwa ({reservations.length})
        </h2>

        {reservations.length === 0 ? (
          <p className="mt-3 text-sm text-foreground/60">
            Bado hakuna nafasi zilizowekwa.
          </p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[520px] text-left text-sm">
              <thead>
                <tr className="border-b border-black/10 text-xs uppercase text-foreground/50">
                  <th className="pb-2 pr-4">Jina</th>
                  <th className="pb-2 pr-4">Tarehe</th>
                  <th className="pb-2 pr-4">Saa</th>
                  <th className="pb-2 pr-4">Watu</th>
                  <th className="pb-2 pr-4">Simu</th>
                  <th className="pb-2">Namba</th>
                </tr>
              </thead>
              <tbody>
                {reservations.map((reservation) => (
                  <tr key={reservation.id} className="border-b border-black/5">
                    <td className="py-2 pr-4 font-medium text-forest-dark">
                      {reservation.fullName}
                    </td>
                    <td className="py-2 pr-4">
                      {formatDate(reservation.reservationDate)}
                    </td>
                    <td className="py-2 pr-4">{reservation.reservationTime}</td>
                    <td className="py-2 pr-4">{reservation.partySize}</td>
                    <td className="py-2 pr-4">{reservation.phone}</td>
                    <td className="py-2 text-xs font-semibold text-terracotta">
                      {reservation.code}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
