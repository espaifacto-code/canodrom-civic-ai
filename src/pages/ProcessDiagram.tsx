import { ArrowDown, ArrowLeft, ArrowRight, RotateCcw } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const lanes = [
  {
    label: "Participation",
    color: "bg-blue-50 border-blue-200",
    headerBg: "bg-blue-500",
    dotColor: "bg-blue-500",
    steps: ["Citizen Input", "Consent Verification", "Data Normalization", "Civic Profile"],
  },
  {
    label: "Grounding",
    color: "bg-teal-50 border-teal-200",
    headerBg: "bg-teal-500",
    dotColor: "bg-teal-500",
    steps: ["Build Query", "Retrieve Policy Context", "Citizen + Policy Context"],
  },
  {
    label: "Generation",
    color: "bg-purple-50 border-purple-200",
    headerBg: "bg-purple-500",
    dotColor: "bg-purple-500",
    steps: ["Generate Solution Types", "Generate Civic Proposals"],
  },
  {
    label: "Governance",
    color: "bg-orange-50 border-orange-200",
    headerBg: "bg-orange-500",
    dotColor: "bg-orange-500",
    subtitle: "Safeguards against bias, exclusion, and unrealistic policy outputs",
    steps: ["Ethical Review", "Approval Gate", "Revision Loop"],
  },
  {
    label: "Transparency",
    color: "bg-emerald-50 border-emerald-200",
    headerBg: "bg-emerald-500",
    dotColor: "bg-emerald-500",
    steps: ["Impact Scoring", "Civic Explanation", "Dashboard Record", "Supabase", "Public Transparency Dashboard"],
  },
];

const badges = [
  { label: "Consent-aware", color: "bg-blue-100 text-blue-700 border-blue-200" },
  { label: "RAG-grounded", color: "bg-teal-100 text-teal-700 border-teal-200" },
  { label: "Plurality-preserving", color: "bg-purple-100 text-purple-700 border-purple-200" },
  { label: "Ethically reviewed", color: "bg-orange-100 text-orange-700 border-orange-200" },
  { label: "Publicly explainable", color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
];

const nodeTooltips: Record<
  string,
  {
    title: string;
    description: string;
    badge: string;
  }
> = {
  "Citizen Input": {
    title: "Citizen Input",
    description:
      "Captures raw citizen or workshop responses about a local issue. Input comes from form fields, workshop notes, or survey responses; output is unstructured civic input.",
    badge: "Democratic entry point",
  },
  "Consent Verification": {
    title: "Consent Verification",
    description:
      "Checks whether the participant has agreed to AI-assisted processing of their input. Input is the consent field from the submission form; output is approval to continue or stop the workflow.",
    badge: "Protects participants before AI processing begins",
  },
  "Data Normalization": {
    title: "Data Normalization",
    description:
      "Converts raw form answers into consistent structured fields. Input includes mixed survey answers, labels, and text responses; output is clean civic variables (issue, area, values, affected groups, desired solutions).",
    badge: "Makes input machine-readable without losing civic meaning",
  },
  "Civic Profile": {
    title: "Civic Profile",
    description:
      "Builds a structured profile of the civic situation described by the participant. Input is normalized citizen data; output is a civic profile with issue, priorities, ethical principles, and lived context.",
    badge: "Turns fragmented responses into a coherent public problem",
  },
  "Build Query": {
    title: "Build Query",
    description:
      "Converts the civic profile into a retrieval query for technical and policy documents. Input is issue, area, values, and community priorities; output is a structured search query.",
    badge: "Connects citizen concerns to institutional knowledge",
  },
  "Retrieve Policy Context": {
    title: "Retrieve Policy Context",
    description:
      "Searches the knowledge base for planning, accessibility, sustainability, and governance documents related to the issue. Input is the retrieval query; output is relevant technical and policy references.",
    badge: "Grounds proposals in real planning knowledge",
  },
  "Citizen + Policy Context": {
    title: "Citizen + Policy Context",
    description:
      "Merges citizen priorities with retrieved planning and policy knowledge. Input is the civic profile and retrieved context; output is a grounded context package for proposal generation.",
    badge: "Where participatory knowledge and formal knowledge meet",
  },
  "Generate Solution Types": {
    title: "Generate Solution Types",
    description:
      "Produces a diverse set of solution categories before generating final proposals. Input is the civic issue and context; output includes categories like policy, community initiative, infrastructure, and education.",
    badge: "Preserves plurality in possible interventions",
  },
  "Generate Civic Proposals": {
    title: "Generate Civic Proposals",
    description:
      "Creates concrete civic proposals based on citizen input and grounded policy context. Input includes civic profile, retrieved context, and solution categories; output is structured proposals with title, steps, stakeholders, and expected impact.",
    badge: "Translates public concerns into actionable options",
  },
  "Ethical Review": {
    title: "Ethical Review",
    description:
      "Evaluates generated proposals for exclusion, bias, accessibility gaps, weak sustainability, and unrealistic implementation. Input is the proposal package and citizen priorities; output is an ethical issues list plus an approval recommendation.",
    badge: "Adds oversight before publication",
  },
  "Approval Gate": {
    title: "Approval Gate",
    description:
      "Decides whether proposals proceed or must be revised. Input is the ethical review result; output is an approved package or a revision path.",
    badge: "Introduces procedural accountability",
  },
  "Revision Loop": {
    title: "Revision Loop",
    description:
      "Sends problematic proposals back for revision using reviewer feedback. Input is ethical issues and the rejected proposal package; output is improved proposals for another review cycle.",
    badge: "Makes the system iterative and safer",
  },
  "Impact Scoring": {
    title: "Impact Scoring",
    description:
      "Scores proposals across dimensions such as feasibility, inclusivity, sustainability, and community support. Input is approved proposals; output is structured impact scores and evaluation summaries.",
    badge: "Surfaces public value through comparison",
  },
  "Civic Explanation": {
    title: "Civic Explanation",
    description:
      "Translates the proposal and review results into plain language. Input is proposals, ethical review, and impact scores; output is a citizen-readable explanation.",
    badge: "Makes AI outputs understandable to citizens",
  },
  "Dashboard Record": {
    title: "Dashboard Record",
    description:
      "Packages all outputs into a structured civic record for storage and visualization. Input is proposals, review, explanation, and scores; output is a final record object.",
    badge: "Creates traceability for public transparency",
  },
  Supabase: {
    title: "Supabase",
    description:
      "Stores civic records in a structured database. Input is the final dashboard record; output is persistent public-interest data.",
    badge: "Enables accountability and reuse over time",
  },
  "Public Transparency Dashboard": {
    title: "Public Transparency Dashboard",
    description:
      "Displays submissions, proposals, ethical status, and impact results to the public or stakeholders. Input is stored civic records; output is an accessible civic intelligence interface.",
    badge: "Turns the workflow into a transparency tool",
  },
};

export default function ProcessDiagram() {
  return (
    <main className="min-h-screen bg-background">
      <TooltipProvider>
        <div className="container py-10">
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Participatory Civic AI Pipeline
          </h1>
          <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
            How citizen input is transformed into AI-generated civic proposals with ethical oversight and impact evaluation.
          </p>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {badges.map((b) => (
            <span
              key={b.label}
              className={`inline-flex items-center rounded-full border px-4 py-1.5 text-xs font-semibold ${b.color}`}
            >
              {b.label}
            </span>
          ))}
        </div>

        {/* Swimlane Diagram */}
        <div className="overflow-x-auto pb-4">
          <div className="min-w-[900px] space-y-4">
            {lanes.map((lane, laneIdx) => (
              <div
                key={lane.label}
                className={`flex items-stretch rounded-xl border ${lane.color} overflow-hidden`}
              >
                {/* Lane Header */}
                <div
                  className={`flex flex-col items-center justify-center px-5 py-4 min-w-[140px] ${lane.headerBg} text-white`}
                >
                  <span className="text-sm font-bold tracking-wide whitespace-nowrap">
                    {lane.label}
                  </span>
                  {lane.subtitle ? (
                    <span className="mt-1 text-[11px] font-medium text-white/80 text-center">
                      {lane.subtitle}
                    </span>
                  ) : null}
                </div>

                {/* Steps */}
                <div
                  className={`flex items-center gap-2 px-5 py-4 flex-1 ${
                    lane.label === "Governance" ? "pb-12" : ""
                  }`}
                >
                  {lane.steps.map((step, stepIdx) => {
                    const tooltip = nodeTooltips[step];
                    const isApprovalGate =
                      lane.label === "Governance" && step === "Approval Gate";
                    const isRevisionLoop =
                      lane.label === "Governance" && step === "Revision Loop";

                    const stepCard = (
                      <div
                        className={`relative flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5 shadow-sm transition-shadow hover:shadow-md ${
                          isRevisionLoop ? "ring-2 ring-orange-300" : ""
                        }`}
                      >
                        <div className={`h-2 w-2 rounded-full ${lane.dotColor} shrink-0`} />
                        <span className="text-sm font-medium text-foreground whitespace-nowrap">
                          {step}
                        </span>

                        {/* Approval gate indicator */}
                        {isApprovalGate && (
                          <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-orange-500 text-[10px]">
                            <ArrowDown className="h-3 w-3" />
                            <span className="font-semibold">if issues</span>
                          </div>
                        )}

                        {/* Revision loop hint */}
                        {isRevisionLoop && (
                          <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-1 text-orange-500 text-[10px]">
                            <ArrowLeft className="h-3 w-3" />
                            <span className="font-semibold">back to proposal review</span>
                          </div>
                        )}
                      </div>
                    );

                    return (
                      <div key={step} className="flex items-center gap-2">
                        {tooltip ? (
                          <Tooltip>
                            <TooltipTrigger asChild>{stepCard}</TooltipTrigger>
                            <TooltipContent className="max-w-xs">
                              <div className="flex flex-col gap-1">
                                <p className="text-sm font-semibold">{tooltip.title}</p>
                                <p className="text-xs leading-snug text-muted-foreground">
                                  {tooltip.description}
                                </p>
                                <div className="mt-2 inline-flex items-center rounded-full bg-muted px-2.5 py-1 text-[10px] font-semibold text-foreground">
                                  {tooltip.badge}
                                </div>
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        ) : (
                          stepCard
                        )}

                        {/* Arrow between steps (not after last in lane) */}
                        {stepIdx < lane.steps.length - 1 && (
                          <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Inter-lane Flow Arrow */}
          <div className="flex justify-center mt-6 min-w-[900px]">
            <div className="flex items-center gap-3 px-6 py-2 rounded-full border border-border bg-card shadow-sm">
              <span className="text-xs font-semibold text-blue-600">Participation</span>
              <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-xs font-semibold text-teal-600">Grounding</span>
              <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-xs font-semibold text-purple-600">Generation</span>
              <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-xs font-semibold text-orange-600">Governance</span>
              <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-xs font-semibold text-emerald-600">Transparency</span>
            </div>
          </div>
        </div>

        {/* Governance Loop Callout */}
        <div className="mt-8 mx-auto max-w-xl rounded-xl border border-orange-200 bg-orange-50 p-5">
          <div className="flex items-start gap-3">
            <RotateCcw className="h-5 w-5 text-orange-500 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-orange-800">Governance Loop</p>
              <p className="text-sm text-orange-700 mt-1">
                If the <strong>Approval Gate</strong> flags concerns, proposals enter a{" "}
                <strong>Revision Loop</strong> and are re-evaluated by{" "}
                <strong>Ethical Review</strong> until they meet governance standards.
              </p>
            </div>
          </div>
        </div>

        {/* Transparency Footer */}
        <div className="mt-10 text-center text-sm text-muted-foreground max-w-2xl mx-auto">
          <p>
            This platform demonstrates responsible AI-assisted civic participation.
            Citizen input is translated into policy proposals using AI models combined
            with contextual knowledge. All proposals undergo ethical review and impact
            scoring before being presented.
          </p>
          <p className="mt-3 font-semibold text-muted-foreground">
            Citizen input → grounded proposals → ethical oversight → public transparency
          </p>
        </div>
        </div>
      </TooltipProvider>
    </main>
  );
}
