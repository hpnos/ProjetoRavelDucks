"use client";

import { useEffect, useState } from "react";
import { AdminDataTable } from "@/components/admin/AdminDataTable";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminSectionHeader } from "@/components/admin/AdminSectionHeader";
import { listDucks } from "@/services/ducks-service";
import { listRewardsByDuckId } from "@/services/duck-rewards-service";
import { DuckDocument, DuckRewardDocument } from "@/types/database";

interface RewardWithDuck {
  reward: DuckRewardDocument;
  duck: DuckDocument | null;
}

export default function AdminRewardsPage() {
  const [items, setItems] = useState<RewardWithDuck[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  async function loadRewards() {
    try {
      setIsLoading(true);

      const ducks = (await listDucks()) as DuckDocument[];

      const rewardsByDuck = await Promise.all(
        ducks.map(async (duck) => {
          const rewards = await listRewardsByDuckId(duck.id);

          return rewards.map((reward) => ({
            reward,
            duck,
          }));
        })
      );

      setItems(rewardsByDuck.flat());
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadRewards();
  }, []);

  return (
    <AdminLayout>
      <AdminSectionHeader
        title="Recompensas"
        description="Trilhas de recompensa cadastradas para os patos."
        actionLabel="Nova recompensa"
        actionHref="/admin/recompensas/nova"
      />

      <AdminDataTable headers={["Pato", "Nível", "Recompensa", "Tipo"]}>
        {isLoading && (
          <tr>
            <td colSpan={4} className="px-5 py-6 text-center text-sm text-zinc-400">
              Carregando recompensas...
            </td>
          </tr>
        )}

        {!isLoading && items.length === 0 && (
          <tr>
            <td colSpan={4} className="px-5 py-6 text-center text-sm text-zinc-400">
              Nenhuma recompensa cadastrada.
            </td>
          </tr>
        )}

        {!isLoading &&
          items.map(({ reward, duck }) => (
            <tr key={reward.id}>
              <td className="px-5 py-4 text-sm font-bold text-white">
                {duck?.name ?? reward.duckId}
              </td>
              <td className="px-5 py-4 text-sm text-zinc-400">
                {reward.level}
              </td>
              <td className="px-5 py-4">
                <p className="text-sm font-bold text-white">{reward.name}</p>
                <p className="mt-1 text-xs text-zinc-500">
                  {reward.description}
                </p>
              </td>
              <td className="px-5 py-4 text-sm text-zinc-400">
                {reward.type}
              </td>
            </tr>
          ))}
      </AdminDataTable>
    </AdminLayout>
  );
}
