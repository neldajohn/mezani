"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { updateRestaurantAction, type ActionState } from "@/app/mmiliki/actions";
import { CUISINES } from "@/lib/seed-data";
import type { Restaurant } from "@/lib/types";

const initialState: ActionState = {};

export function ProfileForm({ restaurant }: { restaurant: Restaurant }) {
  const [state, formAction, pending] = useActionState(
    updateRestaurantAction,
    initialState,
  );
  const [justSaved, setJustSaved] = useState(false);
  const wasPending = useRef(false);

  useEffect(() => {
    if (wasPending.current && !pending && !state.error) {
      setJustSaved(true);
      const timeout = setTimeout(() => setJustSaved(false), 2000);
      return () => clearTimeout(timeout);
    }
    wasPending.current = pending;
  }, [pending, state]);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {state.error && (
        <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.error}
        </div>
      )}

      <label className="flex flex-col gap-1">
        <span className="text-sm font-semibold text-forest-dark">
          Jina la Mkahawa
        </span>
        <input
          name="name"
          type="text"
          required
          defaultValue={restaurant.name}
          className="rounded-lg border border-black/10 px-3 py-2.5 text-sm focus:border-terracotta focus:outline-none"
        />
      </label>

      <div className="grid grid-cols-2 gap-4">
        <label className="flex flex-col gap-1">
          <span className="text-sm font-semibold text-forest-dark">Jiji</span>
          <input
            name="city"
            type="text"
            required
            defaultValue={restaurant.city}
            className="rounded-lg border border-black/10 px-3 py-2.5 text-sm focus:border-terracotta focus:outline-none"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-sm font-semibold text-forest-dark">
            Eneo/Mtaa
          </span>
          <input
            name="neighborhood"
            type="text"
            required
            defaultValue={restaurant.neighborhood}
            className="rounded-lg border border-black/10 px-3 py-2.5 text-sm focus:border-terracotta focus:outline-none"
          />
        </label>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <label className="flex flex-col gap-1">
          <span className="text-sm font-semibold text-forest-dark">
            Aina ya Chakula
          </span>
          <select
            name="cuisine"
            required
            defaultValue={restaurant.cuisine}
            className="rounded-lg border border-black/10 px-3 py-2.5 text-sm focus:border-terracotta focus:outline-none"
          >
            {CUISINES.map((cuisine) => (
              <option key={cuisine} value={cuisine}>
                {cuisine}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-sm font-semibold text-forest-dark">Bei</span>
          <select
            name="priceRange"
            required
            defaultValue={String(restaurant.priceRange)}
            className="rounded-lg border border-black/10 px-3 py-2.5 text-sm focus:border-terracotta focus:outline-none"
          >
            <option value="1">$ — Bei nafuu</option>
            <option value="2">$$ — Wastani</option>
            <option value="3">$$$ — Ghali kidogo</option>
          </select>
        </label>
      </div>

      <label className="flex flex-col gap-1">
        <span className="text-sm font-semibold text-forest-dark">
          Maelezo Mafupi
        </span>
        <textarea
          name="description"
          required
          rows={3}
          defaultValue={restaurant.description}
          className="rounded-lg border border-black/10 px-3 py-2.5 text-sm focus:border-terracotta focus:outline-none"
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-sm font-semibold text-forest-dark">Anwani</span>
        <input
          name="address"
          type="text"
          required
          defaultValue={restaurant.address}
          className="rounded-lg border border-black/10 px-3 py-2.5 text-sm focus:border-terracotta focus:outline-none"
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-sm font-semibold text-forest-dark">
          Namba ya Simu / WhatsApp ya Mkahawa
        </span>
        <input
          name="phone"
          type="tel"
          required
          defaultValue={restaurant.phone}
          className="rounded-lg border border-black/10 px-3 py-2.5 text-sm focus:border-terracotta focus:outline-none"
        />
      </label>

      <div className="grid grid-cols-2 gap-4">
        <label className="flex flex-col gap-1">
          <span className="text-sm font-semibold text-forest-dark">
            Saa ya Kufungua
          </span>
          <input
            name="opensAt"
            type="time"
            required
            defaultValue={restaurant.opensAt}
            className="rounded-lg border border-black/10 px-3 py-2.5 text-sm focus:border-terracotta focus:outline-none"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-sm font-semibold text-forest-dark">
            Saa ya Kufunga
          </span>
          <input
            name="closesAt"
            type="time"
            required
            defaultValue={restaurant.closesAt}
            className="rounded-lg border border-black/10 px-3 py-2.5 text-sm focus:border-terracotta focus:outline-none"
          />
        </label>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-terracotta px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-terracotta-dark disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? "Inahifadhi..." : "Hifadhi Mabadiliko"}
        </button>
        {justSaved && (
          <span className="text-sm font-semibold text-forest">
            ✓ Imehifadhiwa
          </span>
        )}
      </div>
    </form>
  );
}
