import { Duck } from "@/types/duck";

interface DuckProgressHeaderProps {
  duck: Duck;
}

const rarityLabel = {
  common: "Comum",
  rare: "Raro",
  epic: "Épico",
  legendary: "Lendário",
};

export function DuckProgressHeader({ duck }: DuckProgressHeaderProps) {
  const xpPercentage = Math.min((duck.xp / duck.nextLevelXp) * 100, 100);

  return (
    <section className="rounded-2xl border border-zinc-800 bg-zinc-950/80 p-6 shadow-xl">
      <div className="grid gap-6 md:grid-cols-[220px_1fr]">
        <div className="flex min-h-[220px] items-center justify-center rounded-2xl bg-gradient-to-br from-yellow-500/20 via-orange-500/10 to-zinc-900 p-6">
          <div className="flex h-40 w-40 items-center justify-center rounded-full border border-yellow-500/40 bg-zinc-900 text-center text-sm text-zinc-400">
            Imagem do pato
          </div>
        </div>

        <div className="flex flex-col justify-center">
          <div className="mb-3 flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-yellow-500 px-3 py-1 text-xs font-bold uppercase text-zinc-950">
              {rarityLabel[duck.rarity]}
            </span>

            <span className="rounded-full border border-zinc-700 px-3 py-1 text-xs font-medium text-zinc-300">
              Tema: {duck.theme}
            </span>
          </div>

          <h1 className="text-4xl font-black tracking-tight text-white">
            {duck.name}
          </h1>

          <p className="mt-2 max-w-2xl text-sm text-zinc-400">
            Evolua este pato para desbloquear recompensas temáticas, itens de ilha,
            bordas, pins, artes digitais e Ravelbox.
          </p>

          <div className="mt-6">
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="font-semibold text-zinc-200">
                Nível {duck.level}/{duck.maxLevel}
              </span>

              <span className="text-zinc-400">
                {duck.xp}/{duck.nextLevelXp} XP
              </span>
            </div>

            <div className="h-4 overflow-hidden rounded-full bg-zinc-800">
              <div
                className="h-full rounded-full bg-yellow-400"
                style={{ width: `${xpPercentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
