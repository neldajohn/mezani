"use client";

import { useActionState } from "react";
import { createRestaurantAction, type ActionState } from "@/app/mmiliki/actions";
import { CITIES, CUISINES } from "@/lib/seed-data";

const initialState: ActionState = {};

export function OnboardingForm() {
  const [state, formAction, pending] = useActionState(
    createRestaurantAction,
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
          Jina la Mkahawa
        </span>
        <input
          name="name"
          type="text"
          required
          placeholder="mfano: Fahari Lodge"
          className="rounded-lg border border-black/10 px-3 py-2.5 text-sm focus:border-terracotta focus:outline-none"
        />
      </label>

      <div className="grid grid-cols-2 gap-4">
        <label className="flex flex-col gap-1">
          <span className="text-sm font-semibold text-forest-dark">Jiji</span>
          <input
            name="city"
            list="cities"
            required
            placeholder="mfano: Dodoma"
            className="rounded-lg border border-black/10 px-3 py-2.5 text-sm focus:border-terracotta focus:outline-none"
          />
          <datalist id="cities">
            {CITIES.map((city) => (
              <option key={city} value={city} />
            ))}
          </datalist>
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-sm font-semibold text-forest-dark">
            Eneo/Mtaa
          </span>
          <input
            name="neighborhood"
            type="text"
            required
            placeholder="mfano: Nyerere Square"
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
            defaultValue="2"
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
          placeholder="Eleza mkahawa wako kwa ufupi..."
          className="rounded-lg border border-black/10 px-3 py-2.5 text-sm focus:border-terracotta focus:outline-none"
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-sm font-semibold text-forest-dark">Anwani</span>
        <input
          name="address"
          type="text"
          required
          placeholder="mfano: Barabara ya Nyerere Square, Dodoma"
          className="rounded-lg border border-black/10 px-3 py-2.5 text-sm focus:border-terracotta focus:outline-none"
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-sm font-semibold text-forest-dark">
          Namba ya Simu ya Mkahawa
        </span>
        <input
          name="phone"
          type="tel"
          required
          placeholder="mfano: +255 712 345 678"
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
            defaultValue="08:00"
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
            defaultValue="22:00"
            className="rounded-lg border border-black/10 px-3 py-2.5 text-sm focus:border-terracotta focus:outline-none"
          />
        </label>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="mt-2 rounded-lg bg-terracotta px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-terracotta-dark disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Inasajili..." : "Sajili Mkahawa"}
      </button>
    </form>
  );
}
