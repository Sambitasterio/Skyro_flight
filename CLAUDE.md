# Flight Management PWA — Project Master Plan

> **Brand:** **Skyro** (wordmark: Sky**ro**) · **Primary:** `#4F46E5` · **Accent:** `#7C3AED`
> **Repo folder:** `skyro` · **PWA name:** Skyro · **Stack:** Next.js 16+ App Router · Supabase · Zustand · Tailwind v4
> **Optional Supabase project ref:** `vhmliambtauxqmzqhomz` → API URL `https://vhmliambtauxqmzqhomz.supabase.co`

---

## Overview

Skyro is a **responsive flight booking Progressive Web App** that lets users search flights, pick seats on a **live-updating seat map**, complete passenger details, receive a **PNR confirmation**, and manage bookings (**reschedule** / **cancel**) from a protected dashboard.

**Core user journey:**

1. **Landing** (`/`) — hero + search
2. **Search results** (`/flights`) — filter, sort, pick flight
3. **Auth gate** — login modal when selecting seats (lazy auth)
4. **Seat map** (`/flights/[id]/seats`) — Realtime seat availability
5. **Passenger form** (`/book/[flightId]`) — book seat via RPC
6. **Confirmation** (`/booking/[pnr]`) — PNR + itinerary
7. **My Bookings** (`/bookings`) — tabs, reschedule, cancel

**Architecture reference:** open [`docs/architecture.html`](./docs/architecture.html) in a browser for system diagrams (user flow, schema, state, data flow).

---

## Tech Stack

| Layer | Technology | Notes |
|---|---|---|
| Framework | **Next.js 16+** (App Router) | `src/` directory · TypeScript · no `any` |
| Styling | **Tailwind CSS v4** | Skyro tokens in `globals.css` |
| Backend | **Supabase** | Postgres · Auth · Realtime · RPCs |
| Client state | **Zustand** + `persist` | `useFlightStore` · `useUserStore` |
| Auth | **Supabase Auth** | Email + password · SSR cookies via `@supabase/ssr` |
| Realtime | **Supabase Realtime** | `postgres_changes` on `seats` table |
| PWA (bonus) | **next-pwa** | Installable · offline shell · Lighthouse ≥ 90 |
| Deploy | **Vercel** | Env vars for Supabase keys |

**Environment variables** (`.env.local` — never commit):

```env
NEXT_PUBLIC_SUPABASE_URL=https://vhmliambtauxqmzqhomz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
```

---

## Design Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Brand | **Skyro** indigo/violet | `#4F46E5` primary · `#7C3AED` accent · white surfaces |
| Auth timing | **Lazy auth** at seat selection | Lower friction on search/browse |
| Seat conflicts | **RPC + `SELECT FOR UPDATE`** | Atomic reserve; Realtime for UI sync |
| Cancel rule | **2 hours before departure** | DB trigger blocks late cancels |
| Sensitive data | **No passport in localStorage** | `partialize` excludes `passengerForm` |
| Mobile UX | Bottom sheets · sticky CTAs | Match reference apps in `design/references/` |
| Dark mode | Supported via CSS variables | Toggle in nav (Phase 3+) |
| Images | User JPGs from `design/destinations/` | Copied to `/public/hero/` at Phase 3 |

---

## Routes

| Route | Access | Purpose |
|---|---|---|
| `/` | Public | Landing · hero · search card · trending destinations |
| `/flights` | Public | Search results · filters · sort · flight cards |
| `/flights/[id]/seats` | Auth required | Visual seat map · class zones · Realtime |
| `/book/[flightId]` | Auth required | Passenger details form · price summary |
| `/booking/[pnr]` | Auth required | Booking confirmation · PNR · share CTA |
| `/bookings` | Auth required | List bookings · tabs (All/Upcoming/Past/Cancelled) |
| `/bookings/[id]` | Auth required | Booking detail · reschedule · cancel |
| `/auth/login` | Public | Email login |
| `/auth/signup` | Public | Email signup |

**Query params (search):** `from`, `to`, `depart`, `return`, `pax`, `class`, `trip` (oneway|round)

**Middleware:** refresh session · protect `/bookings`, `/book`, `/booking`, `/flights/*/seats`

---
## Database Schema

Five tables + Supabase `auth.users`. All app tables have **RLS enabled**.

### `flights`

| Column | Type | Constraints |
|---|---|---|
| `id` | `uuid` | PK · `gen_random_uuid()` |
| `flight_no` | `text` | NOT NULL · e.g. `SK101` |
| `origin` | `text` | NOT NULL · airport code `DEL` |
| `destination` | `text` | NOT NULL · `BOM` |
| `departs_at` | `timestamptz` | NOT NULL |
| `arrives_at` | `timestamptz` | NOT NULL |
| `aircraft_type` | `text` | e.g. `A320` |
| `status` | `text` | `scheduled` \| `delayed` \| `cancelled` |
| `base_price` | `numeric(10,2)` | NOT NULL |

### `seats`

| Column | Type | Constraints |
|---|---|---|
| `id` | `uuid` | PK |
| `flight_id` | `uuid` | FK → `flights(id)` ON DELETE CASCADE |
| `seat_number` | `text` | e.g. `12A` |
| `class` | `text` | `economy` \| `business` \| `first` |
| `is_available` | `boolean` | DEFAULT `true` |
| `extra_fee` | `numeric(8,2)` | DEFAULT `0` |

UNIQUE (`flight_id`, `seat_number`). Enable **Realtime** publication on this table.

### `bookings`

| Column | Type | Constraints |
|---|---|---|
| `id` | `uuid` | PK |
| `user_id` | `uuid` | FK → `auth.users(id)` |
| `flight_id` | `uuid` | FK → `flights` |
| `seat_id` | `uuid` | FK → `seats` |
| `status` | `text` | `confirmed` \| `rescheduled` \| `cancelled` |
| `booked_at` | `timestamptz` | DEFAULT `now()` |
| `total_price` | `numeric(10,2)` | NOT NULL |
| `pnr_code` | `text` | UNIQUE · 6-char alphanumeric |

### `passengers`

| Column | Type | Constraints |
|---|---|---|
| `id` | `uuid` | PK |
| `booking_id` | `uuid` | FK → `bookings` |
| `full_name` | `text` | NOT NULL |
| `passport_no` | `text` | sensitive — never client-persist |
| `nationality` | `text` | |
| `dob` | `date` | |

### `reschedules`

| Column | Type | Constraints |
|---|---|---|
| `id` | `uuid` | PK |
| `booking_id` | `uuid` | FK → `bookings` |
| `old_flight_id` | `uuid` | FK → `flights` |
| `new_flight_id` | `uuid` | FK → `flights` |
| `requested_at` | `timestamptz` | DEFAULT `now()` |
| `fee_charged` | `numeric(8,2)` | DEFAULT `0` |

---

## Row Level Security (RLS)

| Table | Policy | Operations |
|---|---|---|
| `flights` | Public read | `SELECT` for `anon` + `authenticated` |
| `seats` | Public read | `SELECT` for `anon` + `authenticated` |
| `bookings` | Owner only | `SELECT`, `INSERT` where `auth.uid() = user_id` |
| `passengers` | Via booking owner | `SELECT`, `INSERT` where booking belongs to user |
| `reschedules` | Via booking owner | `SELECT`, `INSERT` where booking belongs to user |

**Seat updates** for booking/cancel go through **RPCs** (security definer), not direct client UPDATE on `seats`.

---

## RPC Functions

### `reserve_seat(p_flight_id uuid, p_seat_id uuid, p_user_id uuid, p_total_price numeric, p_passenger jsonb)`

- `BEGIN` transaction
- `SELECT * FROM seats WHERE id = p_seat_id AND flight_id = p_flight_id FOR UPDATE`
- If not `is_available` → `RAISE EXCEPTION 'Seat not available'`
- Set `is_available = false`
- Generate `pnr_code` (6 chars)
- `INSERT` into `bookings`
- `INSERT` into `passengers` from `p_passenger` JSON
- `RETURN` booking row + PNR

### `cancel_booking(p_booking_id uuid, p_user_id uuid)`

- Verify booking belongs to user and `status = 'confirmed'`
- Check **2-hour rule** (or rely on trigger before update)
- Set booking `status = 'cancelled'`
- Set linked seat `is_available = true`
- `RETURN` updated booking

### `reschedule_booking` (optional RPC or app-level transaction)

- Insert `reschedules` row
- Update booking `flight_id` + `seat_id` + `status = 'rescheduled'`
- Free old seat · reserve new seat

---

## Trigger — 2-Hour Cancellation Rule

```sql
CREATE OR REPLACE FUNCTION check_cancel_window()
RETURNS TRIGGER AS $$
DECLARE
  dep timestamptz;
BEGIN
  IF NEW.status = 'cancelled' AND OLD.status <> 'cancelled' THEN
    SELECT departs_at INTO dep FROM flights WHERE id = OLD.flight_id;
    IF dep - now() < interval '2 hours' THEN
      RAISE EXCEPTION 'Cannot cancel within 2 hours of departure';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER bookings_cancel_window
  BEFORE UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION check_cancel_window();
```

---

## Seed Data Expectations

| Entity | Count | Notes |
|---|---|---|
| Flights | 12+ | Mix DEL/BOM/GOA/BLR/SIN/DXB · varied `departs_at` |
| Seats per flight | 30–40 | Economy bulk + business rows |
| Test user | 1 | Email/password you chose in pre-project checklist |
| Sample booking | 1–2 | For My Bookings demo |

**Airport codes in seed:** `DEL`, `BOM`, `GOA`, `BLR`, `HYD`, `CCU`, `SIN`, `DXB`

**PNR format:** uppercase alphanumeric, 6 chars, e.g. `SK7X2M`

---

## Zustand Stores

### `useFlightStore` (booking journey)

| Field | Persisted? | Notes |
|---|---|---|
| `searchQuery` | ✅ Yes | from/to/dates/pax/class |
| `selectedFlight` | ✅ Yes | flight object or id |
| `selectedSeat` | ✅ Yes | seat id + number |
| `bookingStep` | ✅ Yes | 1–4 progress |
| `passengerForm` | ❌ **No** | Never persist passport — optional: name only in memory |

**Actions:** `setSearchQuery`, `setSelectedFlight`, `setSelectedSeat`, `setBookingStep`, `resetBooking`

**Optimistic seat:** mark selected in store immediately · revert if RPC fails

### `useUserStore` (auth + cache)

| Field | Persisted? | Notes |
|---|---|---|
| `session` | ✅ Partial | token/metadata only |
| `cachedBookings` | ❌ No | refetch on mount |

**Actions:** `setSession`, `setCachedBookings`, `resetUser`

```typescript
// partialize example — useUserStore
partialize: (state) => ({ session: state.session }),
// useFlightStore — exclude passengerForm entirely
partialize: (state) => ({
  searchQuery: state.searchQuery,
  selectedFlight: state.selectedFlight,
  selectedSeat: state.selectedSeat,
  bookingStep: state.bookingStep,
}),
```

---

## Evaluation Criteria

| Area | Weight | What reviewers check |
|---|---|---|
| **Functionality** | 40% | Search · seat map · book · PNR · my bookings · reschedule · cancel |
| **Realtime** | 15% | Seat map updates without refresh when another user books |
| **Auth & RLS** | 15% | Protected routes · users only see own bookings |
| **UI/UX** | 15% | Responsive · Skyro branding · usable on mobile |
| **Code quality** | 10% | TypeScript · component structure · meaningful commits |
| **PWA (bonus)** | +10% | Installable · Lighthouse PWA ≥ 90 |

6. **Code quality** — TypeScript throughout, no `any`, clean component separation, meaningful commits

---
## Before You Start — Your Pre-Project Checklist

Complete these **once**, before Phase 0 begins. The agent will not scaffold the app until you confirm these are done (or explicitly skip any optional item).

| # | Task | Where / How | Required? |
|---|---|---|---|
| 1 | **Create a Supabase account** | [supabase.com](https://supabase.com) → Sign up (free tier is fine) | ✅ Yes |
| 2 | **Create a new Supabase project** | Dashboard → New Project → pick region close to you → set a DB password (save it) | ✅ Yes |
| 3 | **Copy Supabase credentials** | Project Settings → API → copy **Project URL**, **anon public key**, **service_role key** (keep service role secret) | ✅ Yes |
| 4 | **Install Node.js 18+** | [nodejs.org](https://nodejs.org) — run `node -v` in terminal to verify | ✅ Yes |
| 5 | **Install Git** | [git-scm.com](https://git-scm.com) — run `git --version` to verify | ✅ Yes |
| 6 | **Create a GitHub account** | [github.com](https://github.com) — needed for final submission | ✅ Yes (Phase 10) |
| 7 | **Create a Vercel account** | [vercel.com](https://vercel.com) — sign in with GitHub | ✅ Yes (Phase 10) |
| 8 | **Pick a test user email + password** | e.g. `test@skyro.dev` / `Test1234!` — you will use this in seed data + README | ✅ Yes |
| 9 | **Gather design references (frontend)** | Save to `design/references/` — see **Design Assets** below | ✅ Done |
| 10 | **Gather destination images (frontend)** | Save to `design/destinations/` — agent copies to `/public/hero/` at Phase 3 | ✅ Done |

**When ready:** Reply with *"Pre-project checklist done"* (and paste Supabase URL + keys into `.env.local` when Phase 0 asks for them — never paste service role key in chat).

**Supabase URL format:** `https://<project-ref>.supabase.co` (e.g. ref `vhmliambtauxqmzqhomz`)

---

## Frontend Design Gate — ⏸️ STOP Before Phase 3

**Do not start any frontend work (Phases 3–7) until design assets are confirmed.** The agent must pause and verify before building the landing page.

### Status: ✅ Assets provided by you

All inspiration files live in **`design/`** (see subfolders below). See **Design Assets — design/** for the full inventory and design direction.

At Phase 3 start, the agent will:
1. Confirm assets in `design/references/` and `design/destinations/` are still present
2. Copy destination JPGs → `/public/hero/` (keep PNG references in `design/references/` only)
3. Ask you to reply *"Phase 3 proceed"* before writing landing page code

### What you provide (reference)

1. **Frontpage / UI references** — screenshots in `design/references/`:
   - `skyscanner1.png`, `skyscanner2.png`
   - `easemytrip1.png`, `easemytrip2.png`
   - `ixigo1.png`, `ixigo2.png`

2. **Destination location images** — Unsplash JPGs in `design/destinations/`:
   - 6 landscape photos for hero rotation + trending cards
   - Agent copies these to `/public/hero/` during Phase 3

### Agent reminder (every session)

Before **Phase 3**, the agent must say:

> *"Frontend gate: Your assets are in `design/`. Confirm you want to proceed with the landing page (Skyro indigo theme + these references). Reply **Phase 3 proceed** to start."*

---

## Design Assets — design/

**Folders:** `design/references/` (PNG) · `design/destinations/` (JPG)  
**Status:** ✅ Provided by user — ready for Phase 3

### Frontpage reference screenshots (`design/references/`)

| File | Source site | Takeaways for Skyro |
|---|---|---|
| `skyscanner1.png`, `skyscanner2.png` | [Skyscanner](https://www.skyscanner.co.in) | Dark hero + bold headline · unified search bar (From ⇄ To · dates · pax/class) · trip type dropdown · direct-flights checkbox · secondary icon tiles below hero |
| `easemytrip1.png`, `easemytrip2.png` | [EaseMyTrip](https://www.easemytrip.com) | Light blue hero · One Way / Round Trip / Multicity tabs · airport codes under city names · orange CTA · special-fare chips · exclusive offers carousel below |
| `ixigo1.png`, `ixigo2.png` | [ixigo](https://www.ixigo.com) | Clean white card search on light bg · service tabs (Flights active) · special fare pills · “Do more” icon row · offers section with filter chips |

### Design direction (locked from your inspirations)

Blend the best of all three — **Skyro keeps its indigo theme**, not competitor colors:

- **Layout:** Skyscanner-style hero + search prominence; EaseMyTrip-style trip tabs + divided fields; ixigo-style clean white search card
- **Nav:** Icon + label tabs (Flights · My Bookings) — not plain text links
- **Search card:** From / swap / To / departure / return / pax+class in one bordered container; gradient indigo Search button
- **Below hero:** Stats bar + trending destination grid (use your photos) + optional offers row inspired by EaseMyTrip/ixigo
- **Do not clone** competitor branding — use **Skyro** wordmark, `#4F46E5` primary, white + indigo palette

### Destination photos (`design/destinations/` — hero + trending)

| File | Subject (approx.) | Use |
|---|---|---|
| `joshua-rondeau-EIeVusiphj4-unsplash.jpg` | Santorini, Greece (white village, sunset) | Hero rotation |
| `magda-vrabetz-Zn_TEtx7Tqg-unsplash.jpg` | London Tower Bridge | Hero + trending card |
| `andreas-m-KxVk42ksnk8-unsplash.jpg` | Travel / destination | Hero rotation |
| `datingscout-VbWNQZeS2zs-unsplash.jpg` | Travel / destination | Hero rotation |
| `johny-goerend-MYXMx2zr1g8-unsplash.jpg` | Travel / destination | Hero rotation |
| `sebastian-staines-O5rFo-cJu94-unsplash.jpg` | Travel / destination | Hero rotation |

**Phase 3 task (agent):** Copy all 6 JPGs from `design/destinations/` to `/public/hero/` with short aliases (e.g. `santorini.jpg`, `london.jpg`, …) and wire into `HeroBackground` + trending cards. Map cities/routes in UI to match seed data (DEL, BOM, GOA, BLR, etc.) even if photo location differs — label cards by route, not photo EXIF.

**Note:** PNG screenshots stay in `design/references/` for dev reference only — do not use as hero backgrounds.

---
---

# PHASES

---
## Agent Workflow — Pause Before AND After Every Step

**Hard rule:** The agent must **never** chain multiple phases or subsections in one go without your explicit command. Work in small checkpoints — you review, then say continue.

### Three pause points

| When | What the agent does | Waits for you |
|---|---|---|
| **1. Before a phase starts** | Show **⏸️ YOUR TURN** checklist for that phase | *"Phase X ready"* / *"proceed"* |
| **2. After each subsection (X.Y) completes** | Summarize what was built · list files changed · note how to quick-test if applicable · **STOP** | *"continue"* / *"Phase 4.2"* / *"next"* |
| **3. After a full phase completes** | Recap entire phase · any manual steps you must do · **STOP** before next phase | *"Phase 5 ready"* / *"proceed to Phase 5"* |

### Subsection-level pauses (Phases 3–7)

Phases with numbered subsections — **one subsection per session unless you say otherwise:**

| Phase | Subsections (each = one pause) |
|---|---|
| **3** Landing | 3.1 → 3.2 → 3.3 → 3.4 → 3.5 → 3.6 → 3.7 |
| **4** Search results | 4.1 → 4.2 → 4.3 → 4.4 → 4.5 → 4.6 |
| **5** Seat map | 5.1 → 5.2 → 5.3 → 5.4 → 5.5 |
| **6** Booking | 6.1 → 6.2 → 6.3 → 6.4 → 6.5 |
| **7** My Bookings | 7.1 → 7.2 → 7.3 → 7.4 |

**Example flow:**
1. You: *"Phase 4 ready"* → agent builds **4.1 Page Layout** → stops
2. Agent: *"4.1 done. Files: `app/flights/page.tsx`, … Reply **continue** for 4.2 Filter Sidebar."*
3. You: *"continue"* → agent builds **4.2** → stops
4. … repeat until 4.6 → agent recaps Phase 4 → waits for *"Phase 5 ready"*

Phases **0, 1, 2, 8, 9, 10** have no X.Y subsections — pause **after the whole phase** (or after each logical chunk if the phase is long, but always stop before the next phase).

### After every subsection — agent message template

```
✅ Phase X.Y complete — [short title]

Built: [bullet list]
Test: [how to verify in browser/terminal, if applicable]

⏸️ Paused. Reply "continue" for Phase X.Y+1, or give feedback/changes.
```

### Your commands (cheat sheet)

| You say | Agent does |
|---|---|
| *"Phase 4 ready"* | Start Phase 4 (after your pre-phase checklist) |
| *"continue"* / *"next"* | Next subsection in current phase (e.g. 4.1 → 4.2) |
| *"Phase 5.3"* | Jump to that subsection (only if prior work is done) |
| *"skip 4.5"* | Skip optional subsection, pause before next |
| *"proceed to Phase 5"* | Finish current phase recap, wait for Phase 5 pre-checklist |
| *"fix …"* | Address feedback before continuing |

**Extra gate:** Before **Phase 3** (first frontend phase), always trigger the **Frontend Design Gate** — even if assets were provided earlier.

**Do not:** Batch 4.1 + 4.2 + 4.3 in one response unless you explicitly say *"do 4.1 through 4.3"* or *"no pauses"*.

**Your signal to continue:** Reply *"done"*, *"continue"*, *"next"*, or *"Phase X ready"* / *"Phase X.Y"* after each pause (subsection or phase).

---

## Phase Progress Tracker

| Phase | Description | Status | Manual Steps Required (You) |
|---|---|---|---|
| **Pre-project** | Accounts + assets | ✅ Done | Supabase + Node + Git · credentials saved · design assets in `design/` |
| **Phase 0** | Project Scaffolding | ✅ Done | Paste Supabase keys into `.env.local` · run `npm run dev` to verify |
| **Phase 1** | Database Setup | ✅ Done | Migrations + seed verified · 8 flights · 2016 seats · test user `xyz123@gmail.com` |
| **Phase 2** | Auth Setup | ⬜ Not Started | Supabase → Authentication → Providers → **enable Email** · disable confirm email for local dev (optional) |
| **Phase 3** | Landing Page | ⬜ Not Started | ✅ Assets in `design/` · reply *"Phase 3 proceed"* when ready to build |
| **Phase 4** | Flight Search Results | ⬜ Not Started | Optional: note any filter/sort preferences from reference sites · smoke-test search in browser after agent ships page |
| **Phase 5** | Seat Map + Realtime | ⬜ Not Started | Supabase → Database → Replication → add **`seats`** to `supabase_realtime` publication |
| **Phase 6** | Booking Flow | ⬜ Not Started | End-to-end test booking with test user · verify PNR appears on confirmation page |
| **Phase 7** | My Bookings | ⬜ Not Started | Test reschedule + cancel flows · confirm cancel blocked < 2 hours before departure (use seed flight times) |
| **Phase 8** | Zustand Stores | ⬜ Not Started | Open DevTools → Application → Local Storage · confirm passport number is **not** stored |
| **Phase 9** | PWA (Bonus) | ⬜ Not Started | Chrome Lighthouse audit → screenshot → save to `docs/lighthouse.png` · test install on mobile browser |
| **Phase 10** | Polish + Deploy | ⬜ Not Started | Create **public** GitHub repo → push → connect Vercel → add 3 env vars → verify production URL · add live URL to README |

**Status key:** ⬜ Not Started · 🔄 In Progress · ✅ Done · ❌ Blocked

---
## PHASE 0 — Project Scaffolding

> **Phase pause:** Agent completes all Phase 0 steps, recaps, then **stops** before Phase 1 (see Agent Workflow).

**Goal:** Running Next.js app with all dependencies installed and env configured.

> **⏸️ YOUR TURN — Before Phase 0 starts**
> - [ ] Supabase project created (see Pre-Project Checklist)
> - [ ] Node.js 18+ and Git installed
> - [ ] Have Supabase **URL**, **anon key**, and **service_role key** ready to paste into `.env.local`
>
> **Reply *"Phase 0 ready"* when done. Agent will scaffold; you paste keys when prompted.**

### Steps

- [x] `npx create-next-app@latest skyro --typescript --tailwind --app --src-dir` (in `c:\Skyro`)
- [x] Install dependencies: `@supabase/supabase-js`, `@supabase/ssr`, `zustand`, `next-pwa` (dev)
- [x] Create `.env.local` and `.env.example` with three Supabase placeholders
- [x] Create `supabase/migrations/` folder
- [x] Configure Tailwind / `globals.css` with Skyro tokens (`--color-primary: #4F46E5`)
- [x] Root layout metadata: title **Skyro — Flight Management**
- [x] Placeholder home page with Skyro branding
- [x] `git init` (commit when user requests)

**You (manual):** Paste real keys into `.env.local` · run `npm run dev` · confirm `http://localhost:3000` loads

---
## PHASE 1 — Database Setup (Supabase)

> **Phase pause:** Agent completes all Phase 1 steps, recaps, then **stops** — you run SQL in Supabase before Phase 2 (see Agent Workflow).

**Goal:** All tables, RLS, RPCs, trigger, and seed data live in Supabase.

> **⏸️ YOUR TURN — Before Phase 1 starts**
> - [ ] Phase 0 complete — `npm run dev` works, `.env.local` filled in
> - [ ] Open Supabase dashboard → **SQL Editor**
> - [ ] After agent writes migration files: run `001` → `005` in order, then `seed.sql`
> - [ ] Table Editor: confirm `flights`, `seats`, `bookings`, `passengers`, `reschedules` exist
> - [ ] Note test user email/password from seed for README
>
> **Reply *"Phase 1 done"* after SQL runs successfully.**

### Steps

- [ ] **`001_create_tables.sql`** — create all 5 tables + indexes + unique constraints
- [ ] **`002_enable_rls.sql`** — `ALTER TABLE ... ENABLE ROW LEVEL SECURITY` on all tables
- [ ] **`003_rls_policies.sql`** — public read on flights/seats; owner policies on bookings/passengers/reschedules
- [ ] **`004_rpcs.sql`** — `reserve_seat`, `cancel_booking` (security definer)
- [ ] **`005_triggers.sql`** — `check_cancel_window` trigger on bookings
- [ ] **`seed.sql`** — flights, seats, test auth user, sample bookings
- [ ] Document migration order in `supabase/README.md`

**File layout:**

```
supabase/
  migrations/
    001_create_tables.sql
    002_enable_rls.sql
    003_rls_policies.sql
    004_rpcs.sql
    005_triggers.sql
  seed.sql
```

**Verification queries (SQL Editor):**

```sql
SELECT count(*) FROM flights;
SELECT count(*) FROM seats;
SELECT policyname FROM pg_policies WHERE tablename = 'bookings';
```

---
## PHASE 2 — Auth Setup

> **Phase pause:** Agent completes all Phase 2 steps, recaps, then **stops** before Phase 3 (see Agent Workflow).

**Goal:** Login, signup, and session management wired to Supabase Auth.

> **⏸️ YOUR TURN — Before Phase 2 starts**
> - [ ] Supabase → **Authentication** → **Providers** → enable **Email**
> - [ ] Decide: confirm email on signup? (disable for faster local testing if you prefer)
> - [ ] Optional: set Site URL to `http://localhost:3000` under Authentication → URL Configuration
>
> **Reply *"Phase 2 ready"* when Email provider is enabled.**

### Steps

- [ ] `src/lib/supabase/client.ts` — browser client
- [ ] `src/lib/supabase/server.ts` — `createServerClient` for RSC
- [ ] `src/lib/supabase/middleware.ts` — session refresh helper
- [ ] `src/middleware.ts` — protect routes · refresh cookies
- [ ] `src/app/auth/login/page.tsx` — email/password login form
- [ ] `src/app/auth/signup/page.tsx` — signup form
- [ ] `src/components/auth/AuthModal.tsx` — lazy auth modal for seat-selection gate
- [ ] `src/components/auth/LogoutButton.tsx`
- [ ] Server action or route handler: `signIn`, `signUp`, `signOut`
- [ ] Redirect authenticated users away from `/auth/login` if already logged in

**Test:** Sign up test user · login · session cookie present · protected route redirects when logged out

---
## PHASE 3 — Frontend: Landing Page (`/`)

> **Subsection pauses:** Agent completes **one** of 3.1–3.7 per checkpoint, then stops for your *"continue"* (see Agent Workflow).

**Goal:** Full-screen hero with rotating background images, minimal nav, search card.

> **⏸️ YOUR TURN — FRONTEND GATE (required before any Phase 3 work)**
>
> **✅ You already provided assets in `design/`.** Agent verifies folders, copies JPGs from `design/destinations/` to `/public/hero/`, then builds using Skyscanner + EaseMyTrip + ixigo layout cues (Skyro indigo theme).
>
> 1. **Frontpage references** — `skyscanner*.png`, `easemytrip*.png`, `ixigo*.png` in `design/references/`
> 2. **Destination images** — 6 Unsplash JPGs in `design/destinations/` → copied to `/public/hero/` at build time
> 3. Optional: note any layout preference (e.g. *"more like Skyscanner dark hero"* vs *"more like ixigo light card"*)
>
> **Reply *"Phase 3 proceed"* when you want the landing page built.**

### 3.1 — Layout & Global Styles
- [ ] Update `src/app/layout.tsx` — Inter font · Skyro metadata · dark mode class on `<html>`
- [ ] `globals.css` — CSS variables: primary `#4F46E5`, accent `#7C3AED`, surfaces, borders
- [ ] `src/components/layout/Navbar.tsx` — Sky**ro** wordmark · Flights / My Bookings tabs · auth avatar
- [ ] `src/components/layout/Footer.tsx` — minimal links
- [ ] Mobile: bottom nav or hamburger per `design/references/` screenshots

### 3.2 — Search Card Component
- [ ] `src/components/search/FlightSearchCard.tsx` — trip type tabs (One Way / Round Trip)
- [ ] From / To fields with airport code hints (DEL, BOM, …)
- [ ] Swap origin/destination button
- [ ] Date pickers (departure · return if round trip)
- [ ] Passengers + class dropdown
- [ ] Indigo gradient **Search Flights** CTA → navigates to `/flights?...`
- [ ] Persist search params via `useFlightStore` on submit

### 3.3 — Hero Background (rotating images)
- [ ] Copy JPGs from `design/destinations/` → `/public/hero/` (see Design Assets inventory)
- [ ] `src/components/landing/HeroBackground.tsx` — crossfade every 5s · Ken Burns optional
- [ ] Dark gradient overlay for text contrast
- [ ] `prefers-reduced-motion` — show static first image

### 3.4 — Landing Page Assembly
- [ ] `src/app/page.tsx` — compose Navbar + Hero + SearchCard
- [ ] Headline: e.g. *"Find your next flight with Skyro"*
- [ ] Full viewport hero on desktop · stacked on mobile

### 3.5 — Trending Destinations Grid
- [ ] `src/components/landing/TrendingDestinations.tsx` — 4 cards with your photos
- [ ] Route labels: DEL→GOA, BOM→BLR, DEL→SIN, DEL→DXB (match seed)
- [ ] Click card → pre-fill search and go to `/flights`

### 3.6 — Stats Bar & Optional Sections
- [ ] Stats row: *"500+ flights daily"* style (static marketing copy OK)
- [ ] **Why Skyro** (optional): 3 feature cards — Instant Booking, Live Seat Map, Free Reschedule
- [ ] Offers row inspired by EaseMyTrip/ixigo (static cards OK for MVP)

### 3.7 — Polish & Responsive Pass
- [ ] Test 375px / 768px / 1280px
- [ ] Focus states · aria labels on search fields
- [ ] Lighthouse accessibility quick check

---
## PHASE 4 — Frontend: Flight Search Results (`/flights`)

> **Subsection pauses:** Agent completes **one** of 4.1–4.6 per checkpoint, then stops for your *"continue"* (see Agent Workflow).

**Goal:** Results list with filter sidebar, sort, and flight cards.

> **⏸️ YOUR TURN — Before Phase 4 starts**
> - [ ] Phase 3 landing page reviewed in browser — note any layout tweaks wanted
> - [ ] Optional: share a reference for flight results list / filter UI
> - [ ] After agent ships: test search from home → `/flights?from=...&to=...`
>
> **Reply *"Phase 4 proceed"* to start search results page.**

### 4.1 — Page Layout
- [ ] `src/app/flights/page.tsx` — read searchParams server-side
- [ ] Two-column desktop: sidebar + results · single column mobile
- [ ] `src/components/flights/FlightResultsHeader.tsx` — route summary · result count
- [ ] Loading skeleton while fetching

### 4.2 — Filter Sidebar
- [ ] `src/components/flights/FlightFilters.tsx` — price range slider
- [ ] Stops: non-stop / 1-stop (if applicable in seed)
- [ ] Class filter: economy / business / first
- [ ] Airline/status filter (optional)
- [ ] Mobile: filter bottom sheet

### 4.3 — Flight Card Component
- [ ] `src/components/flights/FlightCard.tsx` — airline/flight no · times · duration
- [ ] Price from `base_price` + class multiplier
- [ ] **Select** button → store flight in `useFlightStore` → navigate to seats

### 4.4 — Sort & Query Logic
- [ ] Sort: price asc/desc · departure time · duration
- [ ] `src/lib/flights/searchFlights.ts` — Supabase query with filters
- [ ] Empty state when no results

### 4.5 — Server Data Fetching
- [ ] Server Component fetch with anon client for public flight list
- [ ] Pass initial data to client list for hydration
- [ ] Re-fetch on filter change (client)

### 4.6 — UX Polish
- [ ] Sticky filter bar on mobile scroll
- [ ] Show selected class from search params on cards
- [ ] Error toast if Supabase fetch fails

---
## PHASE 5 — Frontend: Seat Selection (`/flights/[id]/seats`)

> **Subsection pauses:** Agent completes **one** of 5.1–5.5 per checkpoint, then stops for your *"continue"* (see Agent Workflow).

**Goal:** Visual seat map with live Realtime updates and class zones.

> **⏸️ YOUR TURN — Before Phase 5 starts**
> - [ ] Supabase → **Database** → **Replication** → `supabase_realtime` → enable **`seats`** table
> - [ ] Optional: open two browser windows to test live seat updates later
>
> **Reply *"Phase 5 ready"* after Realtime is enabled on `seats`.**

### 5.1 — Page Layout
- [ ] `src/app/flights/[id]/seats/page.tsx` — flight summary header
- [ ] Booking progress step indicator (step 2 of 4)
- [ ] Auth gate: if no session → open `AuthModal` before seat interaction

### 5.2 — Seat Map Grid
- [ ] `src/components/seats/SeatMap.tsx` — rows × columns (A–F)
- [ ] Color states: available · selected · taken · premium
- [ ] Class zones: economy rear · business front · legend
- [ ] Fetch seats for `flight_id` on mount

### 5.3 — Seat Selection Logic
- [ ] Click seat → optimistic update in `useFlightStore`
- [ ] Call `reserve_seat` only on **Continue** (or hold selection until confirm step — document choice)
- [ ] Show extra_fee in price preview
- [ ] Disable taken seats

### 5.4 — Supabase Realtime Subscription
- [ ] `src/hooks/useSeatRealtime.ts` — channel `seats:flight_id=eq.{id}`
- [ ] On `UPDATE` where `is_available = false` → update local grid
- [ ] Toast: *"A seat was just taken"* if user had it highlighted
- [ ] Cleanup subscription on unmount

### 5.5 — Continue to Booking
- [ ] Footer CTA: total price · **Continue to Passenger Details**
- [ ] Navigate to `/book/[flightId]` with seat in store
- [ ] Handle RPC error: seat taken → revert optimistic state

---
## PHASE 6 — Frontend: Booking Flow (`/book/[flightId]` + `/booking/[pnr]`)

> **Subsection pauses:** Agent completes **one** of 6.1–6.5 per checkpoint, then stops for your *"continue"* (see Agent Workflow).

**Goal:** Passenger form → confirmation with PNR.

> **⏸️ YOUR TURN — Before Phase 6 starts**
> - [ ] Log in with seed test user (or account you created)
> - [ ] Complete a seat selection through Phase 5 in browser
> - [ ] After agent ships: run full book flow and save a PNR for Phase 7 testing
>
> **Reply *"Phase 6 proceed"* when ready to build booking + confirmation.**

### 6.1 — Booking Page Layout
- [ ] `src/app/book/[flightId]/page.tsx` — summary sidebar (flight · seat · price)
- [ ] Progress step 3 of 4
- [ ] Redirect if no `selectedSeat` in store

### 6.2 — Passenger Form
- [ ] `src/components/booking/PassengerForm.tsx` — full name · passport · nationality · DOB
- [ ] Client-side validation (required fields · date format)
- [ ] **Do not** write passport to localStorage
- [ ] `bookingStep` = 3 in store

### 6.3 — Submit & RPC
- [ ] Server action `createBooking` → calls `reserve_seat` RPC
- [ ] Pass passenger as JSON to RPC
- [ ] On success: redirect to `/booking/[pnr]`
- [ ] On failure: show error · release optimistic seat if needed

### 6.4 — Confirmation Page
- [ ] `src/app/booking/[pnr]/page.tsx` — fetch booking by PNR + user
- [ ] Display: PNR large · flight · seat · passenger · total paid
- [ ] CTAs: **View My Bookings** · **Book another flight**
- [ ] `bookingStep` = 4 · optional `resetBooking` on leave

### 6.5 — Booking UX Polish
- [ ] Print-friendly confirmation stylesheet (optional)
- [ ] Copy PNR button
- [ ] Email confirmation placeholder (optional, no backend required)

---
## PHASE 7 — Frontend: My Bookings (`/bookings` + `/bookings/[id]`)

> **Subsection pauses:** Agent completes **one** of 7.1–7.4 per checkpoint, then stops for your *"continue"* (see Agent Workflow).

**Goal:** Dashboard to view, reschedule, and cancel bookings.

> **⏸️ YOUR TURN — Before Phase 7 starts**
> - [ ] At least one **confirmed booking** exists (from Phase 6 test)
> - [ ] Plan to test: reschedule to another flight, cancel a booking **outside** 2-hour window
> - [ ] Optional: adjust seed flight `departs_at` if you need to test the 2-hour cancel block
>
> **Reply *"Phase 7 proceed"* when you have a test booking.**

### 7.1 — My Bookings Page
- [ ] `src/app/bookings/page.tsx` — protected route
- [ ] Tabs: All · Upcoming · Past · Cancelled
- [ ] `src/components/bookings/BookingCard.tsx` — route · date · status badge · PNR
- [ ] Link to detail `/bookings/[id]`

### 7.2 — Booking Detail
- [ ] `src/app/bookings/[id]/page.tsx` — full itinerary · passenger · price
- [ ] Show reschedule history from `reschedules` table if any

### 7.3 — Reschedule Flow
- [ ] `src/components/bookings/RescheduleModal.tsx` — pick alternate flight (same route or flexible)
- [ ] Fee display if new price > old
- [ ] Update booking + insert `reschedules` row · swap seats
- [ ] Status → `rescheduled`

### 7.4 — Cancel Flow
- [ ] Confirm dialog with refund copy (static OK)
- [ ] Call `cancel_booking` RPC
- [ ] Handle trigger error: *"Cannot cancel within 2 hours"* — show user-friendly message
- [ ] Refresh list after cancel

---
## PHASE 8 — Zustand Store (Task 04)

> **Phase pause:** Agent completes all Phase 8 steps, recaps, then **stops** before Phase 9 (see Agent Workflow).

**Goal:** Well-structured persisted stores with correct partialize.

> **⏸️ YOUR TURN — Before Phase 8 starts**
> - [ ] Phases 3–7 functional enough to walk through booking flow once
> - [ ] After agent wires stores: DevTools → Application → Local Storage → verify **no passport** stored
>
> **Reply *"Phase 8 proceed"* to finalize store persistence rules.**

### Steps

- [ ] `src/store/useFlightStore.ts` — all fields + actions from master plan
- [ ] `src/store/useUserStore.ts` — session + cachedBookings
- [ ] `persist` middleware with `createJSONStorage(() => localStorage)`
- [ ] **partialize** — exclude `passengerForm` and `cachedBookings`
- [ ] `resetBooking()` on logout and after successful confirmation (configurable)
- [ ] TypeScript interfaces in `src/types/` — `Flight`, `Seat`, `Booking`, `SearchQuery`
- [ ] Wire stores into search, seat map, booking pages (replace prop drilling)
- [ ] Unit test or manual checklist doc for persist rules

---
## PHASE 9 — PWA Configuration (Bonus Task 05)

> **Phase pause:** Agent completes all Phase 9 steps, recaps, then **stops** before Phase 10 (see Agent Workflow).

**Goal:** Installable, offline-capable app scoring ≥ 90 on Lighthouse PWA audit.

> **⏸️ YOUR TURN — Before Phase 9 starts**
> - [ ] App runs locally without errors on `npm run build`
> - [ ] Provide or approve app icons (192×192 and 512×512 PNG) — agent can generate placeholders if you skip
> - [ ] After config: Chrome DevTools → Lighthouse → PWA → screenshot → save as `docs/lighthouse.png`
> - [ ] Test **Add to Home Screen** on a real phone
>
> **Reply *"Phase 9 proceed"* to start PWA setup (bonus — skip if short on time).**

### Steps

- [ ] Configure `next-pwa` in `next.config.ts` (disable in dev if needed)
- [ ] `public/manifest.json`:
  ```json
  {
    "name": "Skyro",
    "short_name": "Skyro",
    "theme_color": "#4F46E5",
    "background_color": "#ffffff",
    "display": "standalone",
    "start_url": "/"
  }
  ```
- [ ] Icons: `public/icons/icon-192.png`, `icon-512.png`
- [ ] Offline fallback page `src/app/offline/page.tsx`
- [ ] Meta tags in layout: `theme-color`, apple-mobile-web-app
- [ ] `docs/lighthouse.png` — your screenshot after audit

---
## PHASE 10 — Polish, README & Deploy

> **Phase pause:** Agent completes deploy + README, recaps submission checklist, then **stops** — project handoff (see Agent Workflow).

**Goal:** Production-ready repo, clean README, live Vercel URL.

> **⏸️ YOUR TURN — Before Phase 10 starts**
> - [ ] Create **public** GitHub repository named `skyro` (or your choice)
> - [ ] Vercel account connected to GitHub
> - [ ] Prepare to add env vars in Vercel: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
> - [ ] Final pass: test mobile (375px), tablet (768px), desktop (1280px)
> - [ ] Share **live Vercel URL** + **test login** for submission
>
> **Reply *"Phase 10 proceed"* with GitHub repo URL when ready to deploy.**

### Code Quality Pass
- [ ] Remove `console.log` debug statements
- [ ] Fix ESLint warnings
- [ ] Ensure no `any` types
- [ ] No secrets in repo (`.env.local` gitignored)

### README Requirements
- [ ] Project title: **Skyro — Flight Management PWA**
- [ ] Live demo URL (Vercel)
- [ ] Screenshots (landing · seat map · confirmation)
- [ ] Tech stack list
- [ ] Setup: clone · `npm install` · `.env.example` · migrations · `npm run dev`
- [ ] Test credentials (email/password from seed)
- [ ] Feature checklist matching evaluation criteria
- [ ] Optional: link to `docs/architecture.html`

### Deploy Steps
- [ ] Push to GitHub `main`
- [ ] Import project in Vercel · framework Next.js
- [ ] Add 3 env vars in Vercel dashboard
- [ ] Redeploy if env added after first deploy
- [ ] Smoke test production: search · login · book · bookings

---

## Submission Checklist

Before submitting, confirm:

- [ ] **Public GitHub repo** with full source
- [ ] **Live Vercel URL** in README
- [ ] **README** includes setup + test login
- [ ] **Supabase migrations** in `supabase/migrations/` (001–005) + `seed.sql`
- [ ] **Core flow works:** search → seats → book → PNR → my bookings
- [ ] **Realtime:** seat map updates in second browser/tab
- [ ] **Cancel rule:** cannot cancel within 2 hours of departure
- [ ] **Reschedule** creates `reschedules` row
- [ ] **No passport** in localStorage
- [ ] **Responsive** on mobile
- [ ] **(Bonus)** PWA installable + `docs/lighthouse.png`

---

## Commit Message Convention

Use **conventional commits** — present tense, scoped when helpful:

| Prefix | When | Example |
|---|---|---|
| `feat:` | New feature | `feat: add seat map realtime subscription` |
| `fix:` | Bug fix | `fix: revert optimistic seat on RPC error` |
| `chore:` | Tooling / deps | `chore: add supabase migration 003 rls` |
| `style:` | UI only | `style: skyro indigo search button` |
| `docs:` | README / CLAUDE | `docs: update phase tracker phase 1 done` |

One logical change per commit. Reference phase in body if useful: `Phase 5.4 — Realtime hook`

---

## Priority Order If Running Short on Time

Implement in this order — stop at the tier you need:

| Priority | Phases | Minimum viable |
|---|---|---|
| **P0 — Must ship** | 0 → 1 → 2 → 3.1–3.4 → 4.1–4.4 → 5.1–5.4 → 6.1–6.4 → 7.1–7.4 | End-to-end book + PNR + list bookings + cancel |
| **P1 — Strong submission** | + 3.5–3.7 · 4.5–4.6 · 5.5 · 8 | Polish UI · Zustand persist rules · Realtime toast |
| **P2 — Excellent** | + reschedule flow · `docs/architecture.html` in README · Phase 10 deploy | Full feature parity |
| **P3 — Bonus** | Phase 9 PWA | Lighthouse + installable |

**Skip first if desperate:** Phase 9 (PWA) · 3.6 offers section · reschedule (keep cancel)

---

*End of Skyro Project Master Plan — follow phase pauses and reply **continue** between subsections.*
