"use client";

import { useActionState } from "react";
import { requestLoginCodeAction, type ActionState } from "@/app/mmiliki/actions";

const initialState: ActionState = {};

export function RequestCodeForm() {
  const [state, formAction, pending] = useActionState(
    requestLoginCodeAction,
    initialState,
  );

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {state.error && (
        <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.error}
        </div>
      )}

      <label className="flex flex-col gap-1">
        <span className="text-sm font-semibold text-forest-dark">
          Namba ya WhatsApp
        </span>
        <input
          name="phone"
          type="tel"
          required
          placeholder="mfano: 0712 345 678"
          className="rounded-lg border border-black/10 px-3 py-2.5 text-sm focus:border-terracotta focus:outline-none"
        />
      </label>

      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-terracotta px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-terracotta-dark disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Inatuma..." : "Tuma Namba ya Uthibitisho"}
      </button>

      <p className="text-center text-xs text-foreground/50">
        Tutakutumia namba ya uthibitisho ya tarakimu 6.
      </p>
    </form>
  );
}
