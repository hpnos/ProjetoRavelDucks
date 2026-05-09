"use client";

import { CardDocument, ResolvedGrantedPack } from "@/types/database";
import { RealReceivedCard } from "./RealReceivedCard";

interface RealOpenPackModalProps {
  pack: ResolvedGrantedPack | null;
  cards: CardDocument[];
  messages?: string[];
  error?: string;
  onClose: () => void;
}

export function RealOpenPackModal({
  pack,
  cards,
  messages = [],
  error,
  onClose,
}: RealOpenPackModalProps) {
  if (!pack) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 py-8">
      <section className="max-h-[90vh] w-full max-w-6xl overflow-y-auto rounded-3xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl">
        <header className="flex flex-col gap-4 border-b border-zinc-800 pb-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-yellow-400">
              Resultado da abertura
            </p>

            <h2 className="mt-1 text-3xl font-black text-white">
              {pack.pack.name}
            </h2>

            <p className="mt-2 text-sm text-zinc-400">
              Cartas reveladas neste pacote.
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl border border-zinc-700 px-4 py-3 text-sm font-bold text-zinc-300 transition hover:border-yellow-400 hover:text-yellow-400"
          >
            Fechar
          </button>
        </header>

        {error ? (
          <div className="mt-6 rounded-2xl border border-red-500/40 bg-red-500/10 p-4 text-sm font-bold text-red-300">
            {error}
          </div>
        ) : (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {cards.map((card) => (
              <RealReceivedCard key={card.id} card={card} />
            ))}
          </div>
        )}

        {messages.length > 0 && (
          <div className="mt-6 rounded-2xl border border-emerald-400/30 bg-emerald-400/10 p-4">
            <p className="text-sm font-black text-emerald-300">
              Resultado aplicado na coleção:
            </p>

            <ul className="mt-3 grid gap-2 text-sm text-emerald-100">
              {messages.map((message) => (
                <li key={message}>• {message}</li>
              ))}
            </ul>
          </div>
        )}
      </section>
    </div>
  );
}
