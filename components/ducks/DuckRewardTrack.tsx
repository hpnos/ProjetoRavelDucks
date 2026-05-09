import { DuckReward } from "@/types/duck";
import { DuckRewardCard } from "./DuckRewardCard";

interface DuckRewardTrackProps {
  rewards: DuckReward[];
  currentLevel: number;
}

export function DuckRewardTrack({
  rewards,
  currentLevel,
}: DuckRewardTrackProps) {
  return (
    <section className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-6 shadow-xl">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white">
            Trilha de recompensas
          </h2>
          <p className="text-sm text-zinc-400">
            Evolua o pato para desbloquear todos os níveis.
          </p>
        </div>

        <span className="rounded-full bg-zinc-800 px-4 py-2 text-sm font-semibold text-zinc-300">
          {currentLevel}/10
        </span>
      </div>

      <div className="overflow-x-auto pb-3">
        <div className="flex gap-4">
          {rewards.map((reward) => (
            <DuckRewardCard
              key={reward.id}
              reward={reward}
              currentLevel={currentLevel}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
