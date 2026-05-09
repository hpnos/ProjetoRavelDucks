import { IslandOwner } from "@/types/island";

interface IslandProfileCardProps {
  owner: IslandOwner;
  backgroundName: string;
}

export function IslandProfileCard({
  owner,
  backgroundName,
}: IslandProfileCardProps) {
  return (
    <aside className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-6 shadow-xl">
      <div className="flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full border border-yellow-400/40 bg-yellow-400/10 text-3xl">
          🦆
        </div>

        <div>
          <h2 className="text-2xl font-black text-white">{owner.displayName}</h2>
          <p className="text-sm text-zinc-400">@{owner.username}</p>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-4">
          <p className="text-xs font-bold uppercase tracking-widest text-yellow-400">
            Título
          </p>
          <p className="mt-1 text-sm font-semibold text-white">{owner.title}</p>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-4">
          <p className="text-xs font-bold uppercase tracking-widest text-yellow-400">
            Ilha
          </p>
          <p className="mt-1 text-sm font-semibold text-white">
            {backgroundName}
          </p>
        </div>
      </div>
    </aside>
  );
}
