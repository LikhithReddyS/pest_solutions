# Amarnath Pest Solutions — Admin Dashboard

A full-stack admin-only web application for managing pest control projects, service records, billing, and invoices.

## Tech Stack

- **Framework:** Next.js 15 (App Router) with React 19
- **Language:** TypeScript
- **Database:** SQLite via Prisma ORM
- **Auth:** JWT (jose) with bcryptjs password hashing
- **PDF:** jsPDF + jspdf-autotable for invoice generation
- **Icons:** Lucide React
- **Styling:** Vanilla CSS with custom design system

## Features

- 🔐 Admin-only login with JWT-based session
- 📁 Project management (CRUD) for pest control jobs
- 🔧 Service records with date, type, technician, amount, payment status
- 💰 Auto-calculated totals per project (total services, total bill, paid, pending)
- 📄 PDF invoice generation per service (APS-YYYY-NNNN format)
- 📊 Reports page (monthly revenue, pending payments, project-wise summary)
- 🔍 Search & filter by project name, client, phone, and status
- 📱 Fully responsive — works on desktop, tablet, and mobile
- ⚙️ Settings page for password management

## Quick Start

### Prerequisites

- Node.js 18+ installed

### Setup

```bash
# 1. Install dependencies
npm install

# 2. Set up database and seed sample data
npm run setup

# 3. Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and login:

| Field    | Value      |
|----------|------------|
| Username | `admin`    |
| Password | `admin123` |

> ⚠️ Change the password from Settings after first login.

## Project Structure

```
├── prisma/
│   ├── schema.prisma        # Database schema
│   └── seed.ts               # Sample data seeder
├── src/
│   ├── app/
│   │   ├── globals.css        # Design system & styles
│   │   ├── layout.tsx         # Root layout
│   │   ├── login/             # Login page
│   │   ├── (dashboard)/       # Auth-protected pages
│   │   │   ├── page.tsx       # Dashboard
│   │   │   ├── projects/      # Projects list + detail
│   │   │   ├── reports/       # Reports
│   │   │   └── settings/      # Settings
│   │   └── actions/           # Server actions
│   ├── components/            # Reusable UI components
│   ├── lib/                   # Prisma client, auth, invoice
│   └── middleware.ts          # Route protection
├── .env                       # Environment variables
└── package.json
```

## Environment Variables

| Variable      | Description                  | Default                                            |
|---------------|------------------------------|----------------------------------------------------|
| `DATABASE_URL` | SQLite database file path   | `file:./dev.db`                                    |
| `JWT_SECRET`   | JWT signing secret          | `amarnath-pest-solutions-jwt-secret-change-in-production` |

## Scripts

| Command         | Description                              |
|-----------------|------------------------------------------|
| `npm run dev`   | Start development server                 |
| `npm run build` | Build for production                     |
| `npm run start` | Start production server                  |
| `npm run setup` | Initialize database + seed sample data   |
