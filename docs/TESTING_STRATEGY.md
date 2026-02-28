TESTING_STRATEGY.md

This document defines mandatory testing standards for the project.
All agents must follow this strategy when implementing or modifying functionality.

Testing is not optional. Code without verification is incomplete.

⸻

1. Testing Philosophy

The goal of testing is to ensure:
	•	Architectural stability
	•	Behavioral correctness
	•	Safe refactoring
	•	Long-term scalability

Tests must validate behavior and business rules, not internal implementation details.

⸻

2. Test Categories

Unit Tests

Required when:
	•	Adding or modifying business logic
	•	Implementing search or ranking rules
	•	Creating data transformation logic
	•	Writing validation logic

Unit tests must:
	•	Be deterministic
	•	Cover edge cases
	•	Avoid network calls
	•	Avoid database calls when possible (use mocks if needed)

⸻

Integration Tests

Required when:
	•	Creating new API routes
	•	Modifying API contracts
	•	Implementing ingestion logic
	•	Connecting multiple layers (API → Service → Data)

Integration tests must:
	•	Validate request/response shape
	•	Validate input validation
	•	Validate error handling

⸻

Regression Tests

Required when:
	•	Fixing bugs
	•	Refactoring critical logic

A bug fix without a regression test is considered incomplete.

⸻

3. Mandatory Verification Before Completion

Before marking a task as complete, the following must pass:
	•	TypeScript typecheck
	•	Lint
	•	All tests

If any of these fail, execution must stop.

⸻

4. Data Model Changes

If the schema is modified:
	•	A migration file must be created
	•	Migration must be tested
	•	Backward compatibility must be considered
	•	Related tests must be updated

No schema changes without verification.

⸻

5. Assistant-Specific Testing

When modifying Assistant logic:
	•	Validate that recommendations reference valid product IDs
	•	Validate that no synthetic products are generated
	•	Validate ranking consistency
	•	Validate handling of empty results

Assistant must operate only on catalog data.

⸻

6. Test Coverage Expectations
	•	Core domain logic must always be tested
	•	API surface must always be tested
	•	UI-only cosmetic changes do not require heavy test coverage

Coverage is not a vanity metric. Behavioral correctness is the priority.

⸻

7. Stop Conditions

Execution must stop if:
	•	New logic is added without tests
	•	API routes are added without integration tests
	•	Type errors are ignored
	•	Lint rules are bypassed

Testing discipline overrides development speed.

⸻

These rules are mandatory and enforced by the Reviewer Agent.