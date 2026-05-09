import { UserIsland } from "@/types/island";

interface IslandMiniPreviewProps {
  island: UserIsland;
}

const rarityRing = {
  common: "ring-zinc-400",
  rare: "ring-sky-400",
  epic: "ring-purple-400",
  legendary: "ring-yellow-400",
};

const itemIcon = {
  duck: "🦆",
  decoration: "🌴",
  accessory: "🎩",
  background: "🏝️",
  special: "🚩",
};

export function IslandMiniPreview({ island }: IslandMiniPreviewProps) {
  return (
    <div className="relative h-48 overflow-hidden rounded-2xl border border-zinc-800 bg-gradient-to-b from-sky-400 via-emerald-300 to-yellow-200">
      {/* Céu */}
      <div className="absolute left-6 top-5 h-10 w-16 rounded-full bg-white/60 blur-sm" />
      <div className="absolute right-6 top-8 h-8 w-14 rounded-full bg-white/50 blur-sm" />

      {/* Água */}
      <div className="absolute bottom-0 h-14 w-full bg-sky-500/80" />

      {/* Ilha */}
      <div className="absolute left-1/2 top-[58%] h-28 w-64 -translate-x-1/2 -translate-y-1/2 rounded-[50%] bg-gradient-to-b from-emerald-500 to-emerald-800 shadow-xl">
        <div className="absolute inset-x-8 bottom-0 h-8 rounded-[50%] bg-yellow-700/80" />
        <div className="absolute left-1/2 top-[45%] h-14 w-44 -translate-x-1/2 -translate-y-1/2 rounded-[50%] bg-emerald-400/80" />
      </div>

      {/* Itens */}
      {island.items.slice(0, 3).map((item) => (
        <div
          key={item.id}
          className="absolute flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-lg border border-zinc-700 bg-zinc-950/70 text-lg shadow-lg"
          style={{
            left: item.position.left,
            top: item.position.top,
          }}
          title={item.name}
        >
          {itemIcon[item.type]}
        </div>
      ))}

      {/* Patos */}
      {island.ducks.slice(0, 3).map((duck) => (
        <div
          key={duck.id}
          className={[
            "absolute flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-zinc-950/80 text-xl shadow-lg ring-2",
            rarityRing[duck.rarity],
          ].join(" ")}
          style={{
            left: duck.position.left,
            top: duck.position.top,
          }}
          title={`${duck.name} - nível ${duck.level}`}
        >
          🦆
        </div>
      ))}
    </div>
  );
}
