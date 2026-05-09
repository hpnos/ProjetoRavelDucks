import { DuckCurrentReward } from "@/components/ducks/DuckCurrentReward";
import { DuckProgressHeader } from "@/components/ducks/DuckProgressHeader";
import { DuckRewardTrack } from "@/components/ducks/DuckRewardTrack";
import { junkratRewards, mockDuck } from "@/lib/mock-data";

interface DuckProgressPageProps {
  params: Promise<{
    duckId: string;
  }>;
}

export default async function DuckProgressPage({ params }: DuckProgressPageProps) {
  const { duckId } = await params;
  const duck = mockDuck;

  const currentReward =
    junkratRewards.find((reward) => reward.level === duck.level) ??
    junkratRewards[0];

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#3f2b00_0,#09090b_45%,#000_100%)] px-4 py-8 text-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-yellow-400">
              Ravel Ducks
            </p>
            <h1 className="mt-1 text-2xl font-black text-white">
              Proficiência do pato
            </h1>
          </div>

          <span className="rounded-full border border-zinc-700 px-4 py-2 text-sm text-zinc-300">
            ID: {duckId}
          </span>
        </div>

        <DuckProgressHeader duck={duck} />

        <DuckCurrentReward reward={currentReward} />

        <DuckRewardTrack
          rewards={junkratRewards}
          currentLevel={duck.level}
        />
      </div>
    </main>
  );
}
