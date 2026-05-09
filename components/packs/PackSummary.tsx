import { PackCardReward } from "@/types/pack";

interface PackSummaryProps {
  cards: PackCardReward[];
}

export function PackSummary({ cards }: PackSummaryProps) {
  const ducks = cards.filter((card) => card.type === "duck").length;
  const xpCards = cards.filter((card) => card.type === "duck_xp").length;
  const ravelboxes = cards.filter((card) => card.type === "ravelbox").length;
  const duplicates = cards.filter((card) => card.isDuplicate).length;

  return (
    <section className="grid gap-3 sm:grid-cols-4">
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-4">
        <p className="text-xs font-bold uppercase text-zinc-500">Patos</p>
        <p className="mt-1 text-2xl font-black text-white">{ducks}</p>
      </div>

      <div className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-4">
        <p className="text-xs font-bold uppercase text-zinc-500">XP</p>
        <p className="mt-1 text-2xl font-black text-white">{xpCards}</p>
      </div>

      <div className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-4">
        <p className="text-xs font-bold uppercase text-zinc-500">Ravelbox</p>
        <p className="mt-1 text-2xl font-black text-yellow-400">
          {ravelboxes}
        </p>
      </div>

      <div className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-4">
        <p className="text-xs font-bold uppercase text-zinc-500">Duplicatas</p>
        <p className="mt-1 text-2xl font-black text-white">{duplicates}</p>
      </div>
    </section>
  );
}
