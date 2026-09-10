"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import {
  updateMenuItemAction,
  deleteMenuItemAction,
  type ActionState,
} from "@/app/mmiliki/actions";
import type { MenuItem } from "@/lib/types";

const initialState: ActionState = {};

export function MenuItemRow({ item }: { item: MenuItem }) {
  const [editing, setEditing] = useState(false);
  const [state, formAction, pending] = useActionState(
    updateMenuItemAction,
    initialState,
  );
  const wasPending = useRef(false);

  useEffect(() => {
    if (wasPending.current && !pending && !state.error) {
      setEditing(false);
    }
    wasPending.current = pending;
  }, [pending, state]);

  if (editing) {
    return (
      <form
        action={formAction}
        className="flex flex-col gap-2 rounded-lg border border-black/10 p-3 sm:flex-row sm:items-end"
      >
        <input type="hidden" name="id" value={item.id} />

        {state.error && (
          <div className="w-full rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {state.error}
          </div>
        )}

        <input
          name="name"
          type="text"
          required
          defaultValue={item.name}
          className="flex-1 rounded-lg border border-black/10 px-3 py-2 text-sm focus:border-terracotta focus:outline-none"
        />
        <select
          name="category"
          defaultValue={item.category}
          className="rounded-lg border border-black/10 px-3 py-2 text-sm focus:border-terracotta focus:outline-none"
        >
          <option value="Chakula Kikuu">Chakula Kikuu</option>
          <option value="Vitafunio">Vitafunio</option>
          <option value="Vinywaji">Vinywaji</option>
        </select>
        <input
          name="price"
          type="number"
          min="0"
          step="500"
          required
          defaultValue={item.price}
          className="w-28 rounded-lg border border-black/10 px-3 py-2 text-sm focus:border-terracotta focus:outline-none"
        />

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={pending}
            className="rounded-lg bg-terracotta px-4 py-2 text-sm font-semibold text-white transition hover:bg-terracotta-dark disabled:opacity-60"
          >
            Hifadhi
          </button>
          <button
            type="button"
            onClick={() => setEditing(false)}
            className="rounded-lg border border-black/10 px-4 py-2 text-sm font-semibold text-forest-dark"
          >
            Ghairi
          </button>
        </div>
      </form>
    );
  }

  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-black/5 bg-sand/40 px-4 py-3">
      <div>
        <p className="text-sm font-semibold text-forest-dark">{item.name}</p>
        <p className="text-xs text-foreground/50">
          {item.category} · TSh {item.price.toLocaleString("sw-TZ")}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="rounded-full border border-forest px-3 py-1 text-xs font-semibold text-forest-dark transition hover:bg-forest hover:text-white"
        >
          Hariri
        </button>
        <form action={deleteMenuItemAction}>
          <input type="hidden" name="id" value={item.id} />
          <button
            type="submit"
            className="rounded-full border border-red-300 px-3 py-1 text-xs font-semibold text-red-600 transition hover:bg-red-50"
          >
            Futa
          </button>
        </form>
      </div>
    </div>
  );
}
