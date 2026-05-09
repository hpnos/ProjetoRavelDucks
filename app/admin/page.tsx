"use client";

import { useEffect, useState } from "react";
import { AdminDataTable } from "@/components/admin/AdminDataTable";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminSectionHeader } from "@/components/admin/AdminSectionHeader";
import { AdminStatCard } from "@/components/admin/AdminStatCard";
import { listActiveCards } from "@/services/cards-service";
import { listDucks } from "@/services/ducks-service";
import { listLatestLiveEvents } from "@/services/live-events-service";
import { listActivePacks } from "@/services/packs-service";
import { listPendingRewards } from "@/services/pending-rewards-service";
import { listUsers } from "@/services/users-service";
import { LiveEventDocument } from "@/types/live-event";

interface AdminDashboardStats {
  ducks: number;
  cards: number;
  packs: number;
  users: number;
  pendingRewards: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminDashboardStats>({
    ducks: 0,
    cards: 0,
    packs: 0,
    users: 0,
    pendingRewards: 0,
  });

  const [events, setEvents] = useState<LiveEventDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  async function loadDashboard() {
    try {
      setIsLoading(true);

      const [ducks, cards, packs, users, rewards, latestEvents] =
        await Promise.all([
          listDucks(),
          listActiveCards(),
          listActivePacks(),
          listUsers(),
          listPendingRewards(),
          listLatestLiveEvents(5),
        ]);

      setStats({
        ducks: ducks.length,
        cards: cards.length,
        packs: packs.length,
        users: users.length,
        pendingRewards: rewards.filter((reward) => reward.status === "pending")
          .length,
      });

      setEvents(latestEvents);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  return (
    <AdminLayout>
      <AdminSectionHeader
        title="Dashboard"
        description="Visão geral real do sistema Ravel Ducks com dados do Firestore."
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <AdminStatCard label="Patos" value={stats.ducks} />
        <AdminStatCard label="Cartas" value={stats.cards} />
        <AdminStatCard label="Pacotes" value={stats.packs} />
        <AdminStatCard label="Usuários" value={stats.users} />
        <AdminStatCard label="Recompensas pendentes" value={stats.pendingRewards} />
      </section>

      <AdminDataTable headers={["Evento recente", "Tipo", "Horário"]}>
        {isLoading && (
          <tr>
            <td colSpan={3} className="px-5 py-6 text-center text-sm text-zinc-400">
              Carregando dashboard...
            </td>
          </tr>
        )}

        {!isLoading && events.length === 0 && (
          <tr>
            <td colSpan={3} className="px-5 py-6 text-center text-sm text-zinc-400">
              Nenhum evento recente.
            </td>
          </tr>
        )}

        {!isLoading &&
          events.map((event) => (
            <tr key={event.id}>
              <td className="px-5 py-4">
                <p className="text-sm font-semibold text-white">
                  {event.icon} {event.title}
                </p>
                <p className="mt-1 text-xs text-zinc-500">
                  {event.description}
                </p>
              </td>

              <td className="px-5 py-4 text-sm text-zinc-400">
                {event.type}
              </td>

              <td className="px-5 py-4 text-sm text-zinc-400">
                {event.createdAt.toLocaleTimeString("pt-BR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </td>
            </tr>
          ))}
      </AdminDataTable>
    </AdminLayout>
  );
}
