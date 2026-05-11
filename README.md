# PharmaTrack

A local-first inventory management SPA for small and medium pharmacies. Track medicines, monitor expiry dates, get low-stock alerts, and see your inventory at a glance — all stored in the browser, no backend required.

## Features

- **Dashboard** — Total medicines, inventory value, and alert counts surfaced as stat cards, plus a category distribution chart.
- **Inventory** — Searchable, filterable table with add / edit / delete; persists across refresh via `localStorage`.
- **Alerts** — Three live lists (expired, expiring within 30 days, low stock) computed from your inventory.
- **Responsive** — Sidebar on desktop, hamburger drawer on mobile.
- **Local-first** — No accounts, no network calls; your data lives in your browser.

## Tech Stack

- React 19 + TypeScript (strict mode)
- Vite
- Tailwind CSS v4
- React Router v6
- Recharts
- Lucide React

## Getting Started

```bash
npm install
npm run dev
```

Then open <http://localhost:5173>.

### Scripts

| Command           | What it does                          |
| ----------------- | ------------------------------------- |
| `npm run dev`     | Start the Vite dev server with HMR    |
| `npm run build`   | Type-check and build for production   |
| `npm run preview` | Preview the production build locally  |
| `npm run lint`    | Run ESLint                            |

## Project Structure

```
src/
├── components/        Shared UI (Button, Input, Modal, Table, Layout, …)
├── features/
│   ├── dashboard/     Stat cards + category chart
│   ├── inventory/     Table, search, filters, add/edit/delete
│   └── alerts/        Alert lists + reusable status utilities
├── lib/               cn, date, currency helpers
├── services/          Storage abstraction + LocalStorage impl + seed data
└── types/             Global TypeScript interfaces
```

## Data & Storage

All inventory lives under the `pharmatrack:medicines:v1` key in `localStorage`. On first load, the app seeds itself with 16 sample medicines covering every alert state so you can explore the UI immediately.

Components never touch `localStorage` directly — they go through the `InventoryStorage` interface in `src/services/storage.ts`. Swapping in a different backend (Firebase, IndexedDB, REST API) only requires writing a new implementation behind that interface.

### Resetting the data

To start over with a fresh seed, clear the storage key:

```js
// in DevTools console
localStorage.removeItem('pharmatrack:medicines:v1');
location.reload();
```

## Alert Rules

| Status         | Condition                                          | Color  |
| -------------- | -------------------------------------------------- | ------ |
| Expired        | Expiry date is in the past                         | Red    |
| Expiring soon  | Not yet expired, within 30 days from today         | Orange |
| Low stock      | `quantity < minQuantityThreshold`                  | Amber  |

When multiple conditions apply, status priority is **expired → expiring-soon → low-stock**.

## License

For educational use.
