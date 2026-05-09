"use client";

import Link from "next/link";
import { useState } from "react";
import { OpenPackModal } from "@/components/packs/OpenPackModal";
import { PackCard } from "@/components/packs/PackCard";
import { mockPacks, openMockPack } from "@/lib/packs-mock-data";
import { Pack, PackCardReward } from "@/types/pack";

export default function PacksPage() {
  const [selectedPack, setSelectedPack] = useState<Pack | null>(null);
  const [receivedCards, setReceivedCards] = useState<PackCardReward[]>([]);

  const availablePacks = mockPacks.filter((pack) => pack.status === "available");
  const openedPacks = mockPacks.filter((pack) => pack.status === "opened");

  function handleOpenPack(pack: Pack) {
    const cards = openMockPack(pack.cardsQuantity);

    setSelectedPack(pack);
    setReceivedCards(cards);
  }

  function handleCloseModal() {
    setSelectedPack(null);
    setReceivedCards([]);
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#3f2b00_0,#09090b_45%,#000_100%)] px-4 py-8 text-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <header className="flex flex-col gap-5 rounded-3xl border border-zinc-800 bg-zinc-950/80 p-6 shadow-xl md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-yellow-400">
              Ravel Ducks
            </p>

            <h1 className="mt-2 text-4xl font-black text-white">
              Meus pacotes
            </h1>

            <p className="mt-3 max-w-2xl text-sm text-zinc-400">
              Aqui aparecem os pacotes liberados pelo Ravel durante a live,
              eventos ou recompensas manuais. Não existe pagamento dentro da
              plataforma.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/"
              className="rounded-xl border border-zinc-700 px-4 py-3 text-center text-sm font-bold text-zinc-300 transition hover:border-yellow-400 hover:text-yellow-400"
            >
              Início
            </Link>

            <Link
              href="/colecao"
              className="rounded-xl border border-zinc-700 px-4 py-3 text-center text-sm font-bold text-zinc-300 transition hover:border-yellow-400 hover:text-yellow-400"
            >
              Coleção
            </Link>

            <Link
              href="/ilha/ravel"
              className="rounded-xl bg-yellow-400 px-4 py-3 text-center text-sm font-black text-zinc-950 transition hover:bg-yellow-300"
            >
              Minha ilha
            </Link>
          </div>
        </header>

        <section className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-5 shadow-xl">
            <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">
              Disponíveis
            </p>
            <p className="mt-2 text-3xl font-black text-white">
              {availablePacks.length}
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-5 shadow-xl">
            <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">
              Abertos
            </p>
            <p className="mt-2 text-3xl font-black text-white">
              {openedPacks.length}
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-5 shadow-xl">
            <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">
              Total
            </p>
            <p className="mt-2 text-3xl font-black text-white">
              {mockPacks.length}
            </p>
          </div>
        </section>

        <section>
          <div className="mb-4">
            <h2 className="text-2xl font-black text-white">
              Pacotes disponíveis
            </h2>
            <p className="mt-1 text-sm text-zinc-400">
              Abra os pacotes liberados durante a live.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {availablePacks.map((pack) => (
              <PackCard key={pack.id} pack={pack} onOpen={handleOpenPack} />
            ))}
          </div>
        </section>

        <section>
          <div className="mb-4">
            <h2 className="text-2xl font-black text-white">
              Histórico de pacotes
            </h2>
            <p className="mt-1 text-sm text-zinc-400">
              Pacotes já abertos ou indisponíveis.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {openedPacks.map((pack) => (
              <PackCard key={pack.id} pack={pack} onOpen={handleOpenPack} />
            ))}
          </div>
        </section>
      </div>

      <OpenPackModal
        pack={selectedPack}
        cards={receivedCards}
        onClose={handleCloseModal}
      />
    </main>
  );
}
