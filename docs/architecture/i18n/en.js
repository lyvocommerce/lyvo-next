/** LyvoShop Architecture doc — English. Add to window.ARCH_I18N in index.html when adding languages. */
window.ARCH_I18N_EN = {
  meta: {
    title: "System Architecture & App Walkthrough",
    subtitle: "High-level, visual description of how the LyvoShop Telegram Mini App works: layers, data flow, pages, and responsibilities of each part of the system.",
    badge: "LyvoShop — Architecture Map",
    langLabel: "Language",
    tocTitle: "Contents"
  },
  nav: {
    purpose: "System purpose",
    layers: "Layers",
    routes: "App pages",
    catalogFlow: "Catalog flow",
    telegramFlow: "Telegram journey",
    merchantFlow: "Merchants",
    glossary: "Glossary",
    agents: "Agents",
    databaseStores: "Database & stores"
  },
  toc: {
    purpose: "System purpose",
    layers: "Layered architecture",
    routes: "App pages & flows",
    catalogFlow: "Catalog & data flow",
    telegramFlow: "Telegram Mini App journey",
    merchantFlow: "Merchant responsibilities",
    glossary: "Glossary",
    agents: "Agents",
    databaseStores: "Database & connecting stores"
  },
  sections: {
    purpose: {
      id: "purpose",
      title: "1. System purpose",
      tagline: "LyvoShop is a Telegram Mini App storefront backed by a multi-merchant product catalog in Postgres (Neon) with a strict layered architecture.",
      paragraphs: [
        "The platform aggregates products from multiple merchants, stores them in a normalized internal catalog, and exposes them through a Telegram Web App UI and internal APIs, with an Assistant operating only on catalog data."
      ],
      pills: ["Next.js 16 (App Router)", "Telegram Web App", "TypeScript", "Prisma + Neon Postgres", "Layered architecture"]
    },
    layers: {
      id: "layers",
      title: "2. Layered architecture (visual)",
      paragraphs: ["The system follows a strict separation of concerns. Every request and interaction flows through four layers; no layer may bypass another."],
      diagramTitle: "Logical stack",
      diagram: "UI (Next.js pages & components)\n        │\n        ▼\nAPI Layer (internal API routes)\n        │\n        ▼\nDomain Logic (catalog, search, ingestion, assistant)\n        │\n        ▼\nData Layer (Neon Postgres via Prisma)",
      cards: [
        {
          title: "UI Layer (Next.js / Telegram Web App)",
          description: "Renders pages and components (app/page.tsx, app/category/[slug]/page.tsx, app/product/[id]/page.tsx, app/user/page.tsx, app/admin/page.tsx and components/pages/*).",
          listItems: ["Displays catalog listings and product details.", "Hosts the Telegram Web App experience.", "Triggers calls to internal APIs only."],
          warning: "UI must not contain business rules, call external merchant APIs, or talk to the database directly."
        },
        {
          title: "API Layer",
          description: "A thin interface between UI and core services. Validates input, enforces contracts, and calls domain services.",
          listItems: ["Example: Telegram auth route at app/api/auth/telegram/route.ts.", "All UI data fetching must go through internal APIs.", "No UI rendering or presentation logic here."]
        },
        {
          title: "Domain Logic Layer",
          description: "Encapsulates catalog operations, search and filtering, ranking, ingestion and normalization, and assistant reasoning.",
          listItems: ["Transforms raw merchant data into normalized entities.", "Implements search and ranking rules.", "Ensures assistant always works on stored catalog data."]
        },
        {
          title: "Data Layer (Neon Postgres)",
          description: "Stores normalized entities and exposes them via Prisma. The internal catalog database is the single source of truth.",
          listItems: ["Core entities: Merchant, Product, Offer, Category, Attribute.", "No business logic or UI dependencies.", "Supports structured and semantic search indexing."]
        }
      ]
    },
    routes: {
      id: "routes",
      title: "3. App pages & flows (site walk)",
      paragraphs: ["The Next.js App Router structure defines the main user-facing flows inside the Telegram Mini App and related views."],
      diagramTitle: "Route map (high-level)",
      diagram: "Telegram Mini App (webview)\n└── \"/\"                → Home / Landing (app/page.tsx → LandingPage)\n    ├── \"/category/[slug]\"  → Category tree view\n    ├── \"/product/[id]\"     → Product detail view\n    ├── \"/user\"             → User profile / account\n    └── \"/admin\"            → Admin / internal controls",
      cards: [
        {
          title: "Home / Landing (\"/\")",
          description: "Entry point for the Telegram Web App. Composed by app/page.tsx and the LandingPage component under components/pages.",
          listItems: ["Initial view after Telegram opens the web app.", "Shows featured categories and/or products.", "Provides navigation into the catalog."]
        },
        {
          title: "Category pages (\"/category/[slug]\")",
          description: "Server component at app/category/[slug]/page.tsx uses lib/categories.ts to resolve the category and its immediate children.",
          listItems: ["Displays category name and description.", "Lists subcategories with Telegram-themed cards and navigation.", "Acts as a tree browser for the internal taxonomy."]
        },
        {
          title: "Product pages (\"/product/[id]\")",
          description: "Route app/product/[id]/page.tsx renders a dedicated ProductDetailPage component.",
          listItems: ["Shows product title, description, images, and price.", "May surface merchant and offer-specific information.", "Key bridge to outbound redirect to the merchant store."]
        },
        {
          title: "User & Admin views (\"/user\", \"/admin\")",
          description: "Additional pages (UserPage and AdminPage) for user info and internal controls.",
          listItems: ["User page: personal info, preferences, or history.", "Admin page: operational controls, monitoring, tools."]
        }
      ]
    },
    catalogFlow: {
      id: "catalog-flow",
      title: "4. Catalog & data flow",
      paragraphs: ["Merchants own and manage their product data in their own systems. LyvoShop ingests, normalizes, and stores that data in Neon's internal catalog before anything reaches the Mini App UI."],
      diagramTitle: "End-to-end catalog pipeline",
      diagram: "Merchant Systems\n    (Shopify, custom CMS, feeds, files)\n        │  merchant-controlled prices, names, descriptions\n        ▼\nIngestion\n    • Fetch or receive merchant feeds\n    • Parse files / APIs / webhooks\n        ▼\nNormalization\n    • Map merchant fields → Product / Offer / Category / Attribute\n    • Clean and standardize text, currency, attributes\n        ▼\nInternal Catalog Database (Neon Postgres)\n    • Single source of truth for all catalog operations\n        ▼\nCatalog API & Search / Ranking\n    • Structured queries & semantic search\n        ▼\nAssistant & Telegram Mini App UI\n    • Read-only views over normalized catalog data",
      muted: "External merchant payloads are never exposed directly to the UI. Every product rendered in the Mini App must exist in the internal catalog with a stable internal ID."
    },
    telegramFlow: {
      id: "telegram-flow",
      title: "5. Telegram Mini App journey",
      paragraphs: ["From a user perspective, the Telegram Mini App is a guided storefront sitting on top of the catalog. It uses Telegram authentication and theme integration to feel native."],
      diagramTitle: "User journey (simplified)",
      diagram: "User opens bot in Telegram\n        │\n        ▼\nBot sends a Web App button\n        │\n        ▼\nTelegram opens LyvoShop Mini App (webview)\n        │\n        ▼\nUI bootstraps\n    • Reads Telegram initData via Web App SDK\n    • Applies Telegram theme (colors, dark/light)\n    • Validates initData via internal auth API route\n        │\n        ▼\nHome / Landing\n    • Shows entry points into catalog\n        │\n        ▼\nBrowse categories → view products → open product detail\n        │\n        ▼\nWhen ready, user taps \"Go to store\" (outbound redirect)\n    • Redirect is recorded by internal logic\n    • User lands on the merchant's external site to complete purchase",
      paragraphsAfter: ["Throughout this flow, the user never talks directly to merchant systems from the client. All catalog interactions are served from the internal Neon database via internal APIs and domain logic."]
    },
    merchantFlow: {
      id: "merchant-flow",
      title: "6. Merchant responsibilities & control",
      paragraphs: ["Merchants fully control the content and pricing of their products in their own systems. LyvoShop controls how this data is ingested, normalized, searched, and presented inside the Mini App."],
      cards: [
        {
          title: "What merchants own",
          listItems: ["Product names, descriptions, images.", "Prices, currencies, availability.", "Merchant-side categories and tags.", "Any updates and corrections to their catalog."],
          muted: "Merchants make changes in their own platforms. LyvoShop pulls those changes through feeds or integrations."
        },
        {
          title: "What LyvoShop owns",
          listItems: ["Internal taxonomy and attribute model.", "Normalization and mapping from merchant data.", "Search, ranking, and Assistant behavior.", "Telegram Mini App UI and user journey."]
        },
        {
          title: "How data moves between them",
          listItems: ["Merchants export or expose their catalog (files, feeds, APIs).", "LyvoShop ingestion jobs pull or receive those exports and normalize them.", "Normalized products and offers are stored in Neon and used by all user-facing surfaces."]
        }
      ]
    },
    databaseStores: {
      id: "database-stores",
      title: "7. Database and connecting new stores",
      tagline: "How the internal catalog database (Neon Postgres) is structured and used so new merchant stores can be connected and their products served in the Mini App.",
      paragraphs: [
        "The internal catalog is the single source of truth. All product data shown in the Mini App must come from this database after ingestion and normalization. Merchants are configured by connection type and type-specific parameters (not a single URL): the dashboard supports any connection type through settings; adding a new type is one new option in the list plus one branch in ingestion."
      ],
      diagramTitle: "Connecting a new store (target flow)",
      diagram: "Dashboard / Admin\n    • Create or edit merchant (id, name, logo_url, country, home_url, connection_type, connection_params)\n        │\n        ▼\nMerchant record in DB (merchants)\n        │\n        ▼\nIngestion (Domain)\n    • Load catalog for merchant → branch by connection_type\n    • url: fetch(connection_params.feedUrl) → parse → normalize\n    • file / shopify: (coming soon) same step, different branch\n        │\n        ▼\nWrite to DB (products, categories)\n    • products.merchant_id → merchants.id\n        │\n        ▼\nCatalog API reads from DB → UI shows only internal catalog data",
      cards: [
        {
          title: "Tables used for stores and catalog",
          description: "Prisma schema (prisma/schema.prisma) defines the data layer.",
          listItems: [
            "merchants — one row per connected store: id, name, logo_url, country, home_url, connection_type, connection_params (JSON). connection_type e.g. \"url\", \"file\", \"shopify\"; params e.g. { \"feedUrl\": \"...\" } for url.",
            "products — normalized products: id, title, description, url, image_url, price_min, price_max, currency, merchant_id (FK to merchants), category, lang. All products must have merchant_id.",
            "categories — internal taxonomy (tree). Shared; products may reference category. Filled via seed or ingestion."
          ],
          muted: "Database URL is in DATABASE_URL (Neon). Use npx prisma db push or migrations to keep schema in sync."
        },
        {
          title: "Connection types (dashboard and ingestion)",
          description: "One common step: load catalog for merchant. Domain branches by connection_type.",
          listItems: [
            "url (by link) — implemented: fetch feed from URL, parse (e.g. FakeStore, DummyJSON), normalize, write to DB.",
            "file — coming soon: read file, parse, normalize.",
            "shopify — on request: call Shopify API, map to internal model."
          ],
          muted: "New type = add option in dashboard type list + ingestion branch + settings form for that type. No per-merchant code."
        },
        {
          title: "How to connect a new store",
          description: "Operational flow so the database can serve the new store's products.",
          listItems: [
            "1. Register the merchant in the dashboard: set id, name, home_url, connection_type (e.g. url), connection_params (e.g. feedUrl).",
            "2. Run ingestion: trigger \"Load catalog\" for that merchant; domain fetches/parses by type and writes to products with merchant_id.",
            "3. Catalog API: internal API reads from products and merchants (pagination/filters). UI calls only this API; no direct DB or external merchant API from the client."
          ],
          warning: "UI must never call external merchant APIs or the database directly. All store data reaches the app via internal Catalog API from this database."
        }
      ]
    },
    agents: {
      id: "agents",
      title: "9. AI agents in this repository",
      tagline: "How Cursor (and other) AI agents are configured to work in LyvoShop and which documents they must follow.",
      paragraphs: [
        "Any AI agent operating in this repository (e.g. Cursor Composer/Agent) must follow a strict startup and execution protocol. Agents are given project context from the root AGENTS.md and behavioural rules from documents under /docs. Structural integrity and compliance take priority over speed or feature delivery."
      ],
      cards: [
        {
          title: "How agents work",
          description: "Before any analysis, code, or architectural change, the agent must complete the startup protocol.",
          listItems: [
            "Mandatory pre-execution: read ARCHITECTURE.md, ARCHITECTURE_ENFORCEMENT.md, DATA_MODEL_RULES.md, CODING_RULES.md, TESTING_STRATEGY.md, DEFINITION_OF_DONE.md, and AGENTS.md in full.",
            "Context validation: identify the layer for the change (UI / API / Domain / Data / Assistant), confirm no layer-boundary or data-model violations, and confirm testing requirements are understood.",
            "Plan requirement: produce a minimal implementation plan, estimate scope (small / medium / large), and confirm the change is minimal and compliant before starting implementation.",
            "Before completion: re-read DEFINITION_OF_DONE.md and verify architectural, testing, and rule compliance."
          ],
          muted: "If any required document is missing, the agent must stop and report. If uncertainty exists, the agent must stop and request clarification."
        },
        {
          title: "What agents listen to",
          description: "Documents that define agent behaviour and project context. These override conflicting instructions.",
          listItems: [
            "Root AGENTS.md — Cursor Cloud instructions: tech stack, how to run the app (pnpm dev), database, scripts, known issues (e.g. ESLint), and product data source (FakeStore API).",
            "docs/AGENT_STARTUP_RULE.md — mandatory startup procedure and execution hierarchy; defines forbidden behaviours (e.g. no large rewrites or new dependencies without approval).",
            "docs/AGENTS.md — role separation (Architect, Builder, Reviewer) and rule that no code may be written before reading relevant /docs, aligning with ARCHITECTURE.md, and defining a minimal plan.",
            "ARCHITECTURE.md, ARCHITECTURE_ENFORCEMENT.md, DATA_MODEL_RULES.md, CODING_RULES.md, TESTING_STRATEGY.md, DEFINITION_OF_DONE.md — layer boundaries, data model, coding and testing rules, and definition of done."
          ],
          warning: "Execution hierarchy: AGENT_STARTUP_RULE.md → ARCHITECTURE_ENFORCEMENT.md → DATA_MODEL_RULES.md → CODING_RULES.md → TESTING_STRATEGY.md → ARCHITECTURE.md. Correctness prevails over velocity."
        }
      ]
    },
    glossary: {
      id: "glossary",
      title: "8. Glossary (core concepts)",
      tagline: "Shared vocabulary for reasoning about the platform and its architecture.",
      items: [
        { term: "Merchant", definition: "an external store or brand that owns products and prices. Merchants remain the source of truth for their own catalog data." },
        { term: "Product", definition: "the stable identity of an item (e.g. \"Sneaker Model X\"). Product identity should not change when offers or prices change." },
        { term: "Offer", definition: "dynamic aspects such as price, currency, availability, and potentially shipping. Multiple offers can exist for the same product." },
        { term: "Category", definition: "part of the internal taxonomy that organizes products for browsing and discovery in the Mini App." },
        { term: "Attribute (Facet)", definition: "normalized searchable or filterable product properties (size, color, material, etc.)." },
        { term: "Assistant", definition: "an AI assistant that helps users navigate the catalog. It must only operate on stored catalog data and reference real internal product IDs." },
        { term: "Neon Postgres", definition: "the managed Postgres instance storing the internal catalog and related entities via Prisma." },
        { term: "Telegram Mini App", definition: "the webview UI opened from a Telegram bot, implemented with Next.js and integrated with the Telegram Web App SDK." }
      ]
    }
  }
};
