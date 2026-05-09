import { LiveEventDocument } from "@/types/live-event";
import { LiveOverlayEventCard } from "./LiveOverlayEventCard";

interface LiveOverlayEventListProps {
  events: LiveEventDocument[];
}

export function LiveOverlayEventList({ events }: LiveOverlayEventListProps) {
  return (
    <section className="grid gap-3">
      <div className="rounded-2xl border border-zinc-800 bg-black/70 px-5 py-4 shadow-xl backdrop-blur">
        <h2 className="text-lg font-black text-white">Últimos eventos</h2>
        <p className="mt-1 text-xs text-zinc-400">
          Acompanhe as interações recentes da comunidade.
        </p>
      </div>

      <div className="grid gap-3">
        {events.map((event) => (
          <LiveOverlayEventCard key={event.id} event={event} />
        ))}
      </div>
    </section>
  );
}
