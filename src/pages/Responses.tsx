import { useMemo, useState } from "react";
import { useFormResponses } from "@/hooks/useFormResponses";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  Users, ChevronDown, ChevronUp, Lightbulb, Star, BarChart2, List,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, Cell,
} from "recharts";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

// ── Constants ─────────────────────────────────────────────────────────────────

const RELEVANCE_LABELS = [
  { key: "relevance_digital_platforms",    short: "Digital",     label: "Plataformas digitales" },
  { key: "relevance_political_framework",  short: "Político",    label: "Marco político" },
  { key: "relevance_data_transparency",    short: "Datos",       label: "Transparencia datos" },
  { key: "relevance_proximity_economy",    short: "Economía",    label: "Economía proximidad" },
  { key: "relevance_environmental_impact", short: "Ambiental",   label: "Impacto ambiental" },
  { key: "relevance_right_to_city",        short: "Derecho",     label: "Derecho a la ciudad" },
];

const EFFECT_LABELS: Record<string, string> = {
  "Vivienda": "Vivienda",
  "Comercio local": "Comercio local",
  "Espacio público": "Espacio público",
  "Descanso": "Ruido",
  "Transporte": "Transporte",
  "Identidad": "Identidad",
  "Limpieza": "Limpieza",
  "Recursos": "Recursos",
  "Trabajo": "Trabajo",
  "Derecho a la ciudad": "Derecho ciudad",
};

const EFFECT_COLORS: Record<string, string> = {
  "Vivienda":           "bg-blue-100   text-blue-800   border-blue-200",
  "Comercio local":     "bg-emerald-100 text-emerald-800 border-emerald-200",
  "Espacio público":    "bg-amber-100  text-amber-800  border-amber-200",
  "Ruido":              "bg-red-100    text-red-800    border-red-200",
  "Transporte":         "bg-purple-100 text-purple-800 border-purple-200",
  "Identidad":          "bg-pink-100   text-pink-800   border-pink-200",
  "Limpieza":           "bg-teal-100   text-teal-800   border-teal-200",
  "Recursos":           "bg-orange-100 text-orange-800 border-orange-200",
  "Trabajo":            "bg-indigo-100 text-indigo-800 border-indigo-200",
  "Derecho ciudad":     "bg-cyan-100   text-cyan-800   border-cyan-200",
  "Derecho a la ciudad":"bg-cyan-100   text-cyan-800   border-cyan-200",
};

const BAR_COLORS = ["#3b82f6","#10b981","#f59e0b","#ef4444","#8b5cf6","#06b6d4","#f97316","#22c55e","#ec4899","#6366f1"];

// ── Aggregate charts ──────────────────────────────────────────────────────────

function AggregateCharts({ responses }: { responses: any[] }) {
  const total = responses.length;

  const effectsData = useMemo(() => {
    const c: Record<string, number> = {};
    responses.forEach(r => (r.top_effects || []).forEach((e: string) => { c[e] = (c[e] ?? 0) + 1; }));
    return Object.entries(c)
      .map(([name, count]) => ({ name: EFFECT_LABELS[name] ?? name, count }))
      .sort((a, b) => b.count - a.count);
  }, [responses]);

  const actorsData = useMemo(() => {
    const c: Record<string, number> = {};
    responses.forEach(r => (r.relevant_actors || []).forEach((a: string) => { c[a] = (c[a] ?? 0) + 1; }));
    return Object.entries(c).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count);
  }, [responses]);

  const relevanceData = useMemo(() => {
    return RELEVANCE_LABELS.map(({ key, label }) => {
      const vals = responses.map(r => (r as any)[key]).filter((v: any) => v !== null && v !== undefined);
      const avg = vals.length ? vals.reduce((s: number, v: number) => s + v, 0) / vals.length : 0;
      return { label, avg: +avg.toFixed(2), fullMark: 5 };
    });
  }, [responses]);

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">¿Qué efectos preocupan más?</CardTitle>
            <CardDescription>Total de menciones · {total} participantes</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={effectsData} layout="vertical" margin={{ left: 8, right: 24 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis type="number" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={110} axisLine={false} tickLine={false} />
                <Tooltip formatter={(v) => [`${v} menciones`, ""]} contentStyle={{ borderRadius: 10, fontSize: 13 }} />
                <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                  {effectsData.map((_, i) => <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">¿Quién debe actuar?</CardTitle>
            <CardDescription>Actores señalados por los participantes</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={actorsData} margin={{ left: 8, right: 24 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip formatter={(v) => [`${v} votos`, ""]} contentStyle={{ borderRadius: 10, fontSize: 13 }} />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {actorsData.map((_, i) => <Cell key={i} fill={BAR_COLORS[(i + 3) % BAR_COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">¿Qué ejes son más relevantes?</CardTitle>
          <CardDescription>Puntuación media (1–5) entre todos los participantes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row gap-6 items-center">
            <div className="w-full max-w-sm mx-auto lg:mx-0">
              <ResponsiveContainer width="100%" height={260}>
                <RadarChart data={relevanceData} outerRadius={100}>
                  <PolarGrid stroke="#cbd5e1" />
                  <PolarAngleAxis dataKey="label" tick={{ fontSize: 11, fill: "#475569" }} />
                  <PolarRadiusAxis angle={90} domain={[0, 5]} tick={{ fontSize: 9 }} tickCount={6} />
                  <Radar name="Media" dataKey="avg" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.25} strokeWidth={2.5} />
                  <Tooltip formatter={(v) => [`${v} / 5`, "Media"]} contentStyle={{ borderRadius: 10, fontSize: 13 }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-3 w-full lg:max-w-sm">
              {relevanceData.map(({ label, avg }) => (
                <div key={label} className="rounded-lg border bg-slate-50 dark:bg-slate-900/60 p-3">
                  <p className="text-xs text-muted-foreground leading-tight">{label}</p>
                  <p className="text-xl font-bold mt-1">{avg}<span className="text-xs font-normal text-muted-foreground">/5</span></p>
                  <div className="mt-1.5 h-1.5 rounded-full bg-muted overflow-hidden">
                    <div className="h-full rounded-full bg-blue-500" style={{ width: `${(avg / 5) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ── Per-response summary card ─────────────────────────────────────────────────

function ResponseSummaryCard({ r, index, total }: { r: any; index: number; total: number }) {
  const [open, setOpen] = useState(false);
  const hasRelevance = RELEVANCE_LABELS.some(({ key }) => (r as any)[key] !== null && (r as any)[key] !== undefined);

  return (
    <div className="rounded-xl border bg-white dark:bg-slate-900/60 overflow-hidden">
      {/* Summary — always visible */}
      <div className="p-4 space-y-3">

        {/* Row: number + timestamp */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-muted-foreground">Participante #{total - index}</span>
          <span className="text-xs text-muted-foreground">{format(new Date(r.created_at), "HH:mm · d MMM", { locale: es })}</span>
        </div>

        {/* Q1: Effects */}
        {(r.top_effects || []).length > 0 && (
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">
              Efectos más preocupantes
            </p>
            <div className="flex flex-wrap gap-1">
              {(r.top_effects || []).map((e: string) => (
                <span key={e} className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border ${EFFECT_COLORS[e] ?? "bg-slate-100 text-slate-700 border-slate-200"}`}>
                  {e}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Q2: Relevance mini-bars */}
        {hasRelevance && (
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground mb-2">
              Relevancia de ejes (1–5)
            </p>
            <div className="grid grid-cols-2 gap-x-6 gap-y-1.5">
              {RELEVANCE_LABELS.map(({ key, short }) => {
                const val = (r as any)[key];
                if (val === null || val === undefined) return null;
                const color = val >= 4 ? "bg-blue-500" : val >= 3 ? "bg-amber-400" : "bg-slate-300";
                return (
                  <div key={key} className="flex items-center gap-2 text-xs">
                    <span className="w-16 shrink-0 text-muted-foreground truncate">{short}</span>
                    <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                      <div className={`h-full rounded-full ${color}`} style={{ width: `${(val / 5) * 100}%` }} />
                    </div>
                    <span className="w-4 text-right font-semibold">{val}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Q4: Actors */}
        {(r.relevant_actors || []).length > 0 && (
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">
              Actores responsables
            </p>
            <div className="flex flex-wrap gap-1">
              {(r.relevant_actors || []).map((a: string) => (
                <Badge key={a} variant="outline" className="text-xs py-0">{a}</Badge>
              ))}
            </div>
          </div>
        )}

        {/* Q3: Proposal (always shown if exists) */}
        {r.proposal_idea && (
          <div className="rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800/30 p-3">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-amber-600 dark:text-amber-400 mb-1 flex items-center gap-1">
              <Lightbulb className="h-3 w-3" /> Propuesta
            </p>
            <p className="text-sm leading-relaxed">{r.proposal_idea}</p>
          </div>
        )}

        {/* Q5: Good practice — behind toggle */}
        {r.good_practices && (
          <button
            onClick={() => setOpen(o => !o)}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <Star className="h-3 w-3 text-emerald-500" />
            Buena práctica de referencia
            {open ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          </button>
        )}

        {open && r.good_practices && (
          <div className="rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/30 p-3">
            <p className="text-sm text-muted-foreground leading-relaxed">{r.good_practices}</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function Responses() {
  const { data: responses = [], isLoading } = useFormResponses();
  const total = responses.length;

  const withProposal = useMemo(() => responses.filter(r => r.proposal_idea?.trim()).length, [responses]);

  if (isLoading) return (
    <div className="container py-8 space-y-4">
      <Skeleton className="h-8 w-48" />
      {[1, 2, 3].map(i => <Skeleton key={i} className="h-48 w-full" />)}
    </div>
  );

  if (total === 0) return (
    <div className="container py-8">
      <h1 className="text-2xl font-semibold tracking-tight mb-1">Respuestas</h1>
      <p className="text-sm text-muted-foreground mb-12">Workshop Canodrom</p>
      <div className="flex flex-col items-center justify-center py-24 gap-3 text-center">
        <Users className="h-12 w-12 text-muted-foreground/30" />
        <p className="text-lg font-medium text-muted-foreground">Sin respuestas aún</p>
      </div>
    </div>
  );

  return (
    <div className="container py-8 space-y-12">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Respuestas</h1>
          <p className="mt-1 text-sm text-muted-foreground">Workshop Canodrom · Turismo masivo en Barcelona</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm">
            <Users className="h-3.5 w-3.5 text-blue-500" />
            <span className="font-semibold">{total}</span>
            <span className="text-muted-foreground">participantes</span>
          </div>
          <div className="flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm">
            <Lightbulb className="h-3.5 w-3.5 text-amber-500" />
            <span className="font-semibold">{withProposal}</span>
            <span className="text-muted-foreground">propuestas</span>
          </div>
        </div>
      </div>

      {/* ── Sección 1: Resumen agregado ── */}
      <section>
        <div className="flex items-center gap-2 mb-5">
          <BarChart2 className="h-4 w-4 text-muted-foreground" />
          <h2 className="text-base font-semibold">Resumen global</h2>
        </div>
        <AggregateCharts responses={responses} />
      </section>

      <div className="border-t" />

      {/* ── Sección 2: Una card por participante ── */}
      <section>
        <div className="flex items-center gap-2 mb-5">
          <List className="h-4 w-4 text-muted-foreground" />
          <h2 className="text-base font-semibold">Respuesta de cada participante</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {responses.map((r, i) => (
            <ResponseSummaryCard key={r.id} r={r} index={i} total={total} />
          ))}
        </div>
      </section>

    </div>
  );
}
