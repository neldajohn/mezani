"use client";

import { useActionState, useRef, useEffect } from "react";
import { addMenuItemAction, type ActionState } from "@/app/mmiliki/actions";

const initialState: ActionState = {};

export function AddMenuItemForm() {
  const [state, formAction, pending] = useActionState(
    addMenuItemAction,
    initialState,
  );
  const formRef = useRef<HTMLFormElement>(null);
  const wasPending = useRef(false);

  useEffect(() => {
    if (wasPending.current && !pending && !state.error) {
      formRef.current?.reset();
    }
    wasPending.current = pending;
  }, [pending, state]);

  return (
    <form
      ref={formRef}
      action={formAction}
      className="flex flex-col gap-3 sm:flex-row sm:items-end"
    >
      {state.error && (
        <div className="w-full rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 sm:order-last sm:w-auto">
          {state.error}
        </div>
      )}

      <label className="flex flex-1 flex-col gap-1">
        <span className="text-xs font-semibold text-foreground/60">
          Jina la Chakula
        </span>
        <input
          name="name"
          type="text"
          required
          placeholder="mfano: Wali wa Nyama"
          className="rounded-lg border border-black/10 px-3 py-2 text-sm focus:border-terracotta focus:outline-none"
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-xs font-semibold text-foreground/60">
          Aina
        </span>
        <select
          name="category"
          className="rounded-lg border border-black/10 px-3 py-2 text-sm focus:border-terracotta focus:outline-none"
        >
          <option value="Chakula Kikuu">Chakula Kikuu</option>
          <option value="Vitafunio">Vitafunio</option>
          <option value="Vinywaji">Vinywaji</option>
        </select>
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-xs font-semibold text-foreground/60">
          Bei (TSh)
        </span>
        <input
          name="price"
          type="number"
          min="0"
          step="500"
          required
          placeholder="10000"
          className="w-28 rounded-lg border border-black/10 px-3 py-2 text-sm focus:border-terracotta focus:outline-none"
        />
      </label>

      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-terracotta px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-terracotta-dark disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Inaongeza..." : "Ongeza"}
      </button>
    </form>
  );
}
