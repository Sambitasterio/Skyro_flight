"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { fetchFlightsClient } from "@/lib/flights/fetch-flights-client";
import type { FlightResultsPayload } from "@/lib/flights/load-flight-results";
import { toServerQueryString } from "@/lib/flights/server-query-string";

interface UseFlightResultsDataOptions {
  initial: FlightResultsPayload;
}

export function useFlightResultsData({ initial }: UseFlightResultsDataOptions) {
  const searchParams = useSearchParams();
  const serverQuery = toServerQueryString(searchParams);

  const [data, setData] = useState<FlightResultsPayload>(initial);
  const [isRefetching, setIsRefetching] = useState(false);
  const [clientError, setClientError] = useState<string | null>(null);

  const isFirstRender = useRef(true);
  const lastFetchedQuery = useRef(serverQuery);

  useEffect(() => {
    setData(initial);
    setClientError(null);
    lastFetchedQuery.current = serverQuery;
  }, [initial, serverQuery]);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (serverQuery === lastFetchedQuery.current) return;

    const controller = new AbortController();
    setIsRefetching(true);
    setClientError(null);

    fetchFlightsClient(serverQuery, controller.signal)
      .then((payload) => {
        lastFetchedQuery.current = serverQuery;
        setData(payload);
      })
      .catch((err) => {
        if (controller.signal.aborted) return;
        setClientError(
          err instanceof Error ? err.message : "Could not refresh flights.",
        );
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsRefetching(false);
      });

    return () => controller.abort();
  }, [serverQuery]);

  const fetchError = clientError ?? data.fetchError;

  return { data, isRefetching, fetchError };
}
