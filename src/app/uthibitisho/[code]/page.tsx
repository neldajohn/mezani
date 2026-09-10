import Link from "next/link";
import { notFound } from "next/navigation";
import { getReservationByCode } from "@/lib/reservations";
import { buildReservationWhatsAppLink } from "@/lib/whatsapp";

function formatDate(iso: string): string {
  const date = new Date(`${iso}T00:00:00`);
  return date.toLocaleDateString("sw-TZ", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function UthibitishoPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const reservation = getReservationByCode(code);

  if (!reservation) {
    notFound();
  }

  const { restaurant } = reservation;
  const whatsappLink = buildReservationWhatsAppLink(reservation);

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <div className="flex flex-col items-center text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-forest text-3xl text-white">
          ✅
        </span>
        <h1 className="mt-4 text-2xl font-bold text-forest-dark sm:text-3xl">
          Nafasi Yako Imethibitishwa!
        </h1>
        <p className="mt-2 text-sm text-foreground/60">
          Tumetuma taarifa za nafasi yako. Tunakusubiri, {reservation.fullName.split(" ")[0]}!
        </p>
      </div>

      <div className="mt-8 rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between border-b border-dashed border-black/10 pb-4">
          <div className="flex items-center gap-3">
            <span
              className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br text-2xl ${restaurant.accent}`}
            >
              {restaurant.emoji}
            </span>
            <div>
              <p className="font-semibold text-forest-dark">
                {restaurant.name}
              </p>
              <p className="text-xs text-foreground/60">
                {restaurant.neighborhood}, {restaurant.city}
              </p>
            </div>
          </div>
          <span className="rounded-full bg-sand px-3 py-1 text-xs font-bold tracking-wide text-forest-dark">
            {reservation.code}
          </span>
        </div>

        <dl className="mt-4 grid grid-cols-2 gap-4 text-sm">
          <div>
            <dt className="text-xs font-semibold uppercase text-foreground/50">
              Tarehe
            </dt>
            <dd className="mt-0.5 font-semibold text-forest-dark">
              {formatDate(reservation.reservationDate)}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase text-foreground/50">
              Saa
            </dt>
            <dd className="mt-0.5 font-semibold text-forest-dark">
              {reservation.reservationTime}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase text-foreground/50">
              Idadi ya Watu
            </dt>
            <dd className="mt-0.5 font-semibold text-forest-dark">
              Watu {reservation.partySize}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase text-foreground/50">
              Jina
            </dt>
            <dd className="mt-0.5 font-semibold text-forest-dark">
              {reservation.fullName}
            </dd>
          </div>
        </dl>

        {reservation.specialRequest && (
          <div className="mt-4 rounded-lg bg-sand/60 px-3 py-2 text-sm text-forest-dark">
            <span className="font-semibold">Maombi maalum: </span>
            {reservation.specialRequest}
          </div>
        )}

        <div className="mt-5 rounded-lg bg-forest-dark/5 px-3 py-2 text-xs text-foreground/60">
          Anwani: {restaurant.address} · Simu: {restaurant.phone}
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-[#25D366]/30 bg-[#25D366]/10 p-5 text-center">
        <p className="text-sm text-forest-dark">
          Mjulishe <span className="font-semibold">{restaurant.name}</span> kupitia
          WhatsApp ili wathibitishe nafasi yako haraka zaidi.
        </p>
        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:brightness-95"
        >
          <span aria-hidden>💬</span>
          Thibitisha kwa WhatsApp
        </a>
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Link
          href="/mikahawa"
          className="rounded-full border border-forest px-6 py-2.5 text-center text-sm font-semibold text-forest-dark transition hover:bg-forest hover:text-white"
        >
          Tafuta Mkahawa Mwingine
        </Link>
        <Link
          href={`/mkahawa/${restaurant.slug}`}
          className="rounded-full bg-terracotta px-6 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-terracotta-dark"
        >
          Ona Mkahawa
        </Link>
      </div>
    </div>
  );
}
