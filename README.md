# ApplyFlow 🎯

> **A high-velocity, personal job application tracker** designed to manage job searches, track interviews across multi-round hiring loops, automate follow-up reminders via email, store resume versions, and export application backups.

Built with **Next.js 16 (App Router)**, **React 19**, **PostgreSQL (Neon)**, **Prisma v7**, **NextAuth.js v5 (GitHub OAuth)**, **Tailwind CSS v4**, **Vercel Blob**, and **Resend**.

---

## ✨ Features

- **📊 Application Pipeline & Metrics Dashboard:**
  - Track jobs across stages: `Wishlist`, `Applied`, `Assessment`, `Interview`, `Offer`, `Rejected`, and `Withdrawn`.
  - Real-time pipeline health overview: active applications count, interview conversion rates, and pending follow-ups.
  - Server-driven URL search, filter tags, and pagination.

- **🗓️ Multi-Round Interview Calendar (`/calendar`):**
  - Interactive 7-column monthly calendar grid built with native Tailwind and `date-fns`.
  - Multi-round scheduling: Technical screens, System Design, Coding Challenges, and Cultural fits.
  - Automatic application stage progression when scheduling upcoming interviews.

- **⏰ Automated Follow-Up Reminders (`/follow-ups`):**
  - Urgency calculation engine (`Overdue by X days`, `Due Today`, `Due Tomorrow`, `Due in X days`).
  - Quick snooze options (`+3 days`, `+1 week`, `+2 weeks`) and 1-click recruiter `mailto:` links.
  - Automated cron worker (`/api/cron/reminders`) triggered via **Vercel Cron** and dispatched with **Resend**.

- **📄 Resume Library & Version Management (`/resumes`):**
  - Multi-file format support: upload PDF and DOCX resumes (up to 10 MB).
  - Stored via **Vercel Blob** with graceful local filesystem fallback for development.
  - Link specific resume versions directly to individual job applications.

- **📥 1-Click RFC 4180 CSV Export (`/api/applications/export`):**
  - Export complete application history with safe quotation and comma escaping for Google Sheets or Microsoft Excel.

- **🌓 System Dark / Light Mode:**
  - Zero-FOUC theme switching powered by `next-themes` and Tailwind CSS v4 design tokens.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | [Next.js 16 (App Router)](https://nextjs.org/) with React 19 & Server Actions |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) with PostCSS & CSS-first theme tokens |
| **Database** | [PostgreSQL (Neon serverless)](https://neon.tech/) with connection pooling |
| **ORM** | [Prisma v7](https://www.prisma.io/) with `@prisma/adapter-pg` driver adapter |
| **Auth** | [NextAuth.js v5 Beta](https://authjs.dev/) with GitHub OAuth provider |
| **File Storage** | [Vercel Blob](https://vercel.com/docs/storage/vercel-blob) (`@vercel/blob`) + Local fallback |
| **Email Service** | [Resend](https://resend.com/) with automated cron trigger (`/api/cron/reminders`) |
| **Testing** | Node.js native test runner (`node --test`) with type stripping |

---

## 🏗️ Architecture & Data Model

```mermaid
flowchart TD
    User["User (Candidate)"]
    OAuth["GitHub OAuth (NextAuth v5)"]
    Next["Next.js App Router (Vercel)"]
    DB[("PostgreSQL (Neon)")]
    Blob["Vercel Blob (Resumes)"]
    Resend["Resend (Email Gateway)"]
    Cron["Vercel Cron Worker"]

    User -->|"Signs in via"| OAuth
    OAuth -->|"Issues encrypted session"| Next
    Next -->|"Queries & Mutations (Prisma)"| DB
    Next -->|"Uploads & Downloads"| Blob
    Cron -->|"GET /api/cron/reminders"| Next
    Next -->|"Dispatches reminder email"| Resend
    Resend -->|"Sends email alert"| User
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js** >= 20.x
- **npm** or **pnpm**
- A free **PostgreSQL** database (e.g. [Neon](https://neon.tech) or [Supabase](https://supabase.com))
- A **GitHub OAuth Application** (create at [GitHub Developer Settings](https://github.com/settings/developers))

### 2. Clone and Install
```bash
git clone https://github.com/JITs10/ApplyFlow.git
cd ApplyFlow
npm install
```

### 3. Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Fill in your configuration:
```env
# Database
DATABASE_URL="postgresql://user:password@host/applyflow?sslmode=require"

# NextAuth v5
AUTH_SECRET="generate-with-npx-auth-secret"
AUTH_URL="http://localhost:3000"

# GitHub OAuth
AUTH_GITHUB_ID="your-github-client-id"
AUTH_GITHUB_SECRET="your-github-client-secret"

# Vercel Blob (Optional in local dev - falls back to /public/uploads/resumes/)
BLOB_READ_WRITE_TOKEN="vercel_blob_rw_..."

# Resend Email
RESEND_API_KEY="re_..."
RESEND_FROM_EMAIL="reminders@yourdomain.com"

# Cron Security
CRON_SECRET="your-secure-cron-secret"
```

### 4. Database Setup & Migrations
```bash
# Push schema to database
npx prisma db push

# (Or run Prisma migrations)
npx prisma migrate dev --name init
```

### 5. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Testing

ApplyFlow includes a zero-dependency test suite running on Node's native test runner (`node:test`):

```bash
npm test
```

Test coverage includes:
- **CSV Exporter (`tests/csv.test.ts`):** RFC 4180 double-quote escaping, separator formatting, and date handling.
- **Urgency Calculation Engine (`tests/urgency.test.ts`):** Due date diff calculations, overdue tier categorization, and label generation.
- **Validation Schemas (`tests/validation.test.ts`):** Zod boundaries for applications, interviews, and follow-up inputs.

---

## 🚢 Production Deployment (Vercel)

1. **Push to GitHub:** Push your repository to your GitHub account.
2. **Import into Vercel:** Connect the repository on [vercel.com](https://vercel.com).
3. **Environment Variables:** Add all variables from `.env.local` to the Vercel Project Settings:
   - `DATABASE_URL`
   - `AUTH_SECRET`
   - `AUTH_URL` (set to your production domain `https://your-domain.vercel.app`)
   - `AUTH_GITHUB_ID` & `AUTH_GITHUB_SECRET` (update your GitHub OAuth app's callback URL to `https://your-domain.vercel.app/api/auth/callback/github`)
   - `BLOB_READ_WRITE_TOKEN` (connect Vercel Blob from the Storage tab)
   - `RESEND_API_KEY` & `RESEND_FROM_EMAIL`
   - `CRON_SECRET`
4. **Vercel Cron:** `vercel.json` is pre-configured to trigger `/api/cron/reminders` every minute:
   ```json
   {
     "crons": [{ "path": "/api/cron/reminders", "schedule": "* * * * *" }]
   }
   ```
5. **Deploy:** Hit **Deploy**. Vercel will build and launch your application!

---

## 📄 License

MIT © [JITs10](https://github.com/JITs10)
