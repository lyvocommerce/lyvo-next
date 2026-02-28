# ARCHITECTURE GAP ANALYSIS

## Summary

- Target: a strictly layered, server-driven catalog platform where UI ⇢ API ⇢ Domain Logic ⇢ Data, with the internal catalog DB as single source of truth and the Assistant operating only on catalog data.
- Implementation (observed): Next.js app with server-side category fetch but client-side product fetching, minimal API surface (auth validation), Prisma schema present but not used for product data in client runtime, and no Assistant runtime.

## Conformances (areas aligned with target)

- Framework and stack align: Next.js (App Router), TypeScript, Postgres + Prisma are present (target DB technology matches intent).
- Layered separation partially present: server-side category fetch exists (`app/layout.tsx` → `lib/categories.ts`) and Prisma client is encapsulated in `lib/prisma.ts` (data-access layer exists).
- Authentication validation implemented as an API route (`app/api/auth/telegram/route.ts`) that delegates to `lib/telegram-auth.ts` (API layer for auth concerns).

## Major Gaps (by target section)

### 1) UI Layer vs Target
- Target restriction: UI must perform no business logic, no direct DB access, no external API calls, no ranking logic.
- Implementation: `contexts/Products/ProductsProvider.tsx` performs client-side fetching from an external product API (`https://fakestoreapi.com/products`) during user interaction — a direct violation of “No external API calls” and of keeping data retrieval in UI layer.
- Implementation: Product-related lookup (`getProductById`) and product list state live in a client context — business/data retrieval logic exists in UI runtime rather than behind internal APIs.

### 2) API Layer vs Target
- Target expects internal API endpoints for catalog, search, filtering, and validation.
- Implementation: Only server API route observed is auth validation (`/api/auth/telegram`). No internal catalog API endpoints (listings, search, pagination, ranking) are present in the codebase.

### 3) Domain Logic Layer vs Target
- Target requires server-side catalog operations, search & ranking, assistant reasoning, ingestion normalization.
- Implementation: No server-side search, ranking, ingestion normalization, or assistant code detected. Category tree building exists in `lib/categories.ts` but search/ranking/filtering are implemented (or expected) client-side or missing entirely.

### 4) Data Layer vs Target
- Target: normalized entities (Merchant, Product, Offer, Category, Attribute); DB is single source of truth; no business logic in DB layer.
- Implementation: `prisma/schema.prisma` defines `Category`, `merchants`, and `products` models — schema exists, but the runtime product data used by the UI is fetched from an external API, not the internal DB. There is no clear Offer entity, nor attributes/facets modeling required by the target.

## Catalog & Data Flow Gaps
- Target flow: Merchant Feed → Ingestion → Normalization → Database → Catalog API → Search & Ranking → Assistant → UI; no external merchant API calls during user interaction.
- Implementation flow (observed): UI client fetches external product API at runtime, bypassing ingestion/normalization/database/catalog API steps. This directly contradicts the target “no external merchant API calls during user interaction” and “DB is single source of truth.”

## Assistant Constraints
- Target: Assistant operates only on catalog data, references internal IDs, retrieves candidates via Search & Ranking.
- Implementation: No Assistant runtime, no assistant code, and no Search & Ranking layer to support Assistant constraints. Assistant-related requirements are not implemented (absent).

## Scalability & Operational Gaps
- Target requires server-side pagination, server-side filtering, isolated ranking, and controlled schema evolution.
- Implementation: Product list fetched client-side with no server-side pagination/filtering observed. Ranking and server-side filtering are not present. These gaps violate scalability requirements (pagination/filtering and isolated ranking are missing).

## Layer Violations (explicit)
- UI layer performs external network I/O to retrieve product data (violation of UI-layer restrictions).
- Data retrieval responsibilities are not isolated to the API or Domain layers (client-side data fetching instead).

## Technical Debt & Risk Indicators (observed in implementation)
- `lib/telegram-auth.ts` returns `true` when bot token env var is missing (validation bypass) — risk of silent misconfiguration between dev and production.
- Multiple env var names used for the same secret (`TELEGRAM_BOT_SECRET`, `NEXT_PUBLIC_TELEGRAM_BOT_TOKEN`, `TELEGRAM_BOT_TOKEN`) — potential config drift.
- External placeholder product source (`fakestoreapi.com`) in `ProductsProvider` indicates non-production data flow and an incomplete ingestion/canonicalization pipeline.
- Missing Offer and Attribute entities in runtime usage (schema may not fully match target entity model expectations for offers/attributes).

## Unknowns (not derivable from code scan)
- Whether ingestion pipelines or background jobs exist outside this repository to populate Prisma DB (no evidence in repo).
- Deployment architecture (infrastructure, connection pooling config, caching layers) is not present in repo.
- Any hidden serverless functions or separate services providing catalog APIs (not present in this codebase).

## Conclusion (concise)
- The codebase contains foundational elements (Next.js, TypeScript, Prisma schema) aligning with the target platform, but the current runtime deviates significantly from the target layered architecture: product data is fetched client-side from an external API, there is no internal catalog API, no server-side search/ranking or ingestion/normalization pipeline, and no Assistant runtime. These constitute direct gaps against the stated architecture requirements (layering, single source of truth, assistant constraints, and scalability requirements).

*This report describes observed differences only; no code modifications were made.*
 