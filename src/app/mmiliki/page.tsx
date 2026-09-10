import { redirect } from "next/navigation";
import { getSessionAccount } from "@/lib/owner-session";
import { RequestCodeForm } from "@/components/owner/RequestCodeForm";

export default async function MmilikiPage() {
  const account = await getSessionAccount();
  if (account) {
    redirect(account.restaurantId ? "/mmiliki/dashibodi" : "/mmiliki/anzisha");
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16 sm:px-6">
      <div className="text-center">
        <span className="text-4xl">🏪</span>
        <h1 className="mt-3 text-2xl font-bold text-forest-dark">
          Wamiliki wa Mikahawa
        </h1>
        <p className="mt-2 text-sm text-foreground/60">
          Jisajili au ingia kwa namba yako ya WhatsApp ili kusimamia mkahawa
          wako kwenye Mezani — menyu, taarifa na nafasi zilizowekwa.
        </p>
      </div>

      <div className="mt-8 rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
        <RequestCodeForm />
      </div>
    </div>
  );
}
