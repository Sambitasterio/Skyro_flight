# PWA setup & verification (Phase 9)

Skyro uses [`next-pwa`](https://github.com/shadowwalker/next-pwa). The service worker is **only** created on a **production webpack build**, not on `npm run dev`.

---

## Part 1 — Start the production server (required first)

Do this in **PowerShell** from `c:\Skyro`:

```powershell
cd c:\Skyro
npm run build
npm run start
```

**Wait until you see:**

```text
▲ Next.js ...
- Local:    http://localhost:3000
```

Leave this terminal **open**. Do not run `npm run dev` in another terminal at the same time (port 3000 conflict).

**Quick check before Lighthouse:**

1. Open Chrome → **http://localhost:3000**
2. Press **F12** → **Application** tab → left sidebar **Service Workers**
3. You should see **`http://localhost:3000/sw.js`** registered and **activated** (green).  
   - If empty: you are not on production (`npm run start`), build is stale, or you need a **hard refresh** (Ctrl + Shift + R).  
   - Skyro registers the worker via `PwaRegister` in the App Router layout (next-pwa alone only hooks `main.js`, which App Router does not load).
4. Optional: **Console** tab → no red `[PWA] Service worker registration failed` errors.

---

## Part 2 — Lighthouse PWA audit (full steps)

### 2.1 Prepare the browser

1. Use **Google Chrome** (Lighthouse PWA checks are most reliable in Chrome).
2. Open a **new Incognito window** (Ctrl + Shift + N).  
   - Why: fewer extensions and old service workers interfering with the score.
3. In the address bar, go to **http://localhost:3000** (not `127.0.0.1` unless you always use that — pick one and stick to it).
4. Wait until the landing page fully loads (hero + search card visible).

### 2.2 Open Lighthouse

1. Press **F12** to open DevTools.
2. Click the **Lighthouse** tab in the top row.  
   - If missing: click **`>>`** → **Lighthouse**.
3. In the Lighthouse panel, set these options **exactly**:

| Setting | Value |
|---------|--------|
| **Mode** | **Navigation** (default) |
| **Device** | **Mobile** |
| **Categories** | Uncheck everything except **Progressive Web App** |

Leave **Clear storage** **unchecked** for the first run (so the service worker from your visit stays registered). If the score is odd, run again with **Clear storage** checked.

### 2.3 Run the audit

1. Confirm the URL shown is **http://localhost:3000** (Lighthouse uses the current tab URL).
2. Click **Analyze page load**.
3. Wait 30–60 seconds. Do not switch tabs until the report finishes.

### 2.4 Read the result

- Top of the report: **PWA** score (0–100). Target: **≥ 90**.
- Expand sections if score is low. Common fixes:
  - **Installable** — manifest + icons + HTTPS (localhost is OK).
  - **Service worker** — Part 1 not done or wrong URL.
  - **Offline** — `/offline` fallback; rebuild if missing.

### 2.5 Save `docs/lighthouse.png` (screenshot)

**Option A — Screenshot the Lighthouse report (recommended)**

1. In the Lighthouse tab, scroll so the **PWA score circle** and title **“Progressive Web App”** are visible.
2. Windows **Snipping Tool** or **Win + Shift + S** → capture the report area.
3. Save the image as:

   ```text
   c:\Skyro\docs\lighthouse.png
   ```

4. In File Explorer, confirm the file exists and opens correctly.

**Option B — Full report export**

1. In the Lighthouse panel, click the **⋮** (three dots) or **Save** / **Export** if shown.
2. If only HTML/JSON is offered, use Option A for the submission screenshot.

**Git:** commit `docs/lighthouse.png` with your Phase 9 commit when you are happy with the score.

---

## Part 3 — Install on desktop Chrome (same machine)

With **`npm run start`** still running:

1. Normal (or Incognito) window → **http://localhost:3000**
2. Look at the **address bar** on the right for an **Install** (⊕ or monitor icon) button.  
   - Or: **⋮** menu → **Cast, save, and share** → **Install Skyro…**
3. Click **Install** → confirm.
4. Skyro opens in its **own window** (no browser tabs) — that means install worked.
5. To remove: **⋮** in the app window → **Uninstall Skyro**, or `chrome://apps`.

---

## Part 4 — Install on phone (Android / iPhone)

Your phone must reach your PC on the **same Wi‑Fi**. `localhost` on the phone means the phone itself, not your PC — so you use your PC’s **LAN IP**.

### 4.1 Find your PC’s IP address (Windows)

In **PowerShell** (new window is fine):

```powershell
ipconfig
```

Under your active adapter (**Wi‑Fi** or **Ethernet**), find **IPv4 Address**, e.g. `192.168.1.42`.  
Write it down: `YOUR_PC_IP`.

### 4.2 Allow Windows Firewall (if the phone cannot connect)

If the phone browser shows “Can’t reach this page”:

1. Windows **Settings** → **Privacy & security** → **Windows Security** → **Firewall & network protection**
2. **Allow an app through firewall**
3. Ensure **Node.js** is allowed on **Private** networks, or temporarily allow inbound **TCP port 3000** for private networks.

Alternatively, when Windows pops up “Allow Node.js on private networks?” the first time you run `npm run start`, click **Allow**.

### 4.3 Start server listening on all interfaces

By default `next start` binds to `0.0.0.0` on recent Next versions, but if only localhost works, stop the server (Ctrl + C) and run:

```powershell
cd c:\Skyro
$env:HOSTNAME="0.0.0.0"
npm run start
```

Or:

```powershell
npx next start -H 0.0.0.0 -p 3000
```

### 4.4 Open Skyro on the phone

1. Phone on **same Wi‑Fi** as the PC (not mobile data only).
2. Phone browser (Chrome on Android recommended):
   ```text
   http://YOUR_PC_IP:3000
   ```
   Example: `http://192.168.1.42:3000`
3. The Skyro landing page should load. If not, fix firewall/IP from 4.1–4.2.

### 4.5 Add to Home screen — Android (Chrome)

1. With the site open, tap **⋮** (top right).
2. Tap **Install app** or **Add to Home screen** (wording varies by Chrome version).
3. Confirm name **Skyro** → **Add** / **Install**.
4. Home screen gets a Skyro icon; tap it — app opens fullscreen (standalone).

### 4.6 Add to Home screen — iPhone (Safari)

1. Open **Safari** → `http://YOUR_PC_IP:3000` (Safari is required for “Add to Home Screen” on iOS).
2. Tap **Share** (square with arrow).
3. Scroll → **Add to Home Screen**.
4. Tap **Add**. Icon appears on home screen.

Note: iOS Safari PWA support differs from Android; install for demo is enough; Lighthouse is usually run on desktop Chrome.

### 4.7 After you deploy to Vercel (easier for phones)

Replace `http://YOUR_PC_IP:3000` with your **https://your-app.vercel.app** URL. HTTPS + public URL is what reviewers use; LAN steps are for local testing only.

---

## Part 5 — Checklist before submission

| Step | Done? |
|------|--------|
| `npm run build` completed without errors | ☐ |
| `npm run start` → `http://localhost:3000` loads | ☐ |
| DevTools → Application → Service Workers → `sw.js` active | ☐ |
| Lighthouse PWA ≥ 90 (mobile) | ☐ |
| `docs/lighthouse.png` saved in repo | ☐ |
| Desktop **Install Skyro** works | ☐ |
| Phone opens site via LAN IP (or Vercel URL) | ☐ |
| Phone **Add to Home screen** / **Install app** works | ☐ |

---

## Assets in repo

| File | Purpose |
|------|---------|
| `public/manifest.json` | Web app manifest |
| `public/icons/icon-192.png` | Install icon |
| `public/icons/icon-512.png` | Install / splash |
| `src/app/offline/page.tsx` | Offline fallback (`/offline`) |
| `public/sw.js` | Generated at build (gitignored) |

Regenerate icons (Windows): `powershell -File scripts/create-pwa-icons.ps1`
