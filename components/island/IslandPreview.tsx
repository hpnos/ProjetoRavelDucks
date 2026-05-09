import { UserIsland } from "@/types/island";
import { IslandDuck } from "./IslandDuck";
import { IslandItem } from "./IslandItem";

interface IslandPreviewProps {
  island: UserIsland;
}

export function IslandPreview({ island }: IslandPreviewProps) {
  return (
    <section className="overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-950 shadow-2xl">
      <div className="border-b border-zinc-800 bg-zinc-950/90 px-6 py-4">
        <p className="text-xs font-bold uppercase tracking-widest text-yellow-400">
          Ilha pública
        </p>
        <h1 className="mt-1 text-2xl font-black text-white">
          Ilha de {island.owner.displayName}
        </h1>
      </div>

      <div className="relative h-[520px] overflow-hidden bg-gradient-to-b from-sky-400 via-emerald-300 to-yellow-200">
        {/* Céu */}
        <div className="absolute left-10 top-10 h-20 w-20 rounded-full bg-white/70 blur-sm" />
        <div className="absolute right-16 top-20 h-16 w-32 rounded-full bg-white/50 blur-sm" />

        {/* Água */}
        <div className="absolute bottom-0 h-40 w-full bg-sky-500/80" />

        {/* Ilha */}
        <div className="absolute left-1/2 top-[58%] h-72 w-[620px] -translate-x-1/2 -translate-y-1/2 rounded-[50%] bg-gradient-to-b from-emerald-500 to-emerald-800 shadow-2xl">
          <div className="absolute inset-x-10 bottom-0 h-20 rounded-[50%] bg-yellow-700/80" />
          <div className="absolute left-1/2 top-[48%] h-40 w-[460px] -translate-x-1/2 -translate-y-1/2 rounded-[50%] bg-emerald-400/80" />
        </div>

        {/* Objetos da ilha */}
        {island.items.map((item) => (
          <IslandItem key={item.id} item={item} />
        ))}

        {/* Patos */}
        {island.ducks.map((duck) => (
          <IslandDuck key={duck.id} duck={duck} />
        ))}
      </div>
    </section>
  );
}
