DEFINITION_OF_DONE.md

This document defines the mandatory criteria that must be satisfied before any task, feature, or change is considered complete.

No task may be marked as done unless all conditions below are fulfilled.

⸻

1. Architectural Compliance
	•	The implementation complies with ARCHITECTURE.md.
	•	No violations of ARCHITECTURE_ENFORCEMENT.md.
	•	Layer boundaries remain intact.
	•	No business logic exists inside UI components.

Architect must confirm that structural integrity is preserved.

⸻

2. Data Model Compliance
	•	Changes comply with DATA_MODEL_RULES.md.
	•	No uncontrolled schema modifications.
	•	Migrations are created when required.
	•	Internal IDs are preserved.
	•	No raw merchant payload exposed to UI.

If the data model is affected, it must be explicitly reviewed.

⸻

3. Code Quality Compliance
	•	All changes comply with CODING_RULES.md.
	•	No unnecessary refactoring.
	•	No excessive diff size.
	•	No unused imports or dead code.
	•	No “any” types without justification.

Builder must confirm minimal and clean implementation.

⸻

4. Testing Requirements
	•	Unit tests added for new business logic.
	•	Integration tests added for new or modified API routes.
	•	Regression tests added for bug fixes.
	•	All tests pass.
	•	Lint passes.
	•	TypeScript typecheck passes.

Reviewer must verify test execution.

⸻

5. Assistant Safety Requirements

If Assistant logic is modified:
	•	Recommendations reference valid internal product IDs.
	•	No synthetic catalog entries are generated.
	•	Empty-result scenarios are handled safely.
	•	Ranking logic remains isolated from UI.

⸻

6. Documentation Update
	•	Relevant documentation in /docs is updated if behavior changed.
	•	New architectural decisions are recorded when necessary.
	•	API contract changes are documented.

Code and documentation must remain synchronized.

⸻

7. Final Approval Flow

A task is complete only when:
	1.	Architect approves structural integrity.
	2.	Reviewer approves quality and tests.
	3.	No rule violations remain.

If any rule is violated, the task returns to Builder.

⸻

Completion is defined by compliance, not by code being written.

Structural integrity and correctness take priority over delivery speed.