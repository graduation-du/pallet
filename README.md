# PalletTrack Pro

**Tagline:** Track Every Pallet. Every Movement. Every Return.

A web-based Returnable Pallet Tracking and Management System. Every physical pallet gets a permanent digital identity (a unique QR code), and the system captures every movement — from manufacturing, through loading, dispatch, delivery, return pickup, and factory receiving — as a continuous, auditable history.

## Core innovation

A **state-driven scanning workflow**: scanning a QR code looks up the pallet's current status and presents the single correct next-action form. This eliminates duplicate entries, skipped steps, and operator confusion.

## Tech stack

- Next.js 16 (App Router) + React 19 + TypeScript
- Tailwind CSS v4 (CSS-first config via `@theme`)
- Prisma + MySQL
- NextAuth v5 (credentials, JWT sessions)
- Framer Motion (animations)
- html5-qrcode (in-browser QR scanner)
- lucide-react (icons)
- qrcode (QR code generation for labels)

## Getting started

```bash
# 1. Copy env and set your DB credentials
cp .env.example .env

# 2. Install dependencies
npm install

# 3. Create the MySQL database named "pallettrack"

# 4. Run migrations + seed demo data
npm run db:migrate
npm run db:seed

# 5. Start dev server
npm run dev
```

Open http://localhost:3000

## Demo accounts

All demo accounts use the password `password123`.

| Email | Role |
|-------|------|
| admin@pallettrack.local | Administrator |
| manufacturing@pallettrack.local | Manufacturing Staff |
| loader@pallettrack.local | Warehouse Loader |
| dispatcher@pallettrack.local | Dispatcher |
| receiver@pallettrack.local | Delivery Receiver |
| collector@pallettrack.local | Return Collector |
| factory@pallettrack.local | Factory Receiver |
| manager@pallettrack.local | Manager |

## Pallet lifecycle (state machine)

```
Available → Loaded → In Transit → Delivered → Returning → Available (loop)
                                                    ↘ Damaged → Under Repair → Available / Retired
Any status → Lost (Admin only, requires justification)
```

## Architecture

- `src/app/` — App Router pages (login, admin/*, scan/*)
- `src/components/ui/` — design system primitives (Button, Card, Badge, Modal, Toast, ScannerView)
- `src/components/admin/` — admin section client components
- `src/components/layout/` — role-based shells (AdminShell)
- `src/components/brand/` — logo
- `src/components/motion/` — page reveal / stagger helpers
- `src/lib/` — domain logic (roles, state machine, audit, db, formatting)
- `prisma/schema.prisma` — database schema

## Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run lint` | ESLint |
| `npm run db:migrate` | Run Prisma migrations |
| `npm run db:seed` | Seed demo data |
| `npm run db:studio` | Open Prisma Studio |
| `npm test` | Run Vitest tests |
