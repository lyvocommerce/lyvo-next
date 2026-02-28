ARCHITECTURE_ENFORCEMENT.md

This document defines non-negotiable architectural constraints.
All agents must comply strictly.
Violations must stop execution immediately.

⸻

1. Layer Boundaries

The system is strictly layered:

UI Layer → API Layer → Domain Logic Layer → Data Layer

The following are forbidden:
	•	UI directly accessing the database.
	•	UI calling external merchant APIs.
	•	Business logic inside React components.
	•	Assistant accessing database directly.
	•	External data entering the system without normalization.

All communication between layers must occur through defined internal APIs.

⸻

2. Catalog as Source of Truth

The internal catalog database is the single source of truth.

Rules:
	•	All products must exist in the database before being exposed to UI.
	•	No product may be rendered without internal ID.
	•	Assistant must operate only on stored catalog entities.
	•	Raw merchant payloads must never be exposed to UI.

⸻

3. Data Integrity Constraints
	•	Product and Offer must remain separate entities.
	•	Merchant abstraction is mandatory.
	•	No dynamic schema changes without migration.
	•	No breaking schema changes without versioning consideration.

All data transformations must occur inside the Ingestion Layer.

⸻

4. API Discipline
	•	All UI data fetching must go through internal API routes.
	•	No direct external fetch in client components.
	•	All API endpoints must validate input.
	•	All outbound redirects must be tracked before execution.

⸻

5. Assistant Constraints
	•	Assistant may not invent products.
	•	Assistant may not generate synthetic catalog entries.
	•	Assistant must reference real database IDs.
	•	Assistant must retrieve candidates via Search & Ranking layer only.

⸻

6. Scalability Guardrails
	•	All listing endpoints must support pagination.
	•	Filtering must occur server-side.
	•	Ranking logic must not live in UI.
	•	Large dataset operations must not execute in client memory.

⸻

7. Change Control

Any modification affecting:
	•	Data model
	•	Layer interaction
	•	API contracts
	•	Search logic

Requires Architect approval before implementation.

⸻

These rules are mandatory.
If conflict arises between speed and structure, structure prevails.