**Participatory Civic AI MVP**

Extended guide to the n8n workflow, the role of every major node, and
why the architecture is relevant to Mozilla’s Democracy & AI goals.

| What this system does: it takes citizen input, normalizes it into structured civic data, retrieves technical planning context from a document corpus, generates multiple proposal types, reviews them through an ethical-governance lens, scores their likely impact, produces a citizen-facing explanation, and stores the result for a public dashboard. |
|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|

Prepared from the current n8n workflow export and its connected prompt
architecture.

1\. Why this workflow matters

This workflow is not just an automation chain. It is a civic AI pipeline
designed to transform raw participation into legible, accountable
outputs. Instead of leaving citizen workshops or form submissions as
unstructured notes, it turns them into policy-oriented proposal packages
that can be reviewed, compared, stored, and presented publicly.

That matters for Mozilla because the Democracy & AI framing is not about
AI generating content in the abstract; it is about using AI to increase
democratic capacity while preserving transparency, plurality, and public
trust. This workflow directly addresses that need by including both
generative and governance layers.

2\. End-to-end architecture

The current flow can be read as seven stages:

> **•** Intake and consent validation
>
> **•** Normalization of raw participation answers into structured civic
> variables
>
> **•** Query construction and retrieval of technical context from a
> policy/planning knowledge base
>
> **•** Generation of diversified civic solution types and full proposal
> packages
>
> **•** Ethical review and approval logic
>
> **•** Impact scoring and citizen-facing explanation
>
> **•** Storage for dashboard and public transparency

Major node groups

| Group                    | Primary nodes                                                                         | Purpose                                                             | Mozilla relevance                                                    |
|--------------------------|---------------------------------------------------------------------------------------|---------------------------------------------------------------------|----------------------------------------------------------------------|
| Intake                   | Webhook - Intake; Tally Trigger; Mock data provider                                   | Captures citizen input from production or test channels.            | Demonstrates real participatory entry points, not synthetic-only AI. |
| Normalization            | Code in JavaScript; If - Consent Given?; Code - Build Civic Profile                   | Converts messy form answers into a structured civic profile.        | Shows respect for consent and data governance.                       |
| Retrieval                | Build Query; AI Agent - Fetch Technical Data; technical_knowledge_base; Merge Context | Grounds outputs in technical and policy context.                    | Reduces hallucination and ties AI to public-interest sources.        |
| Generation               | AI Agent – Generate Solution Types; AI Agent - Generate Proposals                     | Creates plural solution categories and detailed proposals.          | Preserves plurality instead of producing a single top-down answer.   |
| Governance               | AI Agent - Ethical Review; If - Approved?; HTTP - Revise Proposals                    | Checks outputs for exclusion, bias, and critical governance issues. | Embeds AI accountability into the workflow.                          |
| Evaluation & explanation | AI Agent – Impact Scoring; AI Agent – Civic Explanation                               | Scores proposals and explains them in accessible language.          | Supports transparency, public understanding, and scrutiny.           |
| Persistence              | Code - Build Dashboard Record; HTTP/Supabase store                                    | Stores records for dashboard use and public-facing interfaces.      | Makes civic AI auditable and inspectable over time.                  |

3\. Intake and consent layer

Webhook - Intake / Tally Trigger / Mock data provider

The workflow supports multiple ways to enter the system. In production,
a webhook or Tally trigger can receive citizen answers from a survey or
workshop form. During development, the mock-data provider injects a
realistic test record so the full pipeline can be exercised without
waiting for live responses.

This is important because Mozilla reviewers usually want evidence that
the system can move beyond a polished concept into a repeatable demo.
The mock path proves reproducibility; the webhook path proves real-world
integration potential.

If - Consent Given?

This node is a governance gate. It ensures that processing only
continues when consent has been granted. Conceptually, this is small but
crucial: the workflow does not treat participation data as free raw
material. It explicitly checks permission before the AI pipeline begins.

In a Mozilla framing, this matters because responsible AI is not only
about model behavior. It is also about whether the human data pipeline
respects agency, consent, and legitimate participation practices.

4\. Normalization and civic profile construction

Code in JavaScript

This node parses the incoming form payload and translates human-facing
questions into machine-usable fields such as issue_main, area,
priority_values, community_assets, solution_types, affected_groups, and
ethical_principles. It also resolves arrays, numbers, and optional
answers into a cleaner schema.

This is one of the most strategically important nodes in the entire
workflow. Without normalization, all downstream AI steps would be
unstable. The model would have to interpret inconsistent field names and
partial structures on every run. By normalizing first, the system
creates a stable civic representation layer.

Code - Build Civic Profile

This node adds interpretive structure around the normalized input. It
creates summaries of participation and values, builds a citizen_profile
object, and prepares llm_input content with the issue, area, priorities,
ethical keywords, and desired solution directions.

The key concept here is representation. The workflow is not treating the
citizen as a prompt fragment; it is treating participation as a
structured civic profile with context, values, red lines, and lived
experience. That is much closer to democratic practice than a generic
chatbot approach.

Mozilla relevance: this node embodies plural and context-aware AI. It
makes the system legible enough to explain how community concerns become
AI inputs, which is essential for trust.

5\. Retrieval-augmented context

Build Query

This node converts the civic profile into a retrieval query. It uses
fields such as issue_main, area, and priority_values to generate a
search string focused on urban planning regulations, civic participation
frameworks, and governance-relevant technical guidance.

AI Agent - Fetch Technical Data

This agent queries the technical_knowledge_base vector tool, which is
backed by Supabase and populated with planning and policy PDFs. The
agent is instructed to retrieve relevant documents rather than invent
context.

technical_knowledge_base / embeddings / document ingestion

The knowledge base subsystem uses embeddings and a Supabase-backed
vector store so the workflow can retrieve targeted excerpts from source
documents. Separate ingestion nodes process PDFs, split them into
chunks, generate embeddings, and write them to the civic_documents
collection.

Conceptually, this is the anti-hallucination layer. Instead of asking
the model to invent policy context from general memory, the workflow
explicitly supplies retrieved material. That matters to Mozilla because
democratic applications require traceability and grounding.

Merge Context

This node consolidates retrieval results into technical_context_text and
preserves retrieved_documents metadata. It acts as the bridge between
search and proposal generation.

Mozilla relevance: retrieval grounding is what allows the system to
claim that its proposals are informed by public-interest knowledge
rather than by opaque model intuition alone.

6\. Proposal diversity and proposal generation

AI Agent – Generate Solution Types

This node produces a deliberate spread of solution categories, such as
policy, community program, urban infrastructure, and education campaign.
Its purpose is not to solve the problem directly, but to widen the
solution space before full proposal generation.

This is a strong Mozilla-aligned design choice. A common failure mode in
civic AI is false consensus: the system presents one polished answer and
hides the fact that multiple intervention types were possible. By
forcing diversity first, the workflow preserves plurality and resists
single-track solution bias.

AI Agent - Generate Proposals

Using the citizen issue, location, values, community assets, retrieved
technical context, and the solution types scaffold, this node generates
three structured civic proposals. Each proposal contains a title,
problem summary, solution, implementation steps, stakeholders, and
expected six-month impact.

The key concept here is translational generation. The model is not
merely brainstorming. It is translating civic input into an intermediate
form that policymakers, community groups, or municipal staff could
discuss. It is a packaging and synthesis layer between raw participation
and institutional action.

Mozilla relevance: this node is where democratic augmentation becomes
visible. It helps communities move from complaint or need expression to
multiple structured options that remain grounded in both lived
experience and policy context.

7\. Ethical review and governance control

AI Agent - Ethical Review

This node is the governance heart of the MVP. It reviews generated
proposals for bias, exclusion, accessibility issues, weak technical
feasibility, unrealistic implementation claims, and social fairness
risks. It returns a structured result: approved plus a list of issues
with severity labels.

The key concept is not simply 'moderation.' It is civic governance
review. The system evaluates whether proposals that look useful on paper
might still produce inequitable outcomes, ignore vulnerable groups, or
overclaim feasibility.

This is one of the strongest Mozilla-relevant features in the workflow
because it demonstrates that AI is not trusted blindly. A second
analytical layer scrutinizes the first one. That is far closer to
public-interest AI governance than a simple generate-and-display
interface.

If - Approved?

This node implements the workflow decision rule. It passes records
forward when proposals are approved and no critical issues are found. If
critical issues are detected, the flow branches to revision.

HTTP - Revise Proposals

This node sends the original proposal package plus reviewer feedback to
a model endpoint and requests a revised proposal set. This makes the
system iterative instead of brittle: ethical review is not only a
rejection mechanism, but also a corrective loop.

Mozilla relevance: the revision path demonstrates procedural
accountability. The system can improve proposals in response to
identified harms rather than simply suppressing them.

8\. Impact scoring and public explanation

AI Agent – Impact Scoring

This node evaluates the proposal package against four public-interest
dimensions: equity, sustainability, feasibility, and likely community
support. It returns per-proposal scores and short evaluative summaries.

Conceptually, this is the comparative policy layer. Ethical review asks
whether a proposal is acceptable; impact scoring asks how strong or
promising it is across civic priorities.

For Mozilla, this matters because democratic AI should not only avoid
harm. It should also help communities compare options more
intelligently.

AI Agent – Civic Explanation

This node converts the internal system outputs into a citizen-facing
explanation. It states what issue was raised, what proposals were
generated, why they address the problem, and how ethical review assessed
them.

This is the transparency layer. Instead of asking the public to trust
hidden machine reasoning, the system provides a legible account of what
happened. That makes the dashboard more than a data sink; it becomes an
explanatory civic interface.

Mozilla relevance: this is directly aligned with explainable and
accountable AI. Public legitimacy often depends not only on the result,
but on whether people can understand how the result was produced.

9\. Storage and dashboard preparation

Code - Build Dashboard Record

This node packages the proposal set, scores, approval outcome, and
metadata into a single civic_records row. It is intentionally designed
for dashboard consumption, not just raw archival storage.

HTTP/Supabase storage

The record is stored so the frontend can show aggregate metrics,
proposal details, approval states, and impact summaries. Once stored,
the system becomes inspectable over time rather than limited to one-off
runs.

Mozilla relevance: persistence is part of accountability. If outputs are
stored in a queryable way, the system can support public oversight,
audits, pattern detection, and future comparative analysis.

10\. Dashboard and public interface

The companion website turns the backend pipeline into a civic product.
The dashboard presents totals, approval rates, impact averages, and
proposal details. The explorer page allows viewers to inspect generated
civic proposals and their review outcomes.

The key concept here is public legibility. An AI system that only exists
inside n8n remains a technical artifact. An AI system whose outputs are
available in a clear dashboard becomes part of a democratic information
surface.

Mozilla relevance: this is where the MVP stops being an automation demo
and starts looking like democratic infrastructure.

11\. Why this is meaningfully aligned with Mozilla

Mozilla’s AI work tends to favor systems that are participatory,
accountable, transparent, and socially grounded. This workflow aligns
with those values in several ways.

> **•** It begins with citizen input rather than institutional or
> corporate data extraction.
>
> **•** It preserves plurality by generating multiple solution
> categories instead of one monolithic answer.
>
> **•** It grounds outputs in retrieved civic and planning documents.
>
> **•** It introduces a dedicated ethical review layer before proposals
> are accepted.
>
> **•** It supports iterative correction through a revision branch.
>
> **•** It exposes outputs through public-facing explanation and
> dashboard interfaces.

In other words, the system is not only an AI generator. It is a
miniature governance stack.

12\. Key risks and honest limitations

For a Mozilla presentation, it is better to acknowledge limitations
clearly than to oversell maturity.

> **•** The workflow still depends on the quality and representativeness
> of the document corpus in the vector store.
>
> **•** Ethical review is model-based, so it should be presented as a
> governance aid, not a final authority.
>
> **•** Impact scores are heuristic outputs, not empirical impact
> forecasts.
>
> **•** The dashboard currently reflects stored proposal packages, but
> long-term participatory legitimacy would require stronger human
> oversight and public feedback loops.
>
> **•** The system demonstrates democratic augmentation, not autonomous
> policy-making.

13\. How to present the MVP in a Mozilla-friendly way

A strong presentation should emphasize that the system is designed to
help communities and institutions think with AI, not be replaced by it.

Recommended framing:

> **•** Citizen concerns are captured and normalized into a civic data
> model.
>
> **•** Relevant planning and policy context is retrieved from a curated
> knowledge base.
>
> **•** The system generates plural proposal pathways rather than a
> single answer.
>
> **•** A separate ethical review layer checks for exclusion, weak
> accessibility, and governance risks.
>
> **•** Proposals are scored and explained in a way that can be shown
> publicly.
>
> **•** All results are stored in a dashboard that supports transparency
> and future iteration.

14\. Suggested language for the application

One concise description you can reuse:

| Participatory Civic AI is an AI-assisted civic participation system that translates citizen input into technically grounded policy proposals, subjects them to ethical-governance review, evaluates their likely impact, and makes the results visible through a public transparency dashboard. |
|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|

One stronger Mozilla-specific angle:

| This MVP demonstrates how AI can expand democratic capacity without collapsing plurality, accountability, or public legibility. Instead of automating decisions, it structures participation, surfaces multiple policy options, checks them for governance risks, and explains them in a way communities can inspect. |
|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
