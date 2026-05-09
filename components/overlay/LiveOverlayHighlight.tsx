import { LiveEventDocument } from "@/types/live-event";

interface LiveOverlayHighlightProps {
  event: LiveEventDocument;
}

const rarityStyle = {
  common: "border-zinc-400/40 bg-zinc-400/10 text-zinc-200",
  rare: "border-sky-400/40 bg-sky-400/10 text-sky-200",
  epic: "border-purple-400/40 bg-purple-400/10 text-purple-200",
  legendary: "border-yellow-400/50 bg-yellow-400/15 text-yellow-200",
};

const rarityLabel = {
  common: "Comum",
  rare: "Raro",
  epic: "Épico",
  legendary: "Lendário",
};

export function LiveOverlayHighlight({ event }: LiveOverlayHighlightProps) {
  const style = event.rarity
    ? rarityStyle[event.rarity]
    : "border-zinc-700 bg-zinc-900 text-zinc-300";

  return (
    <section className="relative overflow-hidden rounded-3xl border border-yellow-400/40 bg-black/75 p-6 shadow-2xl backdrop-blur">
      <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-yellow-400/20 blur-3xl" />
      <div className="absolute -bottom-12 -left-12 h-40 w-40 rounded-full bg-orange-500/20 blur-3xl" />

      <div className="relative flex flex-col gap-5 md:flex-row md:items-center">
        <div className="flex h-28 w-28 shrink-0 animate-bounce items-center justify-center rounded-3xl border border-yellow-400/40 bg-zinc-950/80 text-6xl shadow-xl">
          {event.icon}
        </div>

        <div className="min-w-0 flex-1">
          <div className="mb-3 flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-yellow-400 px-3 py-1 text-xs font-black uppercase text-zinc-950">
              Destaque
            </span>

            {event.rarity && (
              <span
                className={[
                  "rounded-full border px-3 py-1 text-xs font-black uppercase",
                  style,
                ].join(" ")}
              >
                {rarityLabel[event.rarity]}
              </span>
            )}
          </div>

          <h2 className="text-3xl font-black text-white">{event.title}</h2>

          <p className="mt-2 text-lg font-bold text-yellow-300">
            {event.displayName}
          </p>

          <p className="mt-2 text-sm text-zinc-300">{event.description}</p>
        </div>
      </div>
    </section>
  );
}
