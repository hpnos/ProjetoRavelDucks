import { DuckReward } from "@/types/duck";

interface DuckCurrentRewardProps {
  reward?: DuckReward;
}

export function DuckCurrentReward({ reward }: DuckCurrentRewardProps) {
  if (!reward) {
    return (
      <section className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-6">
        <h2 className="text-xl font-bold text-white">Trilha completa</h2>
        <p className="mt-2 text-sm text-zinc-400">
          Todas as recompensas deste pato já foram desbloqueadas.
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-yellow-400/40 bg-gradient-to-r from-yellow-400/10 to-orange-500/10 p-6 shadow-xl">
      <p className="text-xs font-bold uppercase tracking-widest text-yellow-400">
        Recompensa atual
      </p>

      <div className="mt-4 grid gap-5 md:grid-cols-[120px_1fr_auto] md:items-center">
        <div className="flex h-28 w-28 items-center justify-center rounded-2xl bg-zinc-900 text-4xl">
          {reward.type === "duck" && "🦆"}
          {reward.type === "border" && "🖼️"}
          {reward.type === "pin" && "📌"}
          {reward.type === "island_accessory" && "🏝️"}
          {reward.type === "digital_art" && "🎨"}
          {reward.type === "ravelbox" && "🎁"}
          {reward.type === "skin" && "👑"}
        </div>

        <div>
          <h2 className="text-2xl font-black text-white">
            Nível {reward.level} - {reward.name}
          </h2>

          <p className="mt-2 text-sm text-zinc-400">
            {reward.description}
          </p>
        </div>

        <button className="rounded-xl bg-yellow-400 px-6 py-3 text-sm font-black text-zinc-950 transition hover:bg-yellow-300">
          Equipar
        </button>
      </div>
    </section>
  );
}
