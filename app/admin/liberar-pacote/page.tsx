"use client";

import { FormEvent, useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminSectionHeader } from "@/components/admin/AdminSectionHeader";
import { useAuthUser } from "@/hooks/use-auth-user";
import { listActivePacks } from "@/services/packs-service";
import { grantPackToUser } from "@/services/granted-packs-service";
import { listUsers } from "@/services/users-service";
import { AppUser, PackDocument } from "@/types/database";

export default function AdminGrantPackPage() {
  const { user } = useAuthUser();

  const [packs, setPacks] = useState<PackDocument[]>([]);
  const [users, setUsers] = useState<AppUser[]>([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedPackId, setSelectedPackId] = useState("");
  const [reason, setReason] = useState<
    "live_purchase" | "event_reward" | "manual_bonus" | "admin"
  >("live_purchase");
  const [message, setMessage] = useState("");

  async function loadData() {
    try {
      const [activePacks, realUsers] = await Promise.all([
        listActivePacks(),
        listUsers(),
      ]);

      setPacks(activePacks);
      setUsers(realUsers);

      if (activePacks.length > 0) {
        setSelectedPackId(activePacks[0].id);
      }

      if (realUsers.length > 0) {
        setSelectedUserId(realUsers[0].id);
      }
    } catch (error) {
      console.error(error);
      setMessage("Erro ao carregar usuários ou pacotes.");
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setMessage("");

      if (!user) {
        setMessage("Você precisa estar logado para liberar pacote.");
        return;
      }

      if (!selectedUserId || !selectedPackId) {
        setMessage("Selecione usuário e pacote.");
        return;
      }

      await grantPackToUser({
        userId: selectedUserId,
        packId: selectedPackId,
        reason,
        grantedBy: user.uid,
      });

      setMessage("Pacote liberado com sucesso.");
    } catch (error) {
      console.error(error);
      setMessage("Erro ao liberar pacote.");
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  return (
    <AdminLayout>
      <AdminSectionHeader
        title="Liberar pacote"
        description="Libere um pacote real para qualquer usuário cadastrado no Firestore."
      />

      <section className="rounded-3xl border border-zinc-800 bg-zinc-950/80 p-6 shadow-xl">
        <form onSubmit={handleSubmit} className="grid gap-5">
          <div>
            <label className="mb-2 block text-sm font-bold text-zinc-300">
              Usuário
            </label>

            <select
              value={selectedUserId}
              onChange={(event) => setSelectedUserId(event.target.value)}
              className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-white outline-none focus:border-yellow-400"
            >
              {users.map((appUser) => (
                <option key={appUser.id} value={appUser.id}>
                  {appUser.displayName} (@{appUser.username}) — {appUser.email}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-zinc-300">
              Pacote
            </label>

            <select
              value={selectedPackId}
              onChange={(event) => setSelectedPackId(event.target.value)}
              className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-white outline-none focus:border-yellow-400"
            >
              {packs.map((pack) => (
                <option key={pack.id} value={pack.id}>
                  {pack.name} - {pack.cardsQuantity} cartas
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-zinc-300">
              Motivo da liberação
            </label>

            <select
              value={reason}
              onChange={(event) =>
                setReason(
                  event.target.value as
                    | "live_purchase"
                    | "event_reward"
                    | "manual_bonus"
                    | "admin"
                )
              }
              className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-white outline-none focus:border-yellow-400"
            >
              <option value="live_purchase">Compra/combinação na live</option>
              <option value="event_reward">Recompensa de evento</option>
              <option value="manual_bonus">Bônus manual</option>
              <option value="admin">Ajuste admin</option>
            </select>
          </div>

          {message && (
            <div className="rounded-2xl border border-yellow-400/30 bg-yellow-400/10 p-4 text-sm text-yellow-200">
              {message}
            </div>
          )}

          <button
            type="submit"
            className="rounded-xl bg-yellow-400 px-5 py-3 text-sm font-black text-zinc-950 transition hover:bg-yellow-300"
          >
            Liberar pacote
          </button>
        </form>
      </section>
    </AdminLayout>
  );
}
