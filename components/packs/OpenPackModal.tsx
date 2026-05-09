"use client";

import { Pack, PackCardReward } from "@/types/pack";
import { ReceivedCard } from "./ReceivedCard";
import { PackSummary } from "./PackSummary";

interface OpenPackModalProps {
  pack: Pack | null;
  cards: PackCardReward[];
  onClose: () => void;
}

export function OpenPackModal({ pack, cards, onClose }: OpenPackModalProps) {
  if (!pack) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 py-8">
      <section className="max-h-[90vh] w-full max-w-6xl overflow-y-auto rounded-3xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl">
        <header className="flex flex-col gap-4 border-b border-zinc-800 pb-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-yellow-400">
              Pacote aberto
            </p>
            <h2 className="mt-1 text-3xl font-black text-white">
              {pack.name}
            </h2>
            <p className="mt-2 text-sm text-zinc-400">
              Essas foram as cartas reveladas neste pacote.
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl border border-zinc-700 px-4 py-3 text-sm font-bold text-zinc-300 transition hover:border-yellow-400 hover:text-yellow-400"
          >
            Fechar
          </button>
        </header>

        <div className="mt-6">
          <PackSummary cards={cards} />
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((card) => (
            <ReceivedCard key={`${card.id}-${Math.random()}`} card={card} />
          ))}
        </div>

        <div className="mt-6 rounded-2xl border border-yellow-400/30 bg-yellow-400/10 p-4 text-sm text-yellow-200">
          Nesta versão mockada, as cartas ainda não são salvas na coleção.
          Futuramente, pato novo será adicionado ao inventário, duplicata virará
          XP e Ravelbox entrará como recompensa pendente no painel admin.
        </div>
      </section>
    </div>
  );
}
