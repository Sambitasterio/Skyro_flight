# Supabase — Skyro database

Run these in the **Supabase SQL Editor** in order. Use **Primary Database** + role **postgres**.

## Migration order

| # | File | Purpose |
|---|------|---------|
| 1 | `migrations/001_create_tables.sql` | Tables, indexes, constraints |
| 2 | `migrations/002_enable_rls.sql` | Enable RLS on all tables |
| 3 | `migrations/003_rls_policies.sql` | Public read on flights/seats; owner policies |
| 4 | `migrations/004_rpcs.sql` | `reserve_seat`, `cancel_booking` |
| 5 | `migrations/005_triggers.sql` | 2-hour cancellation trigger |
| 6 | `seed.sql` | Flights, seat maps, test auth user |

## Test account (seed)

| Field | Value |
|-------|--------|
| Email | `xyz123@gmail.com` |
| Password | `1234` (dev/test only — change for production) |

To use your own password, edit the `crypt('...')` value in `seed.sql` **before** running it.

## Verify (SQL Editor)

```sql
SELECT count(*) AS flights FROM public.flights;
SELECT count(*) AS seats FROM public.seats;
SELECT policyname FROM pg_policies WHERE tablename = 'bookings';
SELECT email FROM auth.users WHERE email = 'xyz123@gmail.com';
```

Expected: **8** flights, **2016** seats (252 × 8), booking policies listed, test user row present.

## Phase 5 — Realtime

After Phase 5 starts, enable Realtime on the **`seats`** table:

**Database → Replication → supabase_realtime → add `seats`**

## RPCs (app usage)

- `reserve_seat(flight_id, seat_id, user_id)` — locks seat, creates booking + PNR
- `cancel_booking(booking_id, user_id)` — cancels if ≥ 2h before departure, frees seat

Both require an **authenticated** Supabase session (`auth.uid()` must match `user_id`).
