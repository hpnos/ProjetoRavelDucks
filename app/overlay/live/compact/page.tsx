"use client";

import { LiveOverlayEventCard } from "@/components/overlay/LiveOverlayEventCard";
import { useLiveEvents } from "@/hooks/use-live-events";

export default function CompactLiveOverlayPage() {
  const { events, isLoading } = useLiveEvents(3);

  return (
    <main className="min-h-screen bg-transparent p-4 text-white">
      <section className="fixed bottom-6 right-6 grid w-[420px] gap-3">
        {isLoading && (
          <div className="rounded-2xl border border-zinc-800 bg-black/70 p-4 text-sm font-bold text-white">
            Carregando eventos...
          </div>
        )}

        {!isLoading && events.length === 0 && (
          <div className="rounded-2xl border border-zinc-800 bg-black/70 p-4 text-sm font-bold text-white">
            Nenhum evento ainda.
          </div>
        )}

        {events.map((event) => (
          <LiveOverlayEventCard key={event.id} event={event} />
        ))}
      </section>
    </main>
  );
}
