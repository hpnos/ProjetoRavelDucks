import { AdminDataTable } from "@/components/admin/AdminDataTable";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminSectionHeader } from "@/components/admin/AdminSectionHeader";
import { AdminStatusBadge } from "@/components/admin/AdminStatusBadge";
import { adminCards } from "@/lib/admin-mock-data";

const rarityLabel = {
  common: "Comum",
  rare: "Raro",
  epic: "Épico",
  legendary: "Lendário",
};

const typeLabel = {
  duck: "Pato",
  duck_xp: "XP",
  island_item: "Item de ilha",
  accessory: "Acessório",
  border: "Borda",
  pin: "Pin",
  digital_art: "Arte digital",
  ravelbox: "Ravelbox",
};

export default function AdminCardsPage() {
  return (
    <AdminLayout>
      <AdminSectionHeader
        title="Cartas"
        description="Gerencie as cartas que podem sair nos pacotes liberados durante a live."
        actionLabel="Nova carta"
      />

      <AdminDataTable headers={["Nome", "Tipo", "Raridade", "Pato relacionado", "Status"]}>
        {adminCards.map((card) => (
          <tr key={card.id}>
            <td className="px-5 py-4 text-sm font-bold text-white">
              {card.name}
            </td>
            <td className="px-5 py-4 text-sm text-zinc-400">
              {typeLabel[card.type]}
            </td>
            <td className="px-5 py-4 text-sm text-zinc-400">
              {rarityLabel[card.rarity]}
            </td>
            <td className="px-5 py-4 text-sm text-zinc-400">
              {card.relatedDuck ?? "-"}
            </td>
            <td className="px-5 py-4">
              <AdminStatusBadge status={card.status} />
            </td>
          </tr>
        ))}
      </AdminDataTable>
    </AdminLayout>
  );
}
