"use client";

import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminSectionHeader } from "@/components/admin/AdminSectionHeader";
import { createLiveEvent } from "@/services/live-events-service";

type TestEventType =
  | "pack_opened"
  | "rare_card"
  | "level_up"
  | "ravelbox"
  | "duck_unlocked";

export default function AdminLiveEventsTestPage() {
  const [message, setMessage] = useState("");

  async function createTestEvent(type: TestEventType) {
    try {
      setMessage("Criando evento...");

      const eventMap = {
        pack_opened: {
          title: "Pacote aberto!",
          description: "Evento de teste: um pacote foi aberto.",
          rarity: "rare" as const,
          icon: "🎴",
        },
        rare_card: {
          title: "Carta lendária revelada!",
          description: "Evento de teste: uma carta lendária apareceu.",
          rarity: "legendary" as const,
          icon: "👑",
        },
        level_up: {
          title: "Pato subiu de nível!",
          description: "Evento de teste: um pato subiu de nível.",
          rarity: "epic" as const,
          icon: "✨",
        },
        ravelbox: {
          title: "Ravelbox desbloqueada!",
          description: "Evento de teste: uma Ravelbox foi desbloqueada.",
          rarity: "legendary" as const,
          icon: "🎁",
        },
        duck_unlocked: {
          title: "Novo pato desbloqueado!",
          description: "Evento de teste: um novo pato entrou na coleção.",
          rarity: "epic" as const,
          icon: "🦆",
        },
      };

      const eventData = eventMap[type];

      await createLiveEvent({
        userId: "test-user",
        username: "teste",
        displayName: "Usuário Teste",
        type,
        title: eventData.title,
        description: eventData.description,
        rarity: eventData.rarity,
        icon: eventData.icon,
      });

      setMessage("Evento criado com sucesso.");
    } catch (error) {
      console.error(error);
      setMessage("Erro ao criar evento.");
    }
  }

  return (
    <AdminLayout>
      <AdminSectionHeader
        title="Teste de eventos"
        description="Crie eventos manuais para testar o overlay no navegador ou no OBS."
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <button
          onClick={() => createTestEvent("pack_opened")}
          className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-6 text-left font-black text-white transition hover:border-yellow-400"
        >
          🎴 Criar pacote aberto
        </button>

        <button
          onClick={() => createTestEvent("rare_card")}
          className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-6 text-left font-black text-white transition hover:border-yellow-400"
        >
          👑 Criar carta lendária
        </button>

        <button
          onClick={() => createTestEvent("level_up")}
          className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-6 text-left font-black text-white transition hover:border-yellow-400"
        >
          ✨ Criar level up
        </button>

        <button
          onClick={() => createTestEvent("ravelbox")}
          className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-6 text-left font-black text-white transition hover:border-yellow-400"
        >
          🎁 Criar Ravelbox
        </button>

        <button
          onClick={() => createTestEvent("duck_unlocked")}
          className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-6 text-left font-black text-white transition hover:border-yellow-400"
        >
          🦆 Criar novo pato
        </button>
      </section>

      {message && (
        <div className="mt-6 rounded-2xl border border-yellow-400/30 bg-yellow-400/10 p-4 text-sm font-bold text-yellow-200">
          {message}
        </div>
      )}
    </AdminLayout>
  );
}
