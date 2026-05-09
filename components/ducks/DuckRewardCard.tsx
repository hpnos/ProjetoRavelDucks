import { DuckReward } from "@/types/duck";

interface DuckRewardCardProps {
  reward: DuckReward;
  currentLevel: number;
}

const rewardTypeLabel = {
  duck: "Pato",
  border: "Borda",
  pin: "Pin",
  island_accessory: "Ilha",
  digital_art: "Arte",
  ravelbox: "Ravelbox",
  skin: "Visual",
};

export function DuckRewardCard({ reward, currentLevel }: DuckRewardCardProps) {
  const isUnlocked = currentLevel >= reward.level;
  const isCurrent = currentLevel === reward.level;

  return (
    <article
      className={[
        "min-w-[150px] rounded-xl border p-4 transition",
        isCurrent
          ? "border-yellow-400 bg-yellow-400/10 shadow-lg shadow-yellow-500/10"
          : isUnlocked
            ? "border-emerald-500/40 bg-emerald-500/10"
            : "border-zinc-800 bg-zinc-900/80 opacity-70",
      ].join(" ")}
    >
      <div className="mb-3 flex h-16 items-center justify-center rounded-lg bg-zinc-800">
        <span className="text-2xl">
          {reward.type === "duck" && "🦆"}
          {reward.type === "border" && "🖼️"}
          {reward.type === "pin" && "📌"}
          {reward.type === "island_accessory" && "🏝️"}
          {reward.type === "digital_art" && "🎨"}
          {reward.type === "ravelbox" && "🎁"}
          {reward.type === "skin" && "👑"}
        </span>
      </div>

      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="rounded bg-zinc-800 px-2 py-1 text-[10px] font-bold uppercase text-zinc-300">
          LV {reward.level}
        </span>

        <span className="text-[10px] uppercase text-zinc-500">
          {rewardTypeLabel[reward.type]}
        </span>
      </div>

      <h3 className="line-clamp-2 min-h-[40px] text-sm font-bold text-white">
        {reward.name}
      </h3>

      <p className="mt-2 line-clamp-2 text-xs text-zinc-400">
        {reward.description}
      </p>

      <div className="mt-4">
        {isUnlocked ? (
          <button className="w-full rounded-lg bg-yellow-400 px-3 py-2 text-xs font-bold text-zinc-950">
            {isCurrent ? "Atual" : "Liberado"}
          </button>
        ) : (
          <button disabled className="w-full rounded-lg bg-zinc-800 px-3 py-2 text-xs font-bold text-zinc-500">
            Bloqueado
          </button>
        )}
      </div>
    </article>
  );
}
