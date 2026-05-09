import { AdminDataTable } from "@/components/admin/AdminDataTable";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminSectionHeader } from "@/components/admin/AdminSectionHeader";
import { AdminStatusBadge } from "@/components/admin/AdminStatusBadge";
import { adminPacks } from "@/lib/admin-mock-data";

const sourceLabel = {
  live_purchase: "Live",
  event_reward: "Evento",
  manual_bonus: "Bônus manual",
  admin: "Admin",
};

export default function AdminPacksPage() {
  return (
    <AdminLayout>
      <AdminSectionHeader
        title="Pacotes"
        description="Gerencie os tipos de pacotes que podem ser liberados para os usuários."
        actionLabel="Novo pacote"
      />

      <AdminDataTable headers={["Nome", "Cartas", "Origem", "Status"]}>
        {adminPacks.map((pack) => (
          <tr key={pack.id}>
            <td className="px-5 py-4 text-sm font-bold text-white">
              {pack.name}
            </td>
            <td className="px-5 py-4 text-sm text-zinc-400">
              {pack.cardsQuantity}
            </td>
            <td className="px-5 py-4 text-sm text-zinc-400">
              {sourceLabel[pack.source]}
            </td>
            <td className="px-5 py-4">
              <AdminStatusBadge status={pack.status} />
            </td>
          </tr>
        ))}
      </AdminDataTable>
    </AdminLayout>
  );
}
