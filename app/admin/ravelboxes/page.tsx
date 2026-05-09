"use client";

import { useEffect, useState } from "react";
import { AdminDataTable } from "@/components/admin/AdminDataTable";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminSectionHeader } from "@/components/admin/AdminSectionHeader";
import { AdminStatusBadge } from "@/components/admin/AdminStatusBadge";
import {
  listPendingRewardsWithUsers,
  updatePendingRewardStatus,
} from "@/services/pending-rewards-service";
import { AppUser, PendingRewardDocument } from "@/types/database";

interface RewardWithUser {
  reward: PendingRewardDocument;
  user: AppUser | null;
}

export default function AdminRavelboxesPage() {
  const [rewards, setRewards] = useState<RewardWithUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  async function loadRewards() {
    try {
      setIsLoading(true);
      const data = await listPendingRewardsWithUsers();
      setRewards(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  async function markAsDelivered(rewardId: string) {
    try {
      await updatePendingRewardStatus(rewardId, "delivered");
      await loadRewards();
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    loadRewards();
  }, []);

  return (
    <AdminLayout>
      <AdminSectionHeader
        title="Ravelboxes"
        description="Ravelboxes reais desbloqueadas pelos usuários e pendentes de entrega."
      />

      <AdminDataTable headers={["Usuário", "Origem", "Recompensa", "Data", "Status", "Ação"]}>
        {isLoading && (
          <tr>
            <td colSpan={6} className="px-5 py-6 text-center text-sm text-zinc-400">
              Carregando Ravelboxes...
            </td>
          </tr>
        )}

        {!isLoading && rewards.length === 0 && (
          <tr>
            <td colSpan={6} className="px-5 py-6 text-center text-sm text-zinc-400">
              Nenhuma Ravelbox pendente.
            </td>
          </tr>
        )}

        {!isLoading &&
          rewards.map(({ reward, user }) => (
            <tr key={reward.id}>
              <td className="px-5 py-4">
                <p className="text-sm font-bold text-white">
                  {user?.displayName ?? "Usuário não encontrado"}
                </p>
                <p className="text-xs text-zinc-500">
                  @{user?.username ?? reward.userId}
                </p>
              </td>

              <td className="px-5 py-4 text-sm text-zinc-400">
                {reward.source}
              </td>

              <td className="px-5 py-4 text-sm text-zinc-400">
                {reward.rewardName}
              </td>

              <td className="px-5 py-4 text-sm text-zinc-400">
                {reward.createdAt.toLocaleDateString("pt-BR")}
              </td>

              <td className="px-5 py-4">
                <AdminStatusBadge status={reward.status} />
              </td>

              <td className="px-5 py-4">
                {reward.status === "pending" ? (
                  <button
                    onClick={() => markAsDelivered(reward.id)}
                    className="rounded-lg bg-yellow-400 px-3 py-2 text-xs font-black text-zinc-950 transition hover:bg-yellow-300"
                  >
                    Marcar entregue
                  </button>
                ) : (
                  <span className="text-xs font-bold text-zinc-500">
                    {reward.status === "delivered" ? "Entregue" : "Cancelado"}
                  </span>
                )}
              </td>
            </tr>
          ))}
      </AdminDataTable>
    </AdminLayout>
  );
}
