"use client";

import { useEffect, useState } from "react";
import { subscribeToLatestLiveEvents } from "@/services/live-events-service";
import { LiveEventDocument } from "@/types/live-event";

export function useLiveEvents(maxItems = 10) {
  const [events, setEvents] = useState<LiveEventDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToLatestLiveEvents((latestEvents) => {
      setEvents(latestEvents);
      setIsLoading(false);
    }, maxItems);

    return () => unsubscribe();
  }, [maxItems]);

  return {
    events,
    isLoading,
    highlightEvent: events[0] ?? null,
    recentEvents: events.slice(1),
  };
}
