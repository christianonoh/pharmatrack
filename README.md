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

---

# Product Requirements Document (PRD)

**Pharmacy Stock & Expiry Manager**

- **Prepared By:** Sarah Nnanyelugo (Client)
- **Prepared For:** Christian Onoh (Developer)

## 1. Project Overview

**Product Name:** PharmaTrack

### Product Description

PharmaTrack is a web-based inventory management system designed for small and medium pharmacies to manage medicine stock, monitor expiry dates, track low inventory, and organize pharmaceutical records efficiently.

The application helps reduce:

- losses from expired medicines
- stock shortages
- manual inventory errors

The system will provide a clean dashboard interface for managing medicines and viewing inventory alerts in real time.

## 2. Problem Statement

Many local pharmacies still manage inventory manually using notebooks or spreadsheets. This leads to:

- expired medicines remaining on shelves
- inaccurate stock counts
- delayed restocking
- difficulty tracking inventory performance

PharmaTrack provides a simple digital solution to these challenges.

## 3. Product Goals

### Primary Goals

- Digitize pharmacy inventory management
- Reduce expired medicine losses
- Improve stock monitoring
- Provide simple inventory analytics

### Secondary Goals

- Improve record accessibility
- Simplify medicine searching and filtering
- Build a responsive and modern management interface

## 4. Target Users

### Primary Users

- Small pharmacy owners
- Pharmacy attendants
- Drug store managers

## 5. Scope

### In Scope (MVP)

**Authentication**

- Simple login page (optional for MVP)

**Dashboard**

- Inventory overview
- Expiry alerts
- Low stock alerts
- Statistics cards
- Charts

**Medicine Management**

- Add medicine
- Edit medicine
- Delete medicine
- View medicine details

**Inventory Features**

- Search medicines
- Filter medicines
- Categorize medicines

**Alert System**

- Expired medicines
- Expiring soon medicines
- Low stock medicines

**Local Data Storage**

- LocalStorage or Firebase

## 6. Functional Requirements

### 6.1 Dashboard Module

**Description**

Displays summary information and alerts.

**Features**

- Total medicines count
- Total inventory value
- Expired medicines count
- Expiring soon count
- Low stock count
- Recent inventory activity

**Charts**

- Medicines by category
- Inventory growth trend

**Actions**

- Add medicine
- Edit medicine
- Delete medicine
- Search medicine
- Filter medicines

### 6.3 Expiry Monitoring Module

**Description**

Automatically identifies:

- expired medicines
- medicines expiring soon

### 6.4 Low Stock Monitoring

**Description**

Detects medicines below minimum quantity threshold.

### 6.5 Search & Filtering

**Search By**

- Medicine name
- Supplier
- Category

**Filters**

- Expired
- Expiring Soon
- Low Stock
- Category

## 7. Non-Functional Requirements

### Responsiveness

- Mobile-friendly
- Tablet-friendly
- Desktop optimized

### Accessibility

- Readable fonts
- Keyboard-friendly forms
- Clear status indicators

### Reliability

- Data persists after refresh
- Prevent invalid form submissions
