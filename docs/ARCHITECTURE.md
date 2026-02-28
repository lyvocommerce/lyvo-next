1. System Purpose

The system is a scalable AI-powered catalog platform operating as a Telegram Mini App.
It aggregates products from multiple merchants, normalizes data, and provides structured and semantic search through an intelligent assistant.

The system must support growth from MVP to multi-merchant scale without architectural redesign.

⸻

2. Core Architectural Principle

The architecture is strictly layered.

UI → API → Domain Logic → Data Layer

No layer may bypass another.

The internal catalog database is the single source of truth.

The Assistant operates only on catalog data.

External merchant systems are data providers only and never part of runtime decision logic.

⸻

3. System Layers

3.1 UI Layer (Next.js)

Responsibilities:
	•	Render product listings
	•	Render product detail pages
	•	Render assistant interface
	•	Trigger internal API calls

Restrictions:
	•	No business logic
	•	No direct database access
	•	No external API calls
	•	No ranking logic

⸻

3.2 API Layer

Responsibilities:
	•	Expose internal endpoints
	•	Validate inputs
	•	Connect UI with domain services

Restrictions:
	•	No UI rendering
	•	No direct manipulation of presentation logic

⸻

3.3 Domain Logic Layer

Responsibilities:
	•	Catalog operations
	•	Search & filtering
	•	Ranking logic
	•	Assistant reasoning
	•	Ingestion normalization

Restrictions:
	•	No direct UI rendering
	•	No raw merchant payload exposure

⸻

3.4 Data Layer

Responsibilities:
	•	Store normalized entities
	•	Maintain integrity of Product, Offer, Merchant
	•	Support structured queries
	•	Support semantic indexing

Database: Postgres (Neon)

Restrictions:
	•	No business logic
	•	No UI dependencies

⸻

4. Core Domain Entities

The platform must maintain strict entity separation:
	•	Merchant
	•	Product (static identity)
	•	Offer (dynamic data: price, availability)
	•	Category (internal taxonomy)
	•	Attribute (facets)

Product identity must remain stable.
Offer updates must not mutate product identity.

⸻

5. Data Flow

Merchant Feed
→ Ingestion
→ Normalization
→ Database
→ Catalog API
→ Search & Ranking
→ Assistant
→ UI
→ Outbound Redirect (tracked)

No external merchant API calls are allowed during user interaction.

⸻

6. Assistant Constraints

The Assistant:
	•	Must not invent products
	•	Must not generate synthetic catalog entries
	•	Must reference internal product IDs
	•	Must retrieve candidates via Search & Ranking layer only

The Assistant enhances selection, not data creation.

⸻

7. Scalability Requirements
	•	All listings must support pagination
	•	Filtering must occur server-side
	•	Ranking must be isolated
	•	Dataset growth must not impact UI performance
	•	Schema evolution must be controlled

⸻

8. Architectural Authority

This document defines the target architecture.

If implementation conflicts with this document,
the implementation must change.

Architecture takes priority over delivery speed.