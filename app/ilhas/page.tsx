import Link from "next/link";
import { IslandGalleryGrid } from "@/components/island/IslandGalleryGrid";
import { mockIslandsGallery } from "@/lib/islands-gallery-mock-data";

export default function IslandsGalleryPage() {
  const totalIslands = mockIslandsGallery.length;

  const totalDucks = mockIslandsGallery.reduce(
    (acc, island) => acc + island.collectionStats.totalDucks,
    0
  );

  const totalRewards = mockIslandsGallery.reduce(
    (acc, island) => acc + island.collectionStats.totalRewards,
    0
  );

  const totalRavelboxes = mockIslandsGallery.reduce(
    (acc, island) => acc + island.collectionStats.ravelboxesUnlocked,
    0
  );

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#0f766e_0,#09090b_45%,#000_100%)] px-4 py-8 text-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <header className="flex flex-col gap-5 rounded-3xl border border-zinc-800 bg-zinc-950/80 p-6 shadow-xl md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-yellow-400">
              Ravel Ducks
            </p>

            <h1 className="mt-2 text-4xl font-black text-white">
              Galeria de ilhas
            </h1>

            <p className="mt-3 max-w-2xl text-sm text-zinc-400">
              Explore as ilhas públicas dos colecionadores, veja seus patinhos,
              recompensas desbloqueadas e visite os perfis da comunidade.
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
              href="/ilha/ravel"
              className="rounded-xl bg-yellow-400 px-4 py-3 text-center text-sm font-black text-zinc-950 transition hover:bg-yellow-300"
            >
              Ver ilha exemplo
            </Link>
          </div>
        </header>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-5 shadow-xl">
            <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">
              Ilhas
            </p>
            <p className="mt-2 text-3xl font-black text-white">
              {totalIslands}
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-5 shadow-xl">
            <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">
              Patos
            </p>
            <p className="mt-2 text-3xl font-black text-white">
              {totalDucks}
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-5 shadow-xl">
            <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">
              Recompensas
            </p>
            <p className="mt-2 text-3xl font-black text-white">
              {totalRewards}
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-5 shadow-xl">
            <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">
              Ravelbox
            </p>
            <p className="mt-2 text-3xl font-black text-white">
              {totalRavelboxes}
            </p>
          </div>
        </section>

        <IslandGalleryGrid islands={mockIslandsGallery} />
      </div>
    </main>
  );
}
