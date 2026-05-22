# Zustand persist checklist (Phase 8)

Verify in Chrome DevTools → **Application** → **Local Storage** → `http://localhost:3000`.

## Keys

| Key | Store | What is persisted |
|-----|--------|-------------------|
| `flight-store` | `useFlightStore` | `searchQuery`, `selectedFlight`, `selectedSeat`, `activeBooking`, `bookingStep` |
| `user-store` | `useUserStore` | `session` only |

## Must NOT appear in localStorage

- `passengerForm` / `documentNumber` / passport or government ID fields
- `cachedBookings`

## Manual tests

1. **Search persists** — set DEL → GOA on landing, refresh `/` → fields still filled.
2. **Booking journey** — select flight + seat, refresh seat page → selection still there.
3. **No ID in storage** — fill passenger form on `/book/[id]`, inspect `flight-store` JSON → no `passengerForm`, no `documentNumber`.
4. **Confirmation reset** — complete booking, on PNR page click **My Bookings** or **Search another flight** → `selectedFlight`, `selectedSeat`, `activeBooking` cleared from store (search query remains).
5. **Logout reset** — mid-booking (seat selected), log out → `activeBooking` / seat / flight cleared; `searchQuery` still present; `user-store` session empty.

## Logout / sign-out entry points

- Navbar **Log out**
- Supabase session expiry (`AuthProvider` `onAuthStateChange`)

Both call `clearClientStoresOnLogout()` from `src/lib/store/clear-client-stores.ts`.
