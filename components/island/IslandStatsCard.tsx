import { UserIsland } from "@/types/island";

interface IslandStatsCardProps {
  stats: UserIsland["collectionStats"];
}

export function IslandStatsCard({ stats }: IslandStatsCardProps) {
  return (
    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
          Recompensas
        </p>
        <p className="mt-2 text-3xl font-black text-white">
          {stats.totalRewards}
        </p>
      </div>

      <div className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-5 shadow-xl">
        <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">
          Mais raro
        </p>
        <p className="mt-2 text-lg font-black text-yellow-400">
          {stats.rarestDuck}
        </p>
      </div>

      <div className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-5 shadow-xl">
        <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">
          Ravelbox
        </p>
        <p className="mt-2 text-3xl font-black text-white">
          {stats.ravelboxesUnlocked}
        </p>
      </div>
    </section>
  );
}
