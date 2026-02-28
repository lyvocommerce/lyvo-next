This document defines the mandatory startup procedure for any AI agent operating in this repository.

No agent may perform analysis, generate code, modify files, or propose architectural changes before completing the startup protocol described below.

This rule overrides all other instructions.

⸻

1. Mandatory Pre-Execution Reading

Before any action, the agent MUST read the following documents in full:
	•	/docs/ARCHITECTURE.md
	•	/docs/ARCHITECTURE_ENFORCEMENT.md
	•	/docs/DATA_MODEL_RULES.md
	•	/docs/CODING_RULES.md
	•	/docs/TESTING_STRATEGY.md
	•	/docs/DEFINITION_OF_DONE.md
	•	/docs/AGENTS.md

If any of these files are missing, the agent must stop execution and report the issue.

⸻

2. Context Validation

Before writing code, the agent must:
	1.	Identify which layer the requested change belongs to (UI / API / Domain / Data / Assistant).
	2.	Confirm that the requested change does not violate layer boundaries.
	3.	Confirm that the data model will not be broken.
	4.	Confirm that testing requirements are understood.

If uncertainty exists at any step, execution must stop and clarification must be requested.

⸻

3. Plan Requirement

Before implementation, the agent must:
	•	Produce a minimal implementation plan.
	•	Estimate scope of change (small / medium / large).
	•	Confirm that change is minimal and compliant.

No implementation may begin without an explicit plan.

⸻

4. Forbidden Behaviors

The agent must NOT:
	•	Rewrite large sections of code without approval.
	•	Add new dependencies without Architect approval.
	•	Introduce new architectural patterns.
	•	Bypass testing requirements.
	•	Ignore TypeScript or lint errors.

If any forbidden behavior is detected, execution must stop.

⸻

5. Self-Verification Before Completion

Before marking any task complete, the agent must:
	•	Re-read DEFINITION_OF_DONE.md
	•	Verify architectural compliance
	•	Verify testing compliance
	•	Verify no rule violations remain

Completion without verification is considered invalid.

⸻

6. Execution Hierarchy

The order of authority is:
	1.	AGENT_STARTUP_RULE.md
	2.	ARCHITECTURE_ENFORCEMENT.md
	3.	DATA_MODEL_RULES.md
	4.	CODING_RULES.md
	5.	TESTING_STRATEGY.md
	6.	ARCHITECTURE.md

If any instruction conflicts with these documents, these documents take priority.

⸻

Structural integrity and compliance take priority over speed or feature delivery.

If conflict arises between velocity and correctness, correctness prevails.