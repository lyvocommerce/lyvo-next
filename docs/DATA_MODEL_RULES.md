DATA_MODEL_RULES.md

This document defines strict rules for the data model of the platform.
All agents must follow these rules when creating, modifying, or interacting with data structures.

Data consistency and normalization are mandatory for scalability.

⸻

1. Core Entity Separation

The platform must maintain clear separation between core entities.

Mandatory entities:
	•	Merchant
	•	Product
	•	Offer
	•	Category
	•	Attribute (Facets)

Rules:
	•	Product represents the static identity of an item.
	•	Offer represents dynamic data (price, availability, currency, shipping).
	•	Merchant represents the external store source.
	•	Category represents internal taxonomy only.
	•	Attributes must be normalized and filterable.

Product and Offer must never be merged into a single uncontrolled structure.

⸻

2. Source of Truth Principle

The internal database is the single source of truth for all catalog operations.

Rules:
	•	No UI component may rely on raw external merchant payloads.
	•	All external data must be transformed before persistence.
	•	Every product must have a stable internal ID.
	•	Assistant responses must reference internal IDs.

⸻

3. Normalization Requirements

All merchant data must pass through normalization before storage.

Normalization includes:
	•	Category mapping to internal taxonomy.
	•	Attribute mapping to predefined attribute keys.
	•	Currency standardization.
	•	Text cleaning and formatting.

No raw, unmapped merchant fields may be exposed directly to the UI.

⸻

4. Schema Evolution Control

Changes to the data model must follow controlled evolution.

Rules:
	•	No direct schema edits without migration files.
	•	No destructive changes without backward compatibility review.
	•	New fields must not break existing API contracts.
	•	Deprecated fields must be documented before removal.

All schema changes require Architect approval.

⸻

5. Search Compatibility

The data model must support both structured and semantic search.

Rules:
	•	Structured fields must remain queryable (indexed when needed).
	•	Text fields must support semantic indexing.
	•	Ranking-related signals must be stored separately from core product identity.

The data layer must not embed ranking logic.

⸻

6. Integrity Constraints
	•	No duplicate internal product IDs.
	•	Merchant-specific identifiers must be stored separately.
	•	Offer updates must not mutate Product identity fields.
	•	Soft deletion preferred over hard deletion for catalog records.

⸻

7. AI Interaction Rules
	•	Assistant must never modify product data.
	•	Assistant may only read from Search & Ranking outputs.
	•	AI-generated metadata must not overwrite normalized fields without validation.

⸻

These rules are mandatory.
If a change violates normalization or entity separation, execution must stop immediately.