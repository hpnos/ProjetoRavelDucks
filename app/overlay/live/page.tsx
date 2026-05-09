"use client";

import { LiveOverlayEventList } from "@/components/overlay/LiveOverlayEventList";
import { LiveOverlayHeader } from "@/components/overlay/LiveOverlayHeader";
import { LiveOverlayHighlight } from "@/components/overlay/LiveOverlayHighlight";
import { useLiveEvents } from "@/hooks/use-live-events";

export default function LiveOverlayPage() {
  const { highlightEvent, recentEvents, isLoading } = useLiveEvents(6);

  return (
    <main className="min-h-screen bg-transparent p-6 text-white">
      <div className="grid h-full min-h-[calc(100vh-48px)] gap-5 lg:grid-cols-[1fr_380px]">
        <section className="flex flex-col justify-end gap-5">
          <LiveOverlayHeader />

          {isLoading && (
            <div className="rounded-3xl border border-zinc-800 bg-black/70 p-6 text-white">
              Carregando eventos...
            </div>
          )}

          {!isLoading && highlightEvent && (
            <LiveOverlayHighlight event={highlightEvent} />
          )}

          {!isLoading && !highlightEvent && (
            <div className="rounded-3xl border border-zinc-800 bg-black/70 p-6 text-white">
              Nenhum evento na live ainda.
            </div>
          )}
        </section>

        <aside className="flex flex-col justify-end">
          <LiveOverlayEventList events={recentEvents} />
        </aside>
      </div>
    </main>
  );
}
