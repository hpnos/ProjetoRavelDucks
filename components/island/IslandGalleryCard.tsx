import Link from "next/link";
import { UserIsland } from "@/types/island";
import { IslandMiniPreview } from "./IslandMiniPreview";

interface IslandGalleryCardProps {
  island: UserIsland;
}

export function IslandGalleryCard({ island }: IslandGalleryCardProps) {
  return (
    <article className="overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950/80 shadow-xl transition hover:-translate-y-1 hover:border-yellow-400/60 hover:shadow-yellow-500/10">
      <IslandMiniPreview island={island} />

      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-black text-white">
              {island.owner.displayName}
            </h2>
            <p className="text-sm text-zinc-500">@{island.owner.username}</p>
          </div>

          <div className="rounded-full border border-yellow-400/40 bg-yellow-400/10 px-3 py-1 text-xs font-bold uppercase text-yellow-400">
            Ilha
          </div>
        </div>

        <p className="mt-3 text-sm text-zinc-400">{island.owner.title}</p>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-3">
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
              Patos
            </p>
            <p className="mt-1 text-xl font-black text-white">
              {island.collectionStats.totalDucks}
            </p>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-3">
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
              Recompensas
            </p>
            <p className="mt-1 text-xl font-black text-white">
              {island.collectionStats.totalRewards}
            </p>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-3">
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
              Mais raro
            </p>
            <p className="mt-1 text-sm font-black text-yellow-400">
              {island.collectionStats.rarestDuck}
            </p>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-3">
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
              Ravelbox
            </p>
            <p className="mt-1 text-xl font-black text-white">
              {island.collectionStats.ravelboxesUnlocked}
            </p>
          </div>
        </div>

        <Link
          href={`/ilha/${island.owner.username}`}
          className="mt-5 inline-flex w-full justify-center rounded-xl bg-yellow-400 px-4 py-3 text-sm font-black text-zinc-950 transition hover:bg-yellow-300"
        >
          Visitar ilha
        </Link>
      </div>
    </article>
  );
}
