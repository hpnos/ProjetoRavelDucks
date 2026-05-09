"use client";

import { useState } from "react";
import { createDuck } from "@/services/ducks-service";

export default function SeedPage() {
  const [message, setMessage] = useState("");

  async function handleSeedDucks() {
    try {
      setMessage("Criando patos...");

      await createDuck({
        id: "duck-junkrat",
        name: "Pato Junkrat",
        slug: "duck-junkrat",
        theme: "Junkrat",
        rarity: "epic",
        maxLevel: 10,
      });

      await createDuck({
        id: "duck-king",
        name: "Pato Rei",
        slug: "duck-king",
        theme: "Realeza",
        rarity: "legendary",
        maxLevel: 10,
      });

      await createDuck({
        id: "duck-basic",
        name: "Pato Clássico",
        slug: "duck-basic",
        theme: "Inicial",
        rarity: "common",
        maxLevel: 10,
      });

      setMessage("Patos iniciais criados com sucesso.");
    } catch (error) {
      console.error(error);
      setMessage("Erro ao criar dados iniciais.");
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-4 text-white">
      <section className="w-full max-w-md rounded-3xl border border-zinc-800 bg-zinc-900 p-8 shadow-xl">
        <p className="text-sm font-bold uppercase tracking-widest text-yellow-400">
          Admin / Seed
        </p>

        <h1 className="mt-2 text-3xl font-black">Dados iniciais</h1>

        <p className="mt-2 text-sm text-zinc-400">
          Use esta tela apenas em desenvolvimento para criar dados iniciais no
          Firestore.
        </p>

        <button
          onClick={handleSeedDucks}
          className="mt-6 w-full rounded-xl bg-yellow-400 px-4 py-3 font-black text-zinc-950 transition hover:bg-yellow-300"
        >
          Criar patos iniciais
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
