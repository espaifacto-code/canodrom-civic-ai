import { useCivicRecords } from "@/hooks/useCivicRecords";
import type { CivicRecord, Proposal, ProposalScore } from "@/types/civic";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle2, AlertCircle, Clock, Users, Lightbulb, Target } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const SCORE_LABELS: Record<string, string> = {
  equity_score: "Equidad",
  sustainability_score: "Sostenibilidad",
  feasibility_score: "Viabilidad",
  community_support_score: "Apoyo ciudadano",
};

const SCORE_COLORS: Record<string, string> = {
  equity_score: "#10b981",
  sustainability_score: "#3b82f6",
  feasibility_score: "#f59e0b",
  community_support_score: "#8b5cf6",
};

function ScoreBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{label}</span>
        <span className="font-semibold" style={{ color }}>{value}/10</span>
      </div>
      <div className="h-1.5 rounded-full bg-muted overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${(value / 10) * 100}%`, background: color }}
        />
      </div>
    </div>
  );
}

function ProposalCard({ proposal, score, index }: {
  proposal: Proposal;
  score?: ProposalScore;
  index: number;
}) {
  const scoreKeys: (keyof ProposalScore)[] = [
    "equity_score", "sustainability_score", "feasibility_score", "community_support_score"
  ];

  return (
    <Card className="border-2 hover:border-blue-300 transition-colors duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          <div
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
            style={{ background: "linear-gradient(135deg,#2563eb,#0891b2)" }}
          >
            {index + 1}
          </div>
          <CardTitle className="text-base leading-snug">{proposal.title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {proposal.problem_summary && (
          <p className="text-sm text-muted-foreground leading-relaxed">
            {proposal.problem_summary}
          </p>
        )}

        <div className="rounded-lg bg-blue-50 dark:bg-blue-950/30 p-3">
          <p className="text-xs font-semibold text-blue-700 dark:text-blue-400 mb-1.5 flex items-center gap-1">
            <Lightbulb className="h-3 w-3" /> Propuesta
          </p>
          <p className="text-sm leading-relaxed">{proposal.solution}</p>
        </div>

        {proposal.implementation_steps?.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-muted-foreground mb-2">Pasos de implementación</p>
            <ol className="space-y-1.5">
              {proposal.implementation_steps.map((step, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span className="mt-0.5 h-4 w-4 shrink-0 rounded-full bg-slate-200 dark:bg-slate-700 text-xs flex items-center justify-center font-medium">
                    {i + 1}
                  </span>
                  <span className="leading-snug">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        )}

        {proposal.stakeholders?.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {proposal.stakeholders.map(s => (
              <Badge key={s} variant="outline" className="text-xs">{s}</Badge>
            ))}
          </div>
        )}

        {proposal.expected_impact_6m && (
          <div className="rounded-lg border border-emerald-200 dark:border-emerald-800 p-3">
            <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 mb-1 flex items-center gap-1">
              <Target className="h-3 w-3" /> Impacto esperado en 6 meses
            </p>
            <p className="text-xs leading-relaxed text-muted-foreground">{proposal.expected_impact_6m}</p>
          </div>
        )}

        {score && (
          <div className="space-y-2 pt-1 border-t">
            {scoreKeys.map(k => (
              <ScoreBar
                key={k}
                label={SCORE_LABELS[k as string]}
                value={(score[k] as number) ?? 0}
                color={SCORE_COLORS[k as string]}
              />
            ))}
            {score.summary && (
              <p className="text-xs text-muted-foreground pt-1 italic">{score.summary}</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function RecordView({ record }: { record: CivicRecord }) {
  const proposals = record.proposals ?? [];
  const scores = record.scores ?? [];
  const topEffects = record.top_effects ?? [];
  const topActors = record.top_actors ?? [];

  const getScoreForProposal = (proposal: Proposal): ProposalScore | undefined =>
    scores.find(s =>
      s.proposal_title?.toLowerCase().includes(proposal.title?.toLowerCase().slice(0, 20))
    );

  return (
    <div className="container space-y-8 py-8">

      {/* Header */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          {record.approved ? (
            <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300 border-emerald-200 gap-1.5">
              <CheckCircle2 className="h-3 w-3" /> Aprobado
            </Badge>
          ) : (
            <Badge variant="outline" className="text-amber-600 border-amber-300 gap-1.5">
              <AlertCircle className="h-3 w-3" /> Revisión recomendada
            </Badge>
          )}
          {record.category && <Badge variant="secondary">{record.category}</Badge>}
          {record.area && <Badge variant="outline">{record.area}</Badge>}
        </div>

        <h1 className="text-2xl font-semibold tracking-tight">
          Resultados del Workshop Canodrom
        </h1>
        <p className="text-sm text-muted-foreground">
          {record.issue ?? "Turismo masivo en Barcelona"} ·{" "}
          <span className="inline-flex items-center gap-1">
            <Users className="h-3 w-3" />
            {record.total_responses ?? "—"} participantes
          </span>
          {" · "}
          {format(new Date(record.created_at), "d 'de' MMMM, HH:mm", { locale: es })}
        </p>
      </div>

      {/* Context chips */}
      {(topEffects.length > 0 || topActors.length > 0) && (
        <div className="flex flex-wrap gap-6">
          {topEffects.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">Efectos más votados</p>
              <div className="flex flex-wrap gap-1.5">
                {topEffects.slice(0, 5).map(e => (
                  <Badge key={e.name} variant="secondary" className="text-xs">
                    {e.name} <span className="ml-1 opacity-60">({e.count})</span>
                  </Badge>
                ))}
              </div>
            </div>
          )}
          {topActors.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">Actores clave</p>
              <div className="flex flex-wrap gap-1.5">
                {topActors.slice(0, 4).map(a => (
                  <Badge key={a.name} variant="outline" className="text-xs">
                    {a.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Proposals */}
      <div>
        <h2 className="text-lg font-semibold mb-4">
          {proposals.length} Propuestas generadas
        </h2>
        <div className="grid gap-6 lg:grid-cols-3 md:grid-cols-2">
          {proposals.map((p, i) => (
            <ProposalCard
              key={i}
              proposal={p}
              score={getScoreForProposal(p)}
              index={i}
            />
          ))}
        </div>
      </div>

      {/* Ethical review */}
      {record.ethical_issues && record.ethical_issues.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-amber-500" />
              Revisión ética ({record.ethical_issues_count ?? record.ethical_issues.length} observaciones)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {record.ethical_issues.map((issue, i) => (
                <div key={i} className="flex items-start gap-3 rounded-lg border p-3 text-sm">
                  <Badge
                    variant="outline"
                    className={
                      issue.severity === "critical" ? "border-red-300 text-red-600" :
                      issue.severity === "high" ? "border-orange-300 text-orange-600" :
                      issue.severity === "medium" ? "border-yellow-300 text-yellow-600" :
                      "border-slate-300 text-slate-500"
                    }
                  >
                    {issue.severity}
                  </Badge>
                  <div>
                    <p className="font-medium text-xs">{issue.area}</p>
                    <p className="text-muted-foreground text-xs mt-0.5">{issue.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="container py-24 flex flex-col items-center justify-center text-center gap-6">
      <div className="relative">
        <div className="h-20 w-20 rounded-full bg-blue-50 dark:bg-blue-950 flex items-center justify-center">
          <Clock className="h-9 w-9 text-blue-400" />
        </div>
        <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-amber-400 animate-pulse" />
      </div>
      <div>
        <h2 className="text-xl font-semibold">Esperando resultados del pipeline</h2>
        <p className="mt-2 text-sm text-muted-foreground max-w-sm">
          Cuando pulses "Iniciar pipeline" en el dashboard y el proceso termine,
          las propuestas generadas por IA aparecerán aquí automáticamente.
        </p>
      </div>
      <p className="text-xs text-muted-foreground">Actualización automática cada 15 segundos</p>
    </div>
  );
}

export default function Results() {
  const { data: records = [], isLoading } = useCivicRecords();
  const latest = records[0] ?? null;

  if (isLoading) {
    return (
      <div className="container py-8 space-y-6">
        <Skeleton className="h-8 w-72" />
        <div className="grid gap-6 lg:grid-cols-3">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-96" />)}
        </div>
      </div>
    );
  }

  if (!latest) return <EmptyState />;

  return <RecordView record={latest} />;
}
