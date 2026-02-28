# AGENTS.md

## Cursor Cloud specific instructions

### Overview

LyvoShop is a Next.js 16 (App Router) Telegram Mini App — an e-commerce catalog for clothes and shoes. Tech stack: TypeScript, React 19, Tailwind CSS 3, Prisma 5, PostgreSQL (Neon), Framer Motion.

### Running the app

- **Dev server:** `pnpm dev` (port 3000)
- **Telegram test mode:** Append `?testMode=true` to any URL, or set `NEXT_PUBLIC_TELEGRAM_TEST_MODE=true` in `.env.local`. This bypasses Telegram authentication with mock user data.
- **Database:** The `DATABASE_URL` environment secret points to a remote Neon PostgreSQL instance. Prisma reads this from the shell environment (not `.env.local`). Use `npx prisma db push` to sync schema and `pnpm prisma:seed` to populate categories.
- **Admin panel:** Set `ADMIN_PASSWORD` in `.env.local` to protect `/admin`. Unauthenticated visits to `/admin` or `/admin/*` redirect to `/admin/login`. See `.env.example` for the variable.

### Key scripts (see `package.json`)

| Command | Purpose |
|---|---|
| `pnpm dev` | Start dev server |
| `pnpm build` | Production build |
| `pnpm lint` | ESLint (see caveat below) |
| `pnpm prisma:seed` | Seed categories into DB |
| `npx prisma db push` | Push schema to DB |
| `npx prisma studio` | Visual DB editor |
| `npx tsc --noEmit` | TypeScript type check |

### Known issues

- **ESLint:** The repo has `.eslintrc.json` (legacy format) but depends on ESLint 9 + `eslint-config-next` 16, which require flat config (`eslint.config.mjs`). `pnpm lint` (`next lint`) was removed in Next.js 16. Use `npx tsc --noEmit` for type checking instead. If ESLint is needed, the config must be migrated to flat config format.

### PostgreSQL

A `DATABASE_URL` environment secret is pre-configured pointing to a Neon PostgreSQL database. If it ever becomes unavailable, you can set up a local PostgreSQL:

```bash
sudo pg_ctlcluster 16 main start
sudo -u postgres psql -c "CREATE USER lyvodev WITH PASSWORD 'lyvodev' CREATEDB;"
sudo -u postgres psql -c "CREATE DATABASE lyvoshop OWNER lyvodev;"
export DATABASE_URL="postgresql://lyvodev:lyvodev@localhost:5432/lyvoshop"
npx prisma db push
pnpm prisma:seed
```

### Products data

Product data is fetched client-side from the external FakeStore API (`https://fakestoreapi.com/products`). No local setup needed, but internet access is required.
