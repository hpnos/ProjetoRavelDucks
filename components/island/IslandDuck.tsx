import { IslandDuck as IslandDuckType } from "@/types/island";

interface IslandDuckProps {
  duck: IslandDuckType;
}

const rarityBorder = {
  common: "border-zinc-400",
  rare: "border-sky-400",
  epic: "border-purple-400",
  legendary: "border-yellow-400",
};

const rarityGlow = {
  common: "shadow-zinc-500/20",
  rare: "shadow-sky-500/30",
  epic: "shadow-purple-500/30",
  legendary: "shadow-yellow-500/40",
};

export function IslandDuck({ duck }: IslandDuckProps) {
  return (
    <div
      className="absolute -translate-x-1/2 -translate-y-1/2"
      style={{
        left: duck.position.left,
        top: duck.position.top,
      }}
    >
      <div
        className={[
          "group relative flex h-20 w-20 items-center justify-center rounded-full border-2 bg-zinc-950/80 shadow-xl backdrop-blur",
          rarityBorder[duck.rarity],
          rarityGlow[duck.rarity],
        ].join(" ")}
      >
        <span className="animate-bounce text-4xl">🦆</span>

        <div className="absolute -bottom-9 left-1/2 hidden min-w-[120px] -translate-x-1/2 rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-center shadow-xl group-hover:block">
          <p className="text-xs font-bold text-white">{duck.name}</p>
          <p className="text-[11px] text-zinc-400">Nível {duck.level}</p>
        </div>
      </div>
    </div>
  );
}
