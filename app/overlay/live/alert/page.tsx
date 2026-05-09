"use client";

import { LiveOverlayHighlight } from "@/components/overlay/LiveOverlayHighlight";
import { useLiveEvents } from "@/hooks/use-live-events";

export default function AlertLiveOverlayPage() {
  const { highlightEvent, isLoading } = useLiveEvents(1);

  return (
    <main className="min-h-screen bg-transparent p-6 text-white">
      <section className="fixed bottom-8 left-1/2 w-full max-w-4xl -translate-x-1/2">
        {isLoading && (
          <div className="rounded-3xl border border-zinc-800 bg-black/70 p-6 text-center text-white">
            Carregando evento...
          </div>
        )}

        {!isLoading && highlightEvent && (
          <LiveOverlayHighlight event={highlightEvent} />
        )}

        {!isLoading && !highlightEvent && (
          <div className="rounded-3xl border border-zinc-800 bg-black/70 p-6 text-center text-white">
            Nenhum alerta disponível.
          </div>
        )}
      </section>
    </main>
  );
}
