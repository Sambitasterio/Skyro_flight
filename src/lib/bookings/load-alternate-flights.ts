import { createClient } from "@/lib/supabase/server";
import type { FlightRow } from "@/types/database";

export async function loadAlternateFlights(
  origin: string,
  destination: string,
  excludeFlightId: string,
): Promise<FlightRow[]> {
  const supabase = await createClient();
  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from("flights")
    .select(
      "id, flight_no, origin, destination, departs_at, arrives_at, aircraft_type, status, base_price",
    )
    .eq("origin", origin)
    .eq("destination", destination)
    .neq("id", excludeFlightId)
    .neq("status", "cancelled")
    .gt("departs_at", now)
    .order("departs_at", { ascending: true });

  if (error || !data) {
    return [];
  }

  return data as FlightRow[];
}
