import { redirect } from "next/navigation";
import Link from "next/link";
import { requireOwnerAccount } from "@/lib/owner-guard";
import { getRestaurantById } from "@/lib/restaurants";
import { logoutAction } from "@/app/mmiliki/actions";

export default async function DashibodiLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const account = await requireOwnerAccount();
  if (!account.restaurantId) {
    redirect("/mmiliki/anzisha");
  }

  const restaurant = getRestaurantById(account.restaurantId);
  if (!restaurant) {
    redirect("/mmiliki/anzisha");
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-black/10 pb-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-foreground/50">
            Dashibodi ya Mmiliki
          </p>
          <h1 className="text-xl font-bold text-forest-dark">
            {restaurant.name}
          </h1>
        </div>
        <form action={logoutAction}>
          <button
            type="submit"
            className="rounded-full border border-forest px-4 py-1.5 text-sm font-semibold text-forest-dark transition hover:bg-forest hover:text-white"
          >
            Toka
          </button>
        </form>
      </div>

      <nav className="mt-4 flex gap-2">
        <Link
          href="/mmiliki/dashibodi"
          className="rounded-full bg-sand px-4 py-1.5 text-sm font-semibold text-forest-dark transition hover:bg-sand/70"
        >
          Muhtasari
        </Link>
        <Link
          href="/mmiliki/dashibodi/menyu"
          className="rounded-full bg-sand px-4 py-1.5 text-sm font-semibold text-forest-dark transition hover:bg-sand/70"
        >
          Menyu
        </Link>
      </nav>

      <div className="mt-6">{children}</div>
    </div>
  );
}
