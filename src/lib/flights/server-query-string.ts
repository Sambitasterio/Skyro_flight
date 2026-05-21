/** URL params that change the Supabase flight query (not client-only filters/sort). */
const SERVER_PARAM_KEYS = [
  "from",
  "to",
  "depart",
  "return",
  "trip",
  "pax",
  "class",
  "minPrice",
  "maxPrice",
] as const;

export function toServerQueryString(
  params: URLSearchParams | string,
): string {
  const source =
    typeof params === "string" ? new URLSearchParams(params) : params;
  const out = new URLSearchParams();

  for (const key of SERVER_PARAM_KEYS) {
    const value = source.get(key);
    if (value) out.set(key, value);
  }

  return out.toString();
}
