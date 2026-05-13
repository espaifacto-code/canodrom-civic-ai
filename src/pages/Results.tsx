import { useCivicRecords } from "@/hooks/useCivicRecords";
import type { CivicRecord, Proposal, ProposalScore } from "@/types/civic";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  CheckCircle2, AlertCircle, Clock, Users, Lightbulb,
  Target, ArrowRight, Sparkles,
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

/* ─── Score pill ──────────────────────────────────────────────── */
const SCORES_META = [
  { key: "equity_score",             label: "Equidad",          color: "#10b981", bg: "#ecfdf5" },
  { key: "sustainability_score",     label: "Sostenibilidad",   color: "#3b82f6", bg: "#eff6ff" },
  { key: "feasibility_score",        label: "Viabilidad",       color: "#f59e0b", bg: "#fffbeb" },
  { key: "community_support_score",  label: "Apoyo ciudadano",  color: "#8b5cf6", bg: "#f5f3ff" },
];

function ScorePill({ label, value, color, bg }: { label: string; value: number; color: string; bg: string }) {
  return (
    <div className="flex flex-col items-center gap-0.5 rounded-xl px-3 py-2.5" style={{ background: bg }}>
      <span className="text-xl font-bold leading-none" style={{ color }}>{value}</span>
      <span className="text-[10px] font-medium text-center leading-tight" style={{ color }}>{label}</span>
    </div>
  );
}

/* ─── Proposal card ───────────────────────────────────────────── */
const CARD_ACCENTS = [
  { border: "#2563eb", bg: "from-blue-50 to-white", num: "#2563eb", numBg: "#dbeafe" },
  { border: "#059669", bg: "from-emerald-50 to-white", num: "#059669", numBg: "#d1fae5" },
  { border: "#d97706", bg: "from-amber-50 to-white", num: "#d97706", numBg: "#fef3c7" },
];

function ProposalCard({ proposal, score, index }: {
  proposal: Proposal;
  score?: ProposalScore;
  index: number;
}) {
  const accent = CARD_ACCENTS[index % CARD_ACCENTS.length];
  return (
    <div
      className={`rounded-2xl border-2 bg-gradient-to-b ${accent.bg} flex flex-col overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200`}
      style={{ borderColor: accent.border }}
    >
      {/* Card header */}
      <div className="px-5 pt-5 pb-4 flex items-start gap-3">
        <div
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-base font-bold"
          style={{ background: accent.numBg, color: accent.num }}
        >
          {index + 1}
        </div>
        <h3 className="text-[15px] font-semibold leading-snug mt-0.5">{proposal.title}</h3>
      </div>

      {/* Body */}
      <div className="px-5 pb-5 flex flex-col gap-4 flex-1">
        {proposal.problem_summary && (
          <p className="text-sm text-muted-foreground leading-relaxed">{proposal.problem_summary}</p>
        )}

        <div className="rounded-xl p-3.5" style={{ background: `${accent.numBg}88` }}>
          <p className="text-[11px] font-semibold mb-1.5 flex items-center gap-1.5" style={{ color: accent.num }}>
            <Lightbulb className="h-3 w-3" /> Propuesta
          </p>
          <p className="text-sm leading-relaxed">{proposal.solution}</p>
        </div>

        {proposal.implementation_steps?.length > 0 && (
          <div>
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide mb-2">Pasos</p>
            <ol className="space-y-1.5">
              {proposal.implementation_steps.map((step, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <ArrowRight className="h-3.5 w-3.5 mt-0.5 shrink-0" style={{ color: accent.num }} />
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
          <div className="mt-auto rounded-lg border p-3">
            <p className="text-[11px] font-semibold text-emerald-700 mb-1 flex items-center gap-1">
              <Target className="h-3 w-3" /> Impacto en 6 meses
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed">{proposal.expected_impact_6m}</p>
          </div>
        )}

        {/* Scores */}
        {score && (
          <div className="grid grid-cols-4 gap-2 pt-2 border-t">
            {SCORES_META.map(m => (
              <ScorePill
                key={m.key}
                label={m.label}
                value={(score[m.key as keyof ProposalScore] as number) ?? 0}
                color={m.color}
                bg={m.bg}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Main record view ────────────────────────────────────────── */
function RecordView({ record }: { record: CivicRecord }) {
  const proposals = record.proposals ?? [];
  const scores = record.scores ?? [];
  const topEffects = record.top_effects ?? [];
  const topActors = record.top_actors ?? [];

  const getScore = (p: Proposal) =>
    scores.find(s =>
      s.proposal_title?.toLowerCase().includes(p.title?.toLowerCase().slice(0, 20))
    );

  return (
    <div className="min-h-screen">

      {/* ── Hero ──────────────────────────────────────────────── */}
      <div className="relative overflow-hidden">
        {/* Background: generated image or gradient */}
        {record.image_url ? (
          <div className="absolute inset-0">
            <img
              src={record.image_url}
              alt="Imagen generada por IA"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/80" />
          </div>
        ) : (
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0c4a6e 100%)",
            }}
          />
        )}

        <div className="relative z-10 container py-16 md:py-24">
          <div className="max-w-3xl">
            <div className="flex flex-wrap gap-2 mb-4">
              {record.approved ? (
                <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 gap-1.5 backdrop-blur">
                  <CheckCircle2 className="h-3 w-3" /> Aprobado
                </Badge>
              ) : (
                <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30 gap-1.5 backdrop-blur">
                  <AlertCircle className="h-3 w-3" /> Revisión recomendada
                </Badge>
              )}
              {record.category && (
                <Badge className="bg-white/10 text-white/80 border-white/20 backdrop-blur">
                  {record.category}
                </Badge>
              )}
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight mb-3">
              Propuestas del Workshop Canodrom
            </h1>
            <p className="text-white/70 text-base md:text-lg mb-6 leading-relaxed">
              {record.issue ?? "Turismo masivo en Barcelona"}
            </p>

            <div className="flex flex-wrap gap-4 text-white/60 text-sm">
              <span className="flex items-center gap-1.5">
                <Users className="h-4 w-4" />
                {record.total_responses ?? "—"} participantes
              </span>
              <span className="flex items-center gap-1.5">
                <Sparkles className="h-4 w-4" />
                {proposals.length} propuestas generadas
              </span>
              <span>
                {format(new Date(record.created_at), "d 'de' MMMM, HH:mm", { locale: es })}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-10 space-y-10">

        {/* ── Context chips ─────────────────────────────────── */}
        {(topEffects.length > 0 || topActors.length > 0) && (
          <div className="flex flex-wrap gap-8">
            {topEffects.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
                  Efectos más votados
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {topEffects.slice(0, 5).map(e => (
                    <Badge key={e.name} variant="secondary" className="text-xs">
                      {e.name}
                      <span className="ml-1 opacity-50">({e.count})</span>
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            {topActors.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
                  Actores clave
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {topActors.slice(0, 4).map(a => (
                    <Badge key={a.name} variant="outline" className="text-xs">{a.name}</Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Proposal cards ────────────────────────────────── */}
        <div>
          <h2 className="text-xl font-semibold mb-5">
            {proposals.length} Propuestas generadas por IA
          </h2>
          <div className="grid gap-5 lg:grid-cols-3 md:grid-cols-2">
            {proposals.map((p, i) => (
              <ProposalCard key={i} proposal={p} score={getScore(p)} index={i} />
            ))}
          </div>
        </div>

        {/* ── Generated image (standalone, if no hero image area) ── */}
        {record.image_url && (
          <div>
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-blue-500" />
              Imagen generada por IA
            </h2>
            <div className="rounded-2xl overflow-hidden border shadow-md max-w-2xl">
              <img src={record.image_url} alt="Imagen generada" className="w-full" />
              {record.image_prompt && (
                <div className="px-4 py-3 bg-slate-50 dark:bg-slate-900">
                  <p className="text-xs text-muted-foreground italic">{record.image_prompt}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Ethical review ────────────────────────────────── */}
        {record.ethical_issues && record.ethical_issues.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-amber-500" />
              Revisión ética ({record.ethical_issues_count ?? record.ethical_issues.length} observaciones)
            </h2>
            <div className="grid gap-2 sm:grid-cols-2">
              {record.ethical_issues.map((issue, i) => (
                <div key={i} className="flex items-start gap-3 rounded-xl border p-3.5 text-sm bg-white dark:bg-slate-900">
                  <Badge
                    variant="outline"
                    className={
                      issue.severity === "critical" ? "border-red-300 text-red-600 shrink-0" :
                      issue.severity === "high"     ? "border-orange-300 text-orange-600 shrink-0" :
                      issue.severity === "medium"   ? "border-yellow-300 text-yellow-600 shrink-0" :
                                                      "border-slate-300 text-slate-500 shrink-0"
                    }
                  >
                    {issue.severity}
                  </Badge>
                  <div>
                    <p className="font-semibold text-xs">{issue.area}</p>
                    <p className="text-muted-foreground text-xs mt-0.5 leading-relaxed">{issue.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Empty state ─────────────────────────────────────────────── */
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
          las propuestas aparecerán aquí automáticamente.
        </p>
      </div>
      <p className="text-xs text-muted-foreground">Actualización automática cada 15 segundos</p>
    </div>
  );
}

/* ─── Page ────────────────────────────────────────────────────── */
export default function Results() {
  const { data: records = [], isLoading } = useCivicRecords();
  const latest = records[0] ?? null;

  if (isLoading) {
    return (
      <div>
        <Skeleton className="h-64 w-full rounded-none" />
        <div className="container py-8">
          <div className="grid gap-5 lg:grid-cols-3">
            {[1, 2, 3].map(i => <Skeleton key={i} className="h-96 rounded-2xl" />)}
          </div>
        </div>
      </div>
    );
  }

  if (!latest) return <EmptyState />;
  return <RecordView record={latest} />;
}
