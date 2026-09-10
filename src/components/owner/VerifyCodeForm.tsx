"use client";

import { useActionState } from "react";
import { verifyLoginCodeAction, type ActionState } from "@/app/mmiliki/actions";

const initialState: ActionState = {};

export function VerifyCodeForm({
  whatsappNumber,
  prefillCode,
}: {
  whatsappNumber: string;
  prefillCode?: string;
}) {
  const [state, formAction, pending] = useActionState(
    verifyLoginCodeAction,
    initialState,
  );

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <input type="hidden" name="whatsappNumber" value={whatsappNumber} />

      {state.error && (
        <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.error}
        </div>
      )}

      <label className="flex flex-col gap-1">
        <span className="text-sm font-semibold text-forest-dark">
          Namba ya Uthibitisho
        </span>
        <input
          name="code"
          type="text"
          inputMode="numeric"
          required
          defaultValue={prefillCode}
          placeholder="123456"
          className="rounded-lg border border-black/10 px-3 py-2.5 text-center text-lg tracking-widest focus:border-terracotta focus:outline-none"
        />
      </label>

      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-terracotta px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-terracotta-dark disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Inathibitisha..." : "Ingia"}
      </button>
    </form>
  );
}
