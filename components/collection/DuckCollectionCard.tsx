import Link from "next/link";
import { CollectionDuck } from "@/types/collection";

interface DuckCollectionCardProps {
  duck: CollectionDuck;
}

const rarityLabel = {
  common: "Comum",
  rare: "Raro",
  epic: "Épico",
  legendary: "Lendário",
};

const rarityBadge = {
  common: "border-zinc-500/40 bg-zinc-500/10 text-zinc-300",
  rare: "border-sky-500/40 bg-sky-500/10 text-sky-300",
  epic: "border-purple-500/40 bg-purple-500/10 text-purple-300",
  legendary: "border-yellow-500/40 bg-yellow-500/10 text-yellow-300",
};

const rarityGlow = {
  common: "hover:border-zinc-400/60",
  rare: "hover:border-sky-400/60 hover:shadow-sky-500/10",
  epic: "hover:border-purple-400/60 hover:shadow-purple-500/10",
  legendary: "hover:border-yellow-400/60 hover:shadow-yellow-500/10",
};

export function DuckCollectionCard({ duck }: DuckCollectionCardProps) {
  const xpPercentage = Math.min((duck.xp / duck.nextLevelXp) * 100, 100);
  const rewardsPercentage = Math.min(
    (duck.unlockedRewards / duck.totalRewards) * 100,
    100
  );

  return (
    <article
      className={[
        "overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950/80 shadow-xl transition hover:-translate-y-1",
        rarityGlow[duck.rarity],
      ].join(" ")}
    >
      <div className="relative flex h-52 items-center justify-center bg-gradient-to-br from-zinc-900 via-zinc-950 to-black">
        {duck.isFavorite && (
          <div className="absolute left-4 top-4 rounded-full bg-yellow-400 px-3 py-1 text-xs font-black text-zinc-950">
            Favorito
          </div>
        )}

        <div
          className={[
            "absolute right-4 top-4 rounded-full border px-3 py-1 text-xs font-bold uppercase",
            rarityBadge[duck.rarity],
          ].join(" ")}
        >
          {rarityLabel[duck.rarity]}
        </div>

        <div className="flex h-28 w-28 items-center justify-center rounded-full border border-yellow-400/30 bg-yellow-400/10 text-6xl shadow-xl">
          🦆
        </div>
      </div>

      <div className="p-5">
        <div>
          <h2 className="text-xl font-black text-white">{duck.name}</h2>
          <p className="text-sm text-zinc-500">Tema: {duck.theme}</p>
        </div>

        <div className="mt-5">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="font-semibold text-zinc-200">
              Nível {duck.level}/{duck.maxLevel}
            </span>
            <span className="text-zinc-500">
              {duck.xp}/{duck.nextLevelXp} XP
            </span>
          </div>

          <div className="h-3 overflow-hidden rounded-full bg-zinc-800">
            <div
              className="h-full rounded-full bg-yellow-400"
              style={{ width: `${xpPercentage}%` }}
            />
          </div>
        </div>

        <div className="mt-5">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="font-semibold text-zinc-200">Recompensas</span>
            <span className="text-zinc-500">
              {duck.unlockedRewards}/{duck.totalRewards}
            </span>
          </div>

          <div className="h-3 overflow-hidden rounded-full bg-zinc-800">
            <div
              className="h-full rounded-full bg-emerald-400"
              style={{ width: `${rewardsPercentage}%` }}
            />
          </div>
        </div>

        <Link
          href={`/patos/${duck.id}`}
          className="mt-6 inline-flex w-full justify-center rounded-xl bg-yellow-400 px-4 py-3 text-sm font-black text-zinc-950 transition hover:bg-yellow-300"
        >
          Ver progresso
        </Link>
      </div>
    </article>
  );
}
