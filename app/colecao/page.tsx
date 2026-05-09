import Link from "next/link";
import { CollectionStats } from "@/components/collection/CollectionStats";
import { DuckCollectionGrid } from "@/components/collection/DuckCollectionGrid";
import {
  mockCollectionDucks,
  mockCollectionStats,
} from "@/lib/collection-mock-data";

export default function CollectionPage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#3f2b00_0,#09090b_45%,#000_100%)] px-4 py-8 text-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <header className="flex flex-col gap-5 rounded-3xl border border-zinc-800 bg-zinc-950/80 p-6 shadow-xl md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-yellow-400">
              Ravel Ducks
            </p>

            <h1 className="mt-2 text-4xl font-black text-white">
              Minha coleção
            </h1>

            <p className="mt-3 max-w-2xl text-sm text-zinc-400">
              Veja todos os patinhos que você desbloqueou, acompanhe o nível,
              XP e as recompensas liberadas em cada trilha de progressão.
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
              href="/ilhas"
              className="rounded-xl border border-zinc-700 px-4 py-3 text-center text-sm font-bold text-zinc-300 transition hover:border-yellow-400 hover:text-yellow-400"
            >
              Galeria
            </Link>

            <Link
              href="/ilha/ravel"
              className="rounded-xl bg-yellow-400 px-4 py-3 text-center text-sm font-black text-zinc-950 transition hover:bg-yellow-300"
            >
              Ver minha ilha
            </Link>
          </div>
        </header>

        <CollectionStats stats={mockCollectionStats} />

        <DuckCollectionGrid ducks={mockCollectionDucks} />
      </div>
    </main>
  );
}
