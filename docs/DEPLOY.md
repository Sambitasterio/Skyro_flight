# Deploy Skyro to Vercel (Phase 10)

Complete guide: GitHub → Vercel → Supabase production auth → smoke test → README update.

**Your repo:** `https://github.com/Sambitasterio/Skyro_flight`  
**Build command in repo:** `npm run build` (runs `next build --webpack` for PWA)

---

## Part A — Before you deploy (checklist)

| # | Task | Done? |
|---|------|-------|
| 1 | Supabase project exists with migrations `001`–`006` + `seed.sql` run | ☐ |
| 2 | Realtime enabled on **`seats`** table | ☐ |
| 3 | `.env.local` works locally (`npm run dev`) | ☐ |
| 4 | Latest code committed and pushed to GitHub `main` | ☐ |
| 5 | GitHub repo is **Public** (for submission) | ☐ |
| 6 | Vercel account ([vercel.com](https://vercel.com)) signed in with GitHub | ☐ |
| 7 | You have all 3 env values copied from Supabase (see Part D) | ☐ |

---

## Part B — Push latest code to GitHub

### B.1 Commit anything left locally

In PowerShell:

```powershell
cd c:\Skyro
git status
```

If you have changes, stage and commit:

```powershell
git add .
git commit -m "docs: README and Vercel deploy guide for Phase 10"
```

### B.2 Push to GitHub

```powershell
git push origin main
```

### B.3 Verify on GitHub

1. Open **https://github.com/Sambitasterio/Skyro_flight**
2. Confirm latest commit appears on **`main`**
3. Confirm **no** `.env.local` in the file list (must stay gitignored)

---

## Part C — Create the Vercel project

### C.1 Import from GitHub

1. Go to **https://vercel.com/dashboard**
2. Click **Add New…** → **Project**
3. **Import** `Sambitasterio/Skyro_flight` (or your fork)
   - If the repo is missing: **Adjust GitHub App Permissions** and grant access to the repo
4. **Framework Preset:** should auto-detect **Next.js** — leave it
5. **Root Directory:** `./` (default)
6. **Do not deploy yet** — open **Environment Variables** first (Part D)

### C.2 Build settings (confirm)

On the import screen (or **Settings → General → Build & Development Settings**):

| Setting | Value |
|---------|--------|
| Framework | Next.js |
| Build Command | `npm run build` *(default is fine — uses webpack via package.json)* |
| Output Directory | *(leave default — Next.js)* |
| Install Command | `npm install` |
| Node.js Version | **20.x** (recommended) |

Click **Deploy** only after env vars are set (Part D), or deploy once and redeploy after adding env (Part F).

---

## Part D — Environment variables on Vercel

You need **the same three keys** as `.env.local`.

### D.1 Copy values from Supabase

1. **https://supabase.com/dashboard** → your project
2. **Project Settings** (gear) → **API**
3. Copy:

| Name in Vercel | Supabase field |
|----------------|----------------|
| `NEXT_PUBLIC_SUPABASE_URL` | **Project URL** (e.g. `https://xxxxx.supabase.co`) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | **anon** `public` key |
| `SUPABASE_SERVICE_ROLE_KEY` | **service_role** `secret` key |

Never commit these to Git. Only paste into Vercel (and local `.env.local`).

### D.2 Add each variable in Vercel

**Project → Settings → Environment Variables**

For **each** of the three names:

1. **Key:** exact name (e.g. `NEXT_PUBLIC_SUPABASE_URL`)
2. **Value:** paste from Supabase (no quotes)
3. **Environments:** check **Production**, **Preview**, and **Development**
4. Click **Save**

Repeat for all three.

### D.3 Sanity check

You should see exactly:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

---

## Part E — Supabase Auth for production URL (required)

Without this, login/signup works on localhost but **fails on Vercel**.

### E.1 Deploy once to get your Vercel URL

If you have not deployed yet:

1. Vercel → **Deploy** (or push to `main` if Git integration auto-deploys)
2. Wait until status **Ready**
3. Copy your URL, e.g. `https://skyro-flight.vercel.app` or `https://skyro-flight-xxx.vercel.app`

### E.2 Configure Supabase URL settings

Supabase → **Authentication** → **URL Configuration**

| Field | Value |
|-------|--------|
| **Site URL** | `https://YOUR-APP.vercel.app` *(your real Vercel URL, no trailing slash)* |
| **Redirect URLs** | Add these lines (one per line): |

```
https://YOUR-APP.vercel.app/**
http://localhost:3000/**
```

Replace `YOUR-APP.vercel.app` with your actual hostname.

Click **Save**.

### E.3 Email provider

**Authentication → Providers → Email** → **Enabled** (same as local).

Optional for demos: disable **Confirm email** so signup works instantly.

---

## Part F — Deploy and redeploy

### F.1 First production deploy

- If you already clicked Deploy: wait until **Building** → **Ready**
- If env vars were added **after** first deploy: you **must redeploy**

### F.2 Redeploy after env changes

1. Vercel project → **Deployments**
2. Latest deployment → **⋯** menu → **Redeploy**
3. Check **Use existing Build Cache** (optional) → **Redeploy**
4. Wait until **Ready**

### F.3 Build logs (if deploy fails)

1. Open the failed deployment → **Building**
2. Common fixes:
   - Missing env var → add in Part D, redeploy
   - TypeScript error → fix locally, `npm run build`, push again
   - Wrong Node version → Settings → Node.js **20.x**

---

## Part G — Production smoke test (full flow)

Open **`https://YOUR-APP.vercel.app`** in Chrome (not localhost).

| # | Step | Expected |
|---|------|----------|
| 1 | Landing `/` loads, hero + search | Page renders, no 500 |
| 2 | Search **DEL → BOM** (or seeded route) | `/flights` shows cards |
| 3 | **Log in** (navbar) | `xyz123@gmail.com` / `123456` or your signup user |
| 4 | Select flight → seat map | Map loads, seats clickable |
| 5 | Select seat → **Continue** | Reaches passenger form |
| 6 | Submit passenger → confirmation | PNR page with code |
| 7 | **My Bookings** | Booking listed |
| 8 | Open booking → **Reschedule** / **Cancel** | Modals work (cancel only if >2h before departure) |
| 9 | **Install app** (optional) | Chrome address bar install icon |
| 10 | DevTools → Application → Service workers | `sw.js` activated on production URL |

### Realtime test (two browsers)

1. Browser A: logged in, seat map for a flight
2. Browser B: same flight, book a seat
3. Browser A: seat shows taken / toast (without full page refresh)

---

## Part H — Update README with live URL

1. Open **`README.md`** in the repo
2. Replace the placeholder **Live demo** link:

   ```markdown
   **Live demo:** https://YOUR-ACTUAL-URL.vercel.app
   ```

3. In the evaluation checklist, check:

   ```markdown
   - [x] Live Vercel URL in README
   ```

4. Commit and push:

   ```powershell
   git add README.md
   git commit -m "docs: add live Vercel demo URL"
   git push origin main
   ```

Vercel will auto-redeploy on push (optional; README-only change does not need a rebuild for the app to work).

---

## Part I — Submission package

Hand in / share:

| Item | Where |
|------|--------|
| Public GitHub repo | `https://github.com/Sambitasterio/Skyro_flight` |
| Live URL | Vercel dashboard → Domains / deployment URL |
| Test login | `xyz123@gmail.com` / `123456` (in README) |
| Migrations | `supabase/migrations/` + `seed.sql` |
| PWA proof | `docs/lighthouse.png` |
| Architecture | `docs/architecture.html` |

---

## Part J — Troubleshooting

### Login works locally but not on Vercel

- Redo **Part E** (Site URL + Redirect URLs)
- Confirm env vars on Vercel match Supabase project
- Redeploy after env changes

### “Failed to fetch” / no flights

- `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` wrong or missing
- RLS: migrations `002`–`003` must be applied
- Check Supabase **Logs** → API

### Seat map never updates live

- **Database → Replication** → `seats` must be in publication
- Use **https** production URL (Vercel provides this)

### Reschedule fails

- Run **`006_rpc_reschedule_booking.sql`** in SQL Editor if not applied

### PWA / service worker missing on Vercel

- Build must use webpack: `npm run build` in `package.json` (already set)
- Check production site → DevTools → Application → Service workers
- `PwaRegister` in layout registers `/sw.js`

### Vercel build timeout

- Large `public/hero/` images are OK; if needed, upgrade plan or optimize JPGs later

---

## Quick command reference

```powershell
# Local production test before deploy
cd c:\Skyro
npm run build
npm run start

# Push to GitHub
git push origin main
```

After Vercel is live, your submission line is:

> **Live demo:** `https://<your-project>.vercel.app` · **Login:** `xyz123@gmail.com` / `123456`
