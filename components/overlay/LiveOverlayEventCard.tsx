import { LiveEventDocument } from "@/types/live-event";

interface LiveOverlayEventCardProps {
  event: LiveEventDocument;
}

const eventTypeLabel = {
  pack_opened: "Pacote",
  rare_card: "Carta rara",
  level_up: "Level up",
  ravelbox: "Ravelbox",
  duck_unlocked: "Novo pato",
};

const rarityBorder = {
  common: "border-zinc-500/40",
  rare: "border-sky-500/40",
  epic: "border-purple-500/40",
  legendary: "border-yellow-500/40",
};

export function LiveOverlayEventCard({ event }: LiveOverlayEventCardProps) {
  const border = event.rarity ? rarityBorder[event.rarity] : "border-zinc-800";

  return (
    <article
      className={[
        "rounded-2xl border bg-black/65 p-4 shadow-xl backdrop-blur",
        border,
      ].join(" ")}
    >
      <div className="flex items-center gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-zinc-700 bg-zinc-950 text-3xl">
          {event.icon}
        </div>

        <div className="min-w-0 flex-1">
          <div className="mb-1 flex items-center gap-2">
            <span className="rounded-full bg-zinc-800 px-2 py-1 text-[10px] font-black uppercase text-zinc-300">
              {eventTypeLabel[event.type]}
            </span>

            <span className="text-[11px] font-bold text-zinc-500">
              {event.createdAt.toLocaleTimeString("pt-BR", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>

          <h3 className="truncate text-sm font-black text-white">
            {event.title}
          </h3>

          <p className="mt-1 line-clamp-2 text-xs text-zinc-400">
            {event.description}
          </p>
        </div>
      </div>
    </article>
  );
}
