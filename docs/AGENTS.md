Core Governing Rule for AGENTS.md

All AI agents operating in this repository must strictly follow role separation and architectural discipline.

No agent may act outside of its assigned responsibility.

Architect defines and guards structure.
Builder implements minimal compliant changes.
Reviewer validates quality and rule adherence.

No code may be written before:
	1.	Reading all relevant documents in /docs.
	2.	Confirming alignment with ARCHITECTURE.md.
	3.	Defining a minimal implementation plan.

Any violation of layer boundaries, data model rules, or architectural constraints must immediately stop execution and require correction.

Speed is secondary to structural integrity.
Minimal change is preferred over large refactoring.
If uncertainty exists, the agent must stop and request clarification rather than proceed.

This rule overrides all other instructions.