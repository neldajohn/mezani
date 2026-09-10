import { redirect } from "next/navigation";
import { VerifyCodeForm } from "@/components/owner/VerifyCodeForm";

type SearchParams = {
  simu?: string;
  dev_code?: string;
};

export default async function ThibitishaPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const query = await searchParams;
  if (!query.simu) {
    redirect("/mmiliki");
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16 sm:px-6">
      <div className="text-center">
        <span className="text-4xl">💬</span>
        <h1 className="mt-3 text-2xl font-bold text-forest-dark">
          Weka Namba ya Uthibitisho
        </h1>
        <p className="mt-2 text-sm text-foreground/60">
          Tumetuma namba ya uthibitisho kwa {query.simu}.
        </p>
      </div>

      {query.dev_code && (
        <div className="mt-6 rounded-2xl border border-amber-300 bg-amber-50 p-4 text-center text-sm text-amber-900">
          <p className="font-semibold">Hali ya majaribio (Dev Mode)</p>
          <p className="mt-1">
            Hakuna huduma halisi ya WhatsApp iliyounganishwa bado, hivyo
            namba yako ya uthibitisho imeonyeshwa hapa moja kwa moja:
          </p>
          <p className="mt-2 text-2xl font-bold tracking-widest">
            {query.dev_code}
          </p>
        </div>
      )}

      <div className="mt-6 rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
        <VerifyCodeForm
          whatsappNumber={query.simu}
          prefillCode={query.dev_code}
        />
      </div>
    </div>
  );
}
