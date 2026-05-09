import { AdminDataTable } from "@/components/admin/AdminDataTable";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminSectionHeader } from "@/components/admin/AdminSectionHeader";
import { AdminStatCard } from "@/components/admin/AdminStatCard";
import {
  adminCards,
  adminDucks,
  adminPacks,
  adminRavelboxes,
  adminRecentActions,
  adminUsers,
} from "@/lib/admin-mock-data";

export default function AdminDashboardPage() {
  const pendingRavelboxes = adminRavelboxes.filter(
    (item) => item.status === "pending"
  ).length;

  return (
    <AdminLayout>
      <AdminSectionHeader
        title="Dashboard"
        description="Visão geral do sistema Ravel Ducks, com cadastros, pacotes, usuários e recompensas pendentes."
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <AdminStatCard label="Patos" value={adminDucks.length} />
        <AdminStatCard label="Cartas" value={adminCards.length} />
        <AdminStatCard label="Pacotes" value={adminPacks.length} />
        <AdminStatCard label="Usuários" value={adminUsers.length} />
        <AdminStatCard label="Ravelboxes pendentes" value={pendingRavelboxes} />
      </section>

      <AdminDataTable headers={["Ação recente", "Tipo", "Data"]}>
        {adminRecentActions.map((action) => (
          <tr key={action.id}>
            <td className="px-5 py-4 text-sm font-semibold text-white">
              {action.description}
            </td>
            <td className="px-5 py-4 text-sm text-zinc-400">{action.type}</td>
            <td className="px-5 py-4 text-sm text-zinc-400">
              {action.createdAt}
            </td>
          </tr>
        ))}
      </AdminDataTable>
    </AdminLayout>
  );
}
