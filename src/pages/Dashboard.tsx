import { useMemo } from "react";
import { useFormResponses } from "@/hooks/useFormResponses";
import ManualTrigger from "@/components/dashboard/ManualTrigger";
import { Users, QrCode, ExternalLink, FileText, Lightbulb } from "lucide-react";
import { format } from "date-fns";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  Cell,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

const TALLY_URL = "https://tally.so/r/9qpyWG";
const QR_URL = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(TALLY_URL)}&bgcolor=ffffff&color=000000&margin=8`;

const EFFECT_LABELS: Record<string, string> = {
  "Vivienda": "Vivienda",
  "Comercio local": "Comercio local",
  "Espacio público": "Espacio público",
  "Descanso": "Ruido / Descanso",
  "Transporte": "Transporte",
  "Identidad": "Identidad",
  "Limpieza": "Limpieza",
  "Recursos": "Recursos",
  "Trabajo": "Trabajo",
  "Derecho a la ciudad": "Derecho ciudad",
};

const RELEVANCE_LABELS = [
  { key: "relevance_digital_platforms",    label: "Plataformas digitales" },
  { key: "relevance_political_framework",  label: "Marco político" },
  { key: "relevance_data_transparency",    label: "Transparencia datos" },
  { key: "relevance_proximity_economy",    label: "Economía proximidad" },
  { key: "relevance_environmental_impact", label: "Impacto ambiental" },
  { key: "relevance_right_to_city",        label: "Derecho a la ciudad" },
];

const ACTOR_LABELS: Record<string, string> = {
  "Administración": "Administración",
  "Empresas": "Empresas",
  "Ciudadanía": "Ciudadanía",
  "Academia": "Academia",
};

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4", "#f97316", "#22c55e", "#ec4899", "#6366f1"];

export default function Dashboard() {
  const { data: responses = [], isLoading, refetch } = useFormResponses();

  const total = responses.length;

  const effectsData = useMemo(() => {
    const counts: Record<string, number> = {};
    responses.forEach(r => {
      (r.top_effects || []).forEach(effect => {
        counts[effect] = (counts[effect] ?? 0) + 1;
      });
    });
    return Object.entries(counts)
      .map(([name, count]) => ({ name: EFFECT_LABELS[name] ?? name, count }))
      .sort((a, b) => b.count - a.count);
  }, [responses]);

  const relevanceData = useMemo(() => {
    if (!total) return [];
    return RELEVANCE_LABELS.map(({ key, label }) => {
      const avg = responses.reduce((s, r) => s + ((r as any)[key] ?? 0), 0) / total;
      return { label, avg: +avg.toFixed(2), fullMark: 5 };
    });
  }, [responses, total]);

  const actorsData = useMemo(() => {
    const counts: Record<string, number> = {};
    responses.forEach(r => {
      (r.relevant_actors || []).forEach(actor => {
        counts[actor] = (counts[actor] ?? 0) + 1;
      });
    });
    return Object.entries(counts)
      .map(([name, count]) => ({ name: ACTOR_LABELS[name] ?? name, count }))
      .sort((a, b) => b.count - a.count);
  }, [responses]);

  const proposals = useMemo(() =>
    responses.filter(r => r.proposal_idea?.trim()),
    [responses]
  );

  if (isLoading) return (
    <div className="container py-8 space-y-6">
      <Skeleton className="h-8 w-64" />
      <div className="grid grid-cols-3 gap-4">
        {[1,2,3].map(i => <Skeleton key={i} className="h-40" />)}
      </div>
    </div>
  );

  return (
    <div className="container space-y-8 py-8">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Workshop Canodrom</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Turismo masivo en Barcelona · Soberanía urbana y convivencia
          </p>
          <div className="mt-2 flex items-center gap-2">
            <Badge variant="outline" className="text-sm px-3 py-1">
              <Users className="h-3.5 w-3.5 mr-1.5" />
              {total} respuesta{total !== 1 ? "s" : ""}
            </Badge>
            {total > 0 && (
              <Badge variant="outline" className="text-sm px-3 py-1 text-emerald-600 border-emerald-200">
                En directo
              </Badge>
            )}
          </div>
        </div>

        {/* QR + Start */}
        <div className="flex flex-col sm:flex-row items-start gap-4">
          <div className="flex items-center gap-3 rounded-xl border bg-white dark:bg-slate-900 p-3 shadow-sm">
            <img src={QR_URL} alt="QR formulario" className="w-16 h-16 rounded" />
            <div>
              <p className="text-xs font-semibold flex items-center gap-1">
                <QrCode className="h-3 w-3" /> Formulario
              </p>
              <a href={TALLY_URL} target="_blank" rel="noopener noreferrer"
                className="text-xs text-blue-500 hover:underline flex items-center gap-1 mt-0.5">
                Abrir <ExternalLink className="h-2.5 w-2.5" />
              </a>
            </div>
          </div>
          <ManualTrigger onTriggerSuccess={() => refetch()} compact />
        </div>
      </div>

      {/* Empty state */}
      {total === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-center gap-4">
          <QrCode className="h-16 w-16 text-muted-foreground/30" />
          <p className="text-lg font-medium text-muted-foreground">Esperando respuestas</p>
          <p className="text-sm text-muted-foreground max-w-xs">
            Escanea el QR o abre el formulario. Las respuestas aparecerán aquí en tiempo real.
          </p>
        </div>
      )}

      {total > 0 && (
        <>
          {/* Fila 1: Efectos + Actores */}
          <div className="grid gap-6 lg:grid-cols-2">

            {/* Efectos más preocupantes */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">¿Qué efectos preocupan más?</CardTitle>
                <CardDescription>Top 3 por participante · total de menciones</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={effectsData} layout="vertical" margin={{ left: 8, right: 24 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis type="number" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                    <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={120} axisLine={false} tickLine={false} />
                    <Tooltip
                      formatter={(v) => [`${v} menciones`, ""]}
                      contentStyle={{ borderRadius: 10, fontSize: 13 }}
                    />
                    <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                      {effectsData.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Actores relevantes */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">¿Quién debe actuar?</CardTitle>
                <CardDescription>Actores más señalados por los participantes</CardDescription>
              </CardHeader>
              <CardContent>
                {actorsData.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-8 text-center">Sin datos aún</p>
                ) : (
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={actorsData} margin={{ left: 8, right: 24 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="name" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                      <Tooltip
                        formatter={(v) => [`${v} votos`, ""]}
                        contentStyle={{ borderRadius: 10, fontSize: 13 }}
                      />
                      <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                        {actorsData.map((_, i) => (
                          <Cell key={i} fill={COLORS[(i + 4) % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Fila 2: Radar relevancia */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">¿Qué ejes son más relevantes para resolver el problema?</CardTitle>
              <CardDescription>Puntuación media (1 = poco relevante · 5 = totalmente relevante)</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={320}>
                <RadarChart data={relevanceData} outerRadius={120}>
                  <PolarGrid stroke="#cbd5e1" />
                  <PolarAngleAxis dataKey="label" tick={{ fontSize: 12, fill: "#475569" }} />
                  <PolarRadiusAxis angle={90} domain={[0, 5]} tick={{ fontSize: 10 }} tickCount={6} />
                  <Radar
                    name="Media"
                    dataKey="avg"
                    stroke="#3b82f6"
                    fill="#3b82f6"
                    fillOpacity={0.25}
                    strokeWidth={2.5}
                  />
                  <Tooltip
                    formatter={(v) => [`${v} / 5`, "Media"]}
                    contentStyle={{ borderRadius: 10, fontSize: 13 }}
                  />
                </RadarChart>
              </ResponsiveContainer>
              {/* Scores numéricos */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
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
            </CardContent>
          </Card>

          {/* Fila 3: Propuestas abiertas */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-amber-500" />
                Propuestas de los participantes
              </CardTitle>
              <CardDescription>{proposals.length} participante{proposals.length !== 1 ? "s" : ""} han propuesto ideas</CardDescription>
            </CardHeader>
            <CardContent>
              {proposals.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4 text-center">Ningún participante ha escrito una propuesta aún</p>
              ) : (
                <div className="space-y-3">
                  {proposals.map((r, i) => (
                    <div key={r.id} className="rounded-xl border bg-white dark:bg-slate-900/60 p-4">
                      <div className="flex items-start gap-3">
                        <span className="text-xs font-bold text-muted-foreground mt-0.5 w-5 shrink-0">#{i + 1}</span>
                        <p className="text-sm leading-relaxed">{r.proposal_idea}</p>
                      </div>
                      {r.good_practices && (
                        <p className="mt-2 text-xs text-muted-foreground pl-8">
                          <span className="font-medium">Buena práctica: </span>{r.good_practices}
                        </p>
                      )}
                      <p className="mt-1.5 text-xs text-muted-foreground pl-8">
                        {format(new Date(r.created_at), "HH:mm")}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Fila 4: Lista de respuestas */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Todas las respuestas
              </CardTitle>
              <CardDescription>Orden de llegada · actualización automática</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {responses.map((r, i) => (
                  <div key={r.id} className="flex items-start justify-between rounded-lg border p-3 gap-3">
                    <div className="flex items-start gap-3 min-w-0">
                      <span className="text-xs font-bold text-muted-foreground mt-0.5 shrink-0">#{total - i}</span>
                      <div className="min-w-0">
                        <div className="flex flex-wrap gap-1 mb-1">
                          {(r.top_effects || []).map(e => (
                            <Badge key={e} variant="secondary" className="text-xs">{e}</Badge>
                          ))}
                        </div>
                        {r.proposal_idea && (
                          <p className="text-xs text-muted-foreground truncate">{r.proposal_idea}</p>
                        )}
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground shrink-0">
                      {format(new Date(r.created_at), "HH:mm")}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
