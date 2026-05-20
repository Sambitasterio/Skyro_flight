# Skyro

Flight management PWA — search, book seats, manage bookings. Built with Next.js, Supabase, and Zustand.

## Project structure

```
Skyro/
├── CLAUDE.md              # Master plan, phases, your checklists
├── AGENTS.md              # Next.js agent rules (Cursor)
├── src/                   # Next.js app (App Router)
├── public/                # Static assets (hero images go in public/hero/ at Phase 3)
├── supabase/
│   └── migrations/        # SQL migrations + seed (Phase 1)
├── design/
│   ├── references/        # UI inspiration screenshots (PNG)
│   └── destinations/      # Hero / trending photos (JPG)
└── docs/
    ├── architecture.html  # System diagrams — open in browser
    └── assignment/        # Original assignment PDF
```

## Getting started

1. `npm install`
2. Copy `.env.example` → `.env.local` and fill in Supabase keys
3. `npm run dev` → [http://localhost:3000](http://localhost:3000)

See **`CLAUDE.md`** for full phase-by-phase build plan.

## Docs

- **Architecture:** open [`docs/architecture.html`](./docs/architecture.html) in a browser
- **Design refs:** [`design/`](./design/)

## Deploy

Deploy on [Vercel](https://vercel.com) with the same three env vars from `.env.local`.
