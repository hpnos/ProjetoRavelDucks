import { PackCardReward } from "@/types/pack";

interface ReceivedCardProps {
  card: PackCardReward;
}

const rarityLabel = {
  common: "Comum",
  rare: "Raro",
  epic: "Épico",
  legendary: "Lendário",
};

const rarityStyle = {
  common: "border-zinc-500/40 bg-zinc-500/10 text-zinc-300",
  rare: "border-sky-500/40 bg-sky-500/10 text-sky-300",
  epic: "border-purple-500/40 bg-purple-500/10 text-purple-300",
  legendary: "border-yellow-500/40 bg-yellow-500/10 text-yellow-300",
};

const typeIcon = {
  duck: "🦆",
  duck_xp: "✨",
  island_item: "🏝️",
  accessory: "🎩",
  border: "🖼️",
  pin: "📌",
  digital_art: "🎨",
  ravelbox: "🎁",
};

const typeLabel = {
  duck: "Pato",
  duck_xp: "XP",
  island_item: "Item de ilha",
  accessory: "Acessório",
  border: "Borda",
  pin: "Pin",
  digital_art: "Arte digital",
  ravelbox: "Ravelbox",
};

export function ReceivedCard({ card }: ReceivedCardProps) {
  return (
    <article className="rounded-2xl border border-zinc-800 bg-zinc-950/90 p-4 shadow-xl">
      <div className="flex h-32 items-center justify-center rounded-xl bg-gradient-to-br from-zinc-900 to-black text-6xl">
        {typeIcon[card.type]}
      </div>

      <div className="mt-4 flex items-center justify-between gap-2">
        <span
          className={[
            "rounded-full border px-3 py-1 text-[10px] font-bold uppercase",
            rarityStyle[card.rarity],
          ].join(" ")}
        >
          {rarityLabel[card.rarity]}
        </span>

        <span className="text-[10px] font-bold uppercase text-zinc-500">
          {typeLabel[card.type]}
        </span>
      </div>

      <h3 className="mt-3 text-lg font-black text-white">{card.name}</h3>

      <p className="mt-2 min-h-[44px] text-sm text-zinc-400">
        {card.description}
      </p>

      {card.isDuplicate && (
        <div className="mt-3 rounded-xl border border-yellow-400/40 bg-yellow-400/10 p-3 text-xs font-bold text-yellow-300">
          Duplicata: vira XP
        </div>
      )}

      {card.xpAmount && (
        <div className="mt-3 rounded-xl border border-emerald-400/40 bg-emerald-400/10 p-3 text-xs font-bold text-emerald-300">
          +{card.xpAmount} XP
        </div>
      )}
    </article>
  );
}
