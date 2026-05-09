import { CollectionStats as CollectionStatsType } from "@/types/collection";

interface CollectionStatsProps {
  stats: CollectionStatsType;
}

export function CollectionStats({ stats }: CollectionStatsProps) {
  return (
    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      <div className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-5 shadow-xl">
        <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">
          Patos
        </p>
        <p className="mt-2 text-3xl font-black text-white">
          {stats.totalDucks}
        </p>
      </div>

      <div className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-5 shadow-xl">
        <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">
          Lendários
        </p>
        <p className="mt-2 text-3xl font-black text-yellow-400">
          {stats.totalLegendaryDucks}
        </p>
      </div>

      <div className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-5 shadow-xl">
        <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">
          Épicos
        </p>
        <p className="mt-2 text-3xl font-black text-purple-400">
          {stats.totalEpicDucks}
        </p>
      </div>

      <div className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-5 shadow-xl">
        <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">
          Recompensas
        </p>
        <p className="mt-2 text-3xl font-black text-white">
          {stats.totalRewardsUnlocked}
        </p>
      </div>

      <div className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-5 shadow-xl">
        <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">
          Ravelbox
        </p>
        <p className="mt-2 text-3xl font-black text-white">
          {stats.totalRavelboxes}
        </p>
      </div>
    </section>
  );
}
