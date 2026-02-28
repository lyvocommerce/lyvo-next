CODING_RULES.md

This document defines strict implementation standards for all code written in this repository.
All agents must follow these rules without exception.

The goal is minimal, clean, testable, and scalable code.

⸻

1. Minimal Change Principle
	•	Prefer extension over rewrite.
	•	Prefer modification over recreation.
	•	Do not refactor unrelated code.
	•	Do not introduce large diffs without Architect approval.
	•	Avoid unnecessary abstraction.

If a solution can be implemented with fewer changes, it must be.

⸻

2. File and Function Size Constraints
	•	Functions should remain small and focused.
	•	Avoid long, multi-responsibility functions.
	•	Avoid large monolithic files.
	•	If logic grows beyond clarity, extract to service layer.

Business logic must not live inside UI components.

⸻

3. Dependency Control
	•	No new external dependencies without Architect approval.
	•	Avoid heavy libraries for simple tasks.
	•	Prefer native platform capabilities when possible.
	•	No hidden side-effect libraries.

Every dependency must have a clear purpose.

⸻

4. Layer Discipline in Code
	•	UI components must not contain business rules.
	•	API routes must not contain UI logic.
	•	Data access must be isolated from presentation layer.
	•	Search and ranking logic must not live in React components.

Violations must be corrected immediately.

⸻

5. Testing Requirement
	•	New business logic requires unit tests.
	•	New API endpoints require integration tests.
	•	Bug fixes require regression tests when applicable.
	•	Code without tests is incomplete.

Tests must verify behavior, not implementation details.

⸻

6. Type Safety and Linting
	•	All new code must be fully typed.
	•	Avoid use of “any” unless explicitly justified.
	•	No ignored TypeScript errors.
	•	Lint warnings must not be ignored.

Type safety is mandatory.

⸻

7. Naming and Clarity
	•	Use descriptive names.
	•	Avoid ambiguous variable names.
	•	No commented-out dead code.
	•	Remove unused imports.

Code must be readable without explanation.

⸻

8. Stop Conditions

Execution must stop immediately if:
	•	Architectural rules are violated.
	•	Layer boundaries are crossed.
	•	Data model rules are broken.
	•	Diff size becomes excessive.

The agent must request clarification instead of proceeding.

⸻

These rules exist to preserve long-term scalability and maintainability.
Speed is secondary to structural integrity and clarity.