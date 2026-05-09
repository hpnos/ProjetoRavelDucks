"use client";

import { useState } from "react";
import { createCard } from "@/services/cards-service";
import { createPack } from "@/services/packs-service";

export default function SeedPacksPage() {
  const [message, setMessage] = useState("");

  async function handleSeedCardsAndPacks() {
    try {
      setMessage("Criando cartas e pacotes...");

      await createCard({
        id: "card-duck-junkrat",
        name: "Pato Junkrat",
        description:
          "Desbloqueia o Pato Junkrat ou futuramente vira XP se for duplicado.",
        type: "duck",
        rarity: "epic",
        duckId: "duck-junkrat",
      });

      await createCard({
        id: "card-xp-junkrat",
        name: "XP Junkrat +100",
        description: "Adiciona 100 XP ao Pato Junkrat.",
        type: "duck_xp",
        rarity: "rare",
        duckId: "duck-junkrat",
        xpAmount: 100,
      });

      await createCard({
        id: "card-border-junkrat",
        name: "Borda Junkrat",
        description: "Borda temática para o perfil.",
        type: "border",
        rarity: "rare",
        duckId: "duck-junkrat",
      });

      await createCard({
        id: "card-pin-junkrat",
        name: "Pin Junkrat",
        description: "Pin colecionável do Pato Junkrat.",
        type: "pin",
        rarity: "common",
        duckId: "duck-junkrat",
      });

      await createCard({
        id: "card-ravelbox",
        name: "Ravelbox",
        description: "Recompensa especial que ficará pendente para entrega.",
        type: "ravelbox",
        rarity: "legendary",
      });

      await createCard({
        id: "card-duck-king",
        name: "Pato Rei",
        description: "Desbloqueia o Pato Rei.",
        type: "duck",
        rarity: "legendary",
        duckId: "duck-king",
      });

      await createPack({
        id: "pack-live",
        name: "Pacote da Live",
        description: "Pacote liberado durante a live do Ravel.",
        cardsQuantity: 4,
        cardPool: [
          "card-duck-junkrat",
          "card-xp-junkrat",
          "card-border-junkrat",
          "card-pin-junkrat",
          "card-ravelbox",
          "card-duck-king",
        ],
      });

      await createPack({
        id: "pack-event",
        name: "Pacote Evento Especial",
        description: "Pacote usado em eventos e recompensas especiais.",
        cardsQuantity: 3,
        cardPool: [
          "card-duck-junkrat",
          "card-xp-junkrat",
          "card-border-junkrat",
          "card-ravelbox",
        ],
      });

      setMessage("Cartas e pacotes criados com sucesso.");
    } catch (error) {
      console.error(error);
      setMessage("Erro ao criar cartas e pacotes.");
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-4 text-white">
      <section className="w-full max-w-md rounded-3xl border border-zinc-800 bg-zinc-900 p-8 shadow-xl">
        <p className="text-sm font-bold uppercase tracking-widest text-yellow-400">
          Admin / Seed
        </p>

        <h1 className="mt-2 text-3xl font-black">Cartas e pacotes</h1>

        <p className="mt-2 text-sm text-zinc-400">
          Use esta tela apenas em desenvolvimento para criar cartas e pacotes
          iniciais no Firestore.
        </p>

        <button
          onClick={handleSeedCardsAndPacks}
          className="mt-6 w-full rounded-xl bg-yellow-400 px-4 py-3 font-black text-zinc-950 transition hover:bg-yellow-300"
        >
          Criar cartas e pacotes
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
