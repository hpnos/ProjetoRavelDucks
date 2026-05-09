import { AdminDataTable } from "@/components/admin/AdminDataTable";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminSectionHeader } from "@/components/admin/AdminSectionHeader";
import { AdminStatusBadge } from "@/components/admin/AdminStatusBadge";
import { adminRavelboxes } from "@/lib/admin-mock-data";

export default function AdminRavelboxesPage() {
  return (
    <AdminLayout>
      <AdminSectionHeader
        title="Ravelboxes"
        description="Acompanhe as Ravelboxes desbloqueadas pelos usuários e marque quais já foram entregues."
      />

      <AdminDataTable headers={["Usuário", "Origem", "Recompensa", "Data", "Status"]}>
        {adminRavelboxes.map((reward) => (
          <tr key={reward.id}>
            <td className="px-5 py-4 text-sm font-bold text-white">
              @{reward.username}
            </td>
            <td className="px-5 py-4 text-sm text-zinc-400">
              {reward.source}
            </td>
            <td className="px-5 py-4 text-sm text-zinc-400">
              {reward.rewardName}
            </td>
            <td className="px-5 py-4 text-sm text-zinc-400">
              {reward.createdAt}
            </td>
            <td className="px-5 py-4">
              <AdminStatusBadge status={reward.status} />
            </td>
          </tr>
        ))}
      </AdminDataTable>
    </AdminLayout>
  );
}
