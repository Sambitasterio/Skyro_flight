import type { FlightResultsPayload } from "./load-flight-results";

/** Client refetch when URL search params change (filters / route / date). */
export async function fetchFlightsClient(
  queryString: string,
  signal?: AbortSignal,
): Promise<FlightResultsPayload> {
  const res = await fetch(`/api/flights?${queryString}`, { signal });

  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { error?: string };
    throw new Error(body.error ?? `Request failed (${res.status})`);
  }

  return res.json() as Promise<FlightResultsPayload>;
}
