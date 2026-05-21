import { createClient } from "@/lib/supabase/server";
import type { FlightRow } from "@/types/database";

export async function getFlightById(id: string): Promise<FlightRow | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("flights")
    .select(
      "id, flight_no, origin, destination, departs_at, arrives_at, aircraft_type, status, base_price",
    )
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data as FlightRow | null;
}
