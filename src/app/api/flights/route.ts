import { NextRequest, NextResponse } from "next/server";

import { loadFlightResults } from "@/lib/flights/load-flight-results";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const raw = Object.fromEntries(request.nextUrl.searchParams.entries());

  try {
    const payload = await loadFlightResults(raw);
    return NextResponse.json(payload);
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Could not load flights.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
