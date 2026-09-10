import { requireOwnerAccount } from "@/lib/owner-guard";
import { getMenuItems } from "@/lib/menu-items";
import { MenuItemRow } from "@/components/owner/MenuItemRow";
import { AddMenuItemForm } from "@/components/owner/AddMenuItemForm";

export default async function MenyuPage() {
  const account = await requireOwnerAccount();
  const items = getMenuItems(account.restaurantId!);

  return (
    <div className="flex flex-col gap-6">
      <section className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-forest-dark">
          Menyu ({items.length})
        </h2>

        {items.length === 0 ? (
          <p className="mt-3 text-sm text-foreground/60">
            Bado hujaongeza chakula chochote kwenye menyu yako.
          </p>
        ) : (
          <div className="mt-4 flex flex-col gap-2">
            {items.map((item) => (
              <MenuItemRow key={item.id} item={item} />
            ))}
          </div>
        )}
      </section>

      <section className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-forest-dark">Ongeza Chakula</h2>
        <div className="mt-4">
          <AddMenuItemForm />
        </div>
      </section>
    </div>
  );
}
