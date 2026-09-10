"use client";

import { useMemo, useState } from "react";
import type { MenuItem } from "@/lib/types";

function formatTsh(amount: number): string {
  return `TSh ${amount.toLocaleString("sw-TZ")}`;
}

export function MenuPicker({ items }: { items: MenuItem[] }) {
  const [quantities, setQuantities] = useState<Record<number, number>>({});

  const grouped = useMemo(() => {
    const groups = new Map<string, MenuItem[]>();
    for (const item of items) {
      const list = groups.get(item.category) ?? [];
      list.push(item);
      groups.set(item.category, list);
    }
    return Array.from(groups.entries());
  }, [items]);

  const total = items.reduce(
    (sum, item) => sum + item.price * (quantities[item.id] ?? 0),
    0,
  );

  function setQuantity(id: number, quantity: number) {
    setQuantities((prev) => ({ ...prev, [id]: Math.max(0, quantity) }));
  }

  if (items.length === 0) return null;

  return (
    <div className="flex flex-col gap-1">
      <span className="text-sm font-semibold text-forest-dark">
        Chagua kutoka Menyu{" "}
        <span className="font-normal text-foreground/50">(hiari)</span>
      </span>

      <div className="mt-1 flex flex-col gap-4 rounded-lg border border-black/10 p-3">
        {grouped.map(([category, categoryItems]) => (
          <div key={category}>
            <p className="text-xs font-semibold uppercase tracking-wide text-foreground/50">
              {category}
            </p>
            <div className="mt-2 flex flex-col gap-2">
              {categoryItems.map((item) => {
                const quantity = quantities[item.id] ?? 0;
                return (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-3"
                  >
                    <input
                      type="hidden"
                      name={`item_${item.id}`}
                      value={quantity}
                    />
                    <div>
                      <p className="text-sm text-forest-dark">{item.name}</p>
                      <p className="text-xs text-foreground/50">
                        {formatTsh(item.price)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setQuantity(item.id, quantity - 1)}
                        disabled={quantity === 0}
                        className="flex h-7 w-7 items-center justify-center rounded-full bg-sand text-forest-dark transition hover:bg-sand/70 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        −
                      </button>
                      <span className="w-4 text-center text-sm font-semibold text-forest-dark">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => setQuantity(item.id, quantity + 1)}
                        className="flex h-7 w-7 items-center justify-center rounded-full bg-sand text-forest-dark transition hover:bg-sand/70"
                      >
                        +
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {total > 0 && (
          <div className="flex justify-between border-t border-black/10 pt-3 text-sm font-semibold text-forest-dark">
            <span>Jumla</span>
            <span>{formatTsh(total)}</span>
          </div>
        )}
      </div>
    </div>
  );
}
