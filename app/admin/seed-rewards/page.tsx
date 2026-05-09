"use client";

import { useState } from "react";
import { createDuckReward } from "@/services/duck-rewards-service";

export default function SeedRewardsPage() {
  const [message, setMessage] = useState("");

  async function handleSeedRewards() {
    try {
      setMessage("Criando recompensas...");

      const rewards = [
        {
          id: "reward-junkrat-1",
          duckId: "duck-junkrat",
          level: 1,
          name: "Pato Junkrat",
          type: "duck" as const,
          description: "Desbloqueia o Pato Junkrat na coleção.",
        },
        {
          id: "reward-junkrat-2",
          duckId: "duck-junkrat",
          level: 2,
          name: "Borda temática Junkrat",
          type: "border" as const,
          description: "Uma borda temática para destacar o perfil.",
        },
        {
          id: "reward-junkrat-3",
          duckId: "duck-junkrat",
          level: 3,
          name: "Pin Junkrat",
          type: "pin" as const,
          description: "Um pin colecionável do Pato Junkrat.",
        },
        {
          id: "reward-junkrat-4",
          duckId: "duck-junkrat",
          level: 4,
          name: "Acessório Junkrat na ilha",
          type: "island_item" as const,
          description: "Um acessório temático para decorar a ilha.",
        },
        {
          id: "reward-junkrat-5",
          duckId: "duck-junkrat",
          level: 5,
          name: "Arte digital HD",
          type: "digital_art" as const,
          description: "Arte digital em alta definição do Pato Junkrat.",
        },
        {
          id: "reward-junkrat-6",
          duckId: "duck-junkrat",
          level: 6,
          name: "Ravelbox",
          type: "ravelbox" as const,
          description: "Uma Ravelbox como recompensa especial.",
        },
        {
          id: "reward-junkrat-7",
          duckId: "duck-junkrat",
          level: 7,
          name: "Acessório lendário de ilha",
          type: "island_item" as const,
          description: "Um item visual mais raro para a ilha.",
        },
        {
          id: "reward-junkrat-8",
          duckId: "duck-junkrat",
          level: 8,
          name: "Junkrat Rei",
          type: "skin" as const,
          description: "Visual evoluído do Pato Junkrat.",
        },
        {
          id: "reward-junkrat-9",
          duckId: "duck-junkrat",
          level: 9,
          name: "Borda lendária",
          type: "border" as const,
          description: "Uma borda lendária para o perfil.",
        },
        {
          id: "reward-junkrat-10",
          duckId: "duck-junkrat",
          level: 10,
          name: "Ravelbox Final",
          type: "ravelbox" as const,
          description: "Recompensa final da trilha do Pato Junkrat.",
        },
      ];

      for (const reward of rewards) {
        await createDuckReward(reward);
      }

      setMessage("Recompensas criadas com sucesso.");
    } catch (error) {
      console.error(error);
      setMessage("Erro ao criar recompensas.");
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-4 text-white">
      <section className="w-full max-w-md rounded-3xl border border-zinc-800 bg-zinc-900 p-8 shadow-xl">
        <p className="text-sm font-bold uppercase tracking-widest text-yellow-400">
          Admin / Seed
        </p>

        <h1 className="mt-2 text-3xl font-black">Recompensas</h1>

        <p className="mt-2 text-sm text-zinc-400">
          Use esta tela em desenvolvimento para criar a trilha de recompensas do
          Pato Junkrat.
        </p>

        <button
          onClick={handleSeedRewards}
          className="mt-6 w-full rounded-xl bg-yellow-400 px-4 py-3 font-black text-zinc-950 transition hover:bg-yellow-300"
        >
          Criar recompensas
        </button>

        {message && (
          <p className="mt-4 rounded-xl border border-zinc-800 bg-zinc-950 p-3 text-sm text-zinc-300">
            {message}
          </p>
        )}
      </section>
    </main>
  );
}
