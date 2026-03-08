# LyvoShop Telegram Web App

Next.js application that runs as a Telegram Mini App with catalog, categories, search, and an admin panel. Deployed on Vercel; database on Neon (PostgreSQL).

## Features

- Telegram Web App SDK and initData validation
- Automatic light/dark theme from Telegram
- Category tree (levels 1–3) with navigation and category pages
- Product catalog (from admin-ingested JSON), product detail page (PDP)
- Full-text search with EN/FI dictionary
- Admin panel: login, merchants, catalog upload/ingest, allowed image hosts, search dictionary
- Product images via proxy (`/api/image`) with allowlist
- TypeScript, responsive UI for Telegram

## Tech Stack

- **Next.js 16** (App Router)
- **React 19**
- **Prisma** + **Neon** (PostgreSQL)
- **Tailwind CSS**, **Framer Motion**, **@twa-dev/sdk**
- **@hugeicons** for icons

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Environment variables:**
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` and set:
   - **`DATABASE_URL`** — PostgreSQL connection string (required for Prisma; Neon recommended).
   - **`TELEGRAM_BOT_TOKEN`** or **`TELEGRAM_BOT_SECRET`** — Bot token from [@BotFather](https://t.me/BotFather); used to validate Telegram Web App `initData`. Do not expose in client code.
   - **`ADMIN_PASSWORD`** — Password for `/admin` and `/api/admin/*` (login at `/admin/login`).

3. **Database:**
   ```bash
   npx prisma generate
   npx prisma migrate deploy
   npm run prisma:seed
   ```

4. **Run dev server:**
   ```bash
   npm run dev
   ```

5. **Production build:**
   ```bash
   npm run build
   npm start
   ```

## Telegram Bot Setup

1. Create a bot with [@BotFather](https://t.me/BotFather) and get the token.
2. Configure the Web App (e.g. `/newapp` in BotFather): set the Web App URL to your deployed app (or use [ngrok](https://ngrok.com/) for local testing).

## Authentication & Validation

- Telegram: server validates `initData` using the bot token (HMAC-SHA256). Validation runs in `/api/auth/telegram`.
- Admin: session-based login at `/admin/login`; `ADMIN_PASSWORD` must be set for production. All `/api/admin/*` routes require an authenticated admin session.

## Project Structure (overview)

```
├── app/
│   ├── api/
│   │   ├── auth/telegram/     # Telegram initData validation
│   │   ├── admin/             # Admin APIs (auth, merchants, ingest, image hosts, search-dictionary)
│   │   ├── catalog/products/   # Product list & by-id
│   │   ├── search/             # Full-text search
│   │   └── image/              # Image proxy (allowlist)
│   ├── admin/                  # Admin UI (login, dashboard)
│   ├── category/[slug]/        # Category page & products list
│   ├── product/[id]/           # Product detail page
│   ├── search/                 # Search page
│   ├── layout.tsx              # Root layout, categories load, providers
│   ├── page.tsx                # Home (landing)
│   └── globals.css
├── components/                 # UI (layout, design, pages)
├── contexts/                   # Categories, Products, Telegram, SideMenu
├── lib/                        # categories, catalog, Prisma, auth, image allowlist, search
├── prisma/
│   ├── schema.prisma           # Category, products, merchants, AllowedImageHost, search concepts
│   └── seed.ts                 # Categories + optional data
├── scripts/                    # Search dictionary generate/import
└── docs/                       # Architecture and guides
```

See **CATEGORIES_GUIDE.md** for categories usage and **lib/search-dictionary/README.md** for the search dictionary. **docs/CATEGORY_IMAGES_ARCHITECTURE.md** describes a plan for category image uploads.

## Scripts

| Command | Description |
|--------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run prisma:seed` | Seed DB (categories etc.) |
| `npm run search-dictionary:generate` | Generate search dictionary JSON |
| `npm run search-dictionary:import` | Import dictionary into DB |
| `npm run search-dictionary:refresh` | Generate + import |

## Security

- Validate Telegram `initData` on the server in production.
- Never expose the bot token or admin password in client code.
- Keep secrets in environment variables (e.g. Vercel env for production).
