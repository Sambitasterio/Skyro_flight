# Skyro — Design assets

Used at **Phase 3** (landing page). Route photos live in `destinations/` and are copied to `public/hero/` for the app.

| Folder | Files | Use |
|--------|-------|-----|
| [`references/`](./references/) | `skyscanner*.png`, `easemytrip*.png`, `ixigo*.png` | Frontpage layout inspiration (dev reference only) |
| [`destinations/`](./destinations/) | `goa.jpg`, `bengaluru.jpg`, `singapore.jpg`, `dubai.jpg` + Unsplash extras | Hero rotation + trending cards |

### Route photos (primary)

| File | Route / city |
|------|----------------|
| `goa.jpg` | DEL → GOA |
| `bengaluru.jpg` | BOM → BLR |
| `singapore.jpg` | DEL → SIN |
| `dubai.jpg` | DEL → DXB |

After adding or replacing photos in `destinations/`, copy to `public/hero/`:

```powershell
Copy-Item design/destinations/goa.jpg public/hero/goa.jpg -Force
Copy-Item design/destinations/bengaluru.jpg public/hero/bengaluru.jpg -Force
Copy-Item design/destinations/singapore.jpg public/hero/singapore.jpg -Force
Copy-Item design/destinations/dubai.jpg public/hero/dubai.jpg -Force
```

Do **not** use PNG screenshots as hero backgrounds — JPGs only in production UI.
