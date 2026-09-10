import { redirect } from "next/navigation";
import { requireOwnerAccount } from "@/lib/owner-guard";
import { OnboardingForm } from "@/components/owner/OnboardingForm";

export default async function AnzishaPage() {
  const account = await requireOwnerAccount();
  if (account.restaurantId) {
    redirect("/mmiliki/dashibodi");
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <div className="text-center">
        <span className="text-4xl">🍽️</span>
        <h1 className="mt-3 text-2xl font-bold text-forest-dark">
          Sajili Mkahawa Wako
        </h1>
        <p className="mt-2 text-sm text-foreground/60">
          Jaza taarifa za mkahawa wako ili uonekane kwenye Mezani. Unaweza
          kubadilisha taarifa hizi wakati wowote kutoka dashibodi yako.
        </p>
      </div>

      <div className="mt-6 rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
        <OnboardingForm />
      </div>
    </div>
  );
}
