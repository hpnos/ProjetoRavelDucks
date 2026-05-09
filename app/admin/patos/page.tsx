import { AdminDataTable } from "@/components/admin/AdminDataTable";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminSectionHeader } from "@/components/admin/AdminSectionHeader";
import { AdminStatusBadge } from "@/components/admin/AdminStatusBadge";
import { adminDucks } from "@/lib/admin-mock-data";

const rarityLabel = {
  common: "Comum",
  rare: "Raro",
  epic: "Épico",
  legendary: "Lendário",
};

export default function AdminDucksPage() {
  return (
    <AdminLayout>
      <AdminSectionHeader
        title="Patos"
        description="Gerencie os patinhos colecionáveis que podem ser desbloqueados pelos usuários."
        actionLabel="Novo pato"
      />

      <AdminDataTable headers={["Nome", "Tema", "Raridade", "Nível máximo", "Status"]}>
        {adminDucks.map((duck) => (
          <tr key={duck.id}>
            <td className="px-5 py-4 text-sm font-bold text-white">
              {duck.name}
            </td>
            <td className="px-5 py-4 text-sm text-zinc-400">{duck.theme}</td>
            <td className="px-5 py-4 text-sm text-zinc-400">
              {rarityLabel[duck.rarity]}
            </td>
            <td className="px-5 py-4 text-sm text-zinc-400">
              {duck.maxLevel}
            </td>
            <td className="px-5 py-4">
              <AdminStatusBadge status={duck.status} />
            </td>
          </tr>
        ))}
      </AdminDataTable>
    </AdminLayout>
  );
}
