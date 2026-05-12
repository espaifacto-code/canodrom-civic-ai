import { useMemo, useState } from "react";
import { useCivicRecords } from "@/hooks/useCivicRecords";
import MetricCard from "@/components/dashboard/MetricCard";
import StatusBadge from "@/components/dashboard/StatusBadge";
import ManualTrigger from "@/components/dashboard/ManualTrigger";
import { Users, CheckCircle, TrendingUp, Gauge, ArrowUpDown, Activity, Clock, Target, AlertTriangle, Play, QrCode, ExternalLink } from "lucide-react";
import { format, subDays, isWithinInterval } from "date-fns";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  LineChart, Line, AreaChart, Area, ComposedChart,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

export default function Dashboard() {
  const { data: records = [], isLoading, refetch } = useCivicRecords();
  const [sortKey, setSortKey] = useState<"created_at" | "avg_social_impact">("created_at");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const metrics = useMemo(() => {
    if (!records.length) return null;
    const total = records.length;
    const approved = records.filter((r) => r.approved).length;
    const avgSocial = records.reduce((s, r) => s + (r.avg_social_impact ?? 0), 0) / total;
    const avgFeasibility = records.reduce((s, r) => s + (r.avg_feasibility ?? 0), 0) / total;
    const avgInclusivity = records.reduce((s, r) => s + (r.avg_inclusivity ?? 0), 0) / total;
    const avgSustainability = records.reduce((s, r) => s + (r.avg_sustainability ?? 0), 0) / total;

    // Calculate recent activity (last 7 days)
    const sevenDaysAgo = subDays(new Date(), 7);
    const recentRecords = records.filter(r => isWithinInterval(new Date(r.created_at), { start: sevenDaysAgo, end: new Date() }));

    return {
      total,
      approvalRate: ((approved / total) * 100).toFixed(1),
      avgSocial: avgSocial.toFixed(1),
      avgFeasibility: avgFeasibility.toFixed(1),
      avgInclusivity: avgInclusivity.toFixed(1),
      avgSustainability: avgSustainability.toFixed(1),
      approved,
      revision: total - approved,
      recentActivity: recentRecords.length,
    };
  }, [records]);

  // Enhanced issue categorization
  const issueData = useMemo(() => {
    const categoryMap = new Map<string, number>();

    records.forEach((record) => {
      // Use area/category stored by n8n workflow; fall back to keyword detection
      let category = record.area || (record as any).category || null;

      if (!category) {
        const issueText = (record.issue || '').toLowerCase();
        if (/(vivienda|housing|alquiler|rent|expulsión|expulsion|desahucio|habitatge)/.test(issueText)) category = 'Vivienda';
        else if (/(espacio público|espai públic|public space|plaza|placa|calle|carrer|saturaci)/.test(issueText)) category = 'Espacio Público';
        else if (/(transporte|transport|metro|bus|mobilitat|mobility|colaps)/.test(issueText)) category = 'Transporte';
        else if (/(identidad|identitat|identity|alma|historia|barrio|barri|cultura|patrimoni)/.test(issueText)) category = 'Identidad';
        else if (/(comercio|comerç|commerce|tienda|botiga|local|negoci|restaurant)/.test(issueText)) category = 'Comercio Local';
        else if (/(ruido|soroll|noise|descanso|convivencia|convivència)/.test(issueText)) category = 'Ruido';
        else if (/(limpieza|neteja|clean|residuos|residus|basura|brossa|civisme)/.test(issueText)) category = 'Limpieza';
        else if (/(derecho a la ciudad|dret a la ciutat|right to the city|turista|tourist|turismo|turisme)/.test(issueText)) category = 'Derecho a la Ciudad';
        else if (/(recursos|recursos|water|agua|aigüa|energía|energia|mediambiental|ambiental)/.test(issueText)) category = 'Recursos';
        else if (/(trabajo|treball|work|empleo|feina|precari)/.test(issueText)) category = 'Trabajo';
        else category = 'Otros';
      }

      categoryMap.set(category, (categoryMap.get(category) ?? 0) + 1);
    });

    return Array.from(categoryMap, ([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8); // Top 8 categories
  }, [records]);

  // Timeline data for activity over time
  const timelineData = useMemo(() => {
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = subDays(new Date(), 29 - i);
      return {
        date: format(date, 'MMM dd'),
        fullDate: date,
        count: 0,
      };
    });

    records.forEach((record) => {
      const recordDate = new Date(record.created_at);
      const dayIndex = last30Days.findIndex(day =>
        format(day.fullDate, 'yyyy-MM-dd') === format(recordDate, 'yyyy-MM-dd')
      );
      if (dayIndex !== -1) {
        last30Days[dayIndex].count += 1;
      }
    });

    return last30Days;
  }, [records]);

  // Impact radar data
  const impactData = useMemo(() => {
    if (!records.length) return [];
    const len = records.length;
    return [
      { metric: "Feasibility", value: +(records.reduce((s, r) => s + (r.avg_feasibility ?? 0), 0) / len).toFixed(1), fullMark: 10 },
      { metric: "Social Impact", value: +(records.reduce((s, r) => s + (r.avg_social_impact ?? 0), 0) / len).toFixed(1), fullMark: 10 },
      { metric: "Inclusivity", value: +(records.reduce((s, r) => s + (r.avg_inclusivity ?? 0), 0) / len).toFixed(1), fullMark: 10 },
      { metric: "Sustainability", value: +(records.reduce((s, r) => s + (r.avg_sustainability ?? 0), 0) / len).toFixed(1), fullMark: 10 },
    ];
  }, [records]);

  // Status distribution
  const statusData = useMemo(() => {
    const statusMap = new Map<string, number>();
    records.forEach((record) => {
      const status = record.approved ? 'Approved' : 'Under Review';
      statusMap.set(status, (statusMap.get(status) ?? 0) + 1);
    });
    return Array.from(statusMap, ([name, value]) => ({ name, value }));
  }, [records]);

  const sorted = useMemo(() => {
    return [...records].sort((a, b) => {
      const aVal = sortKey === "created_at" ? new Date(a.created_at).getTime() : (a.avg_social_impact ?? 0);
      const bVal = sortKey === "created_at" ? new Date(b.created_at).getTime() : (b.avg_social_impact ?? 0);
      return sortDir === "asc" ? aVal - bVal : bVal - aVal;
    });
  }, [records, sortKey, sortDir]);

  const toggleSort = (key: "created_at" | "avg_social_impact") => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("desc"); }
  };

  if (isLoading) return <div className="flex min-h-[50vh] items-center justify-center text-muted-foreground">Loading data…</div>;

  // Modern palette — vivid but balanced
  const COLORS = [
    "#fb923c", // orange-400  (Under Review / Environment)
    "#34d399", // emerald-400 (Approved / Mobility)
    "#818cf8", // indigo-400  (Safety)
    "#f472b6", // pink-400    (Education)
    "#38bdf8", // sky-400     (Health)
    "#fbbf24", // amber-400   (Community)
    "#a78bfa", // violet-400  (Public Space)
    "#4ade80", // green-400   (Economy)
  ];

  const ISSUE_COLORS = [
    "#14b8a6", // teal
    "#0ea5e9", // sky
    "#8b5cf6", // violet
    "#f97316", // orange
    "#eab308", // yellow
    "#ef4444", // red
    "#6366f1", // indigo
    "#22c55e", // green
  ];

  const STATUS_COLORS: Record<string, string> = {
    "Approved": "#34d399",
    "Under Review": "#fb923c",
  };

  const getStatusColor = (name: string) => STATUS_COLORS[name] ?? "#94a3b8";


  // Vertical gradient (top→bottom) for pie/area/radar charts
  const renderGradient = (id, color) => (
    <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
      <stop offset="5%" stopColor={color} stopOpacity={0.9} />
      <stop offset="95%" stopColor={color} stopOpacity={0.45} />
    </linearGradient>
  );

  // Horizontal gradient (left→right) for horizontal bar chart
  const renderBarGradient = (id, color) => (
    <linearGradient id={id} x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stopColor={color} stopOpacity={0.95} />
      <stop offset="100%" stopColor={color} stopOpacity={0.5} />
    </linearGradient>
  );

  const TALLY_URL = "https://tally.so/r/9qpyWG";
  const QR_URL = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(TALLY_URL)}&bgcolor=ffffff&color=000000&margin=8`;

  return (
    <div className="container space-y-8 py-8">

      {/* Workshop header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Workshop Canodrom — Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Turismo masivo en Barcelona · Soberanía urbana y convivencia
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {metrics ? `${metrics.total} respuesta${metrics.total !== 1 ? 's' : ''} recibida${metrics.total !== 1 ? 's' : ''}` : 'Sin respuestas aún'}
          </p>
        </div>

        {/* QR + Start row */}
        <div className="flex flex-col sm:flex-row items-start gap-4">

          {/* QR card */}
          <div className="flex items-center gap-3 rounded-xl border border-slate-200/80 bg-white/80 dark:border-slate-800 dark:bg-slate-900/60 p-3 shadow-sm">
            <img src={QR_URL} alt="QR tally form" className="w-16 h-16 rounded" />
            <div>
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <QrCode className="h-3 w-3" /> Formulario
              </p>
              <a
                href={TALLY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-500 hover:underline flex items-center gap-1 mt-0.5"
              >
                Abrir <ExternalLink className="h-2.5 w-2.5" />
              </a>
            </div>
          </div>

          {/* Start button */}
          <ManualTrigger onTriggerSuccess={() => refetch()} compact />
        </div>
      </div>

      {/* Key Metrics */}
      {metrics && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
          <MetricCard title="Total Submissions" value={String(metrics.total)} icon={Users} />
          <MetricCard title="Approval Rate" value={`${metrics.approvalRate}%`} subtitle={`${metrics.approved} approved`} icon={CheckCircle} />
          <MetricCard title="Recent Activity" value={String(metrics.recentActivity)} subtitle="last 7 days" icon={Activity} />
          <MetricCard title="Avg Social Impact" value={metrics.avgSocial} subtitle="out of 10" icon={TrendingUp} />
          <MetricCard title="Avg Feasibility" value={metrics.avgFeasibility} subtitle="out of 10" icon={Gauge} />
          <MetricCard title="Processing Queue" value={String(metrics.revision)} subtitle="under review" icon={Clock} />
        </div>
      )}

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 rounded-2xl border border-slate-200/80 bg-white/80 p-1 shadow-sm dark:border-slate-800 dark:bg-slate-900/70">
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="analytics">Respuestas</TabsTrigger>
          <TabsTrigger value="trends">Tendencias</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Issue Categories */}
            <Card className="border-slate-200/80 bg-gradient-to-br from-white via-cyan-50/25 to-slate-50 dark:border-slate-800 dark:from-slate-900 dark:via-slate-900 dark:to-cyan-950/15">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Problemáticas por categoría
                </CardTitle>
                <CardDescription>Principales preocupaciones del turismo masivo</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={issueData} layout="vertical" margin={{ left: 20, right: 20, top: 20, bottom: 20 }}>
                    <defs>
                      {ISSUE_COLORS.map((color, idx) => renderBarGradient(`bar-gradient-${idx}`, color))}
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                    <XAxis type="number" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                    <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: '#475569' }} width={100} axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{ background: '#f8fafc', borderRadius: 12, fontSize: 13, border: '1px solid #cbd5e1', boxShadow: '0 12px 28px -12px rgb(0 0 0 / 0.2)' }}
                      cursor={{ fill: '#f8fafc' }}
                    />
                    <Bar dataKey="count" radius={[0, 6, 6, 0]} isAnimationActive={true}>
                      {issueData.map((_, idx) => (
                        <Cell key={idx} fill={`url(#bar-gradient-${idx % ISSUE_COLORS.length})`} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Status Distribution */}
            <Card className="border-slate-200/80 bg-gradient-to-br from-white via-indigo-50/20 to-amber-50/20 dark:border-slate-800 dark:from-slate-900 dark:via-slate-900 dark:to-indigo-950/15">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Processing Status
                </CardTitle>
                <CardDescription>Current state of proposal reviews</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <defs>
                      {Object.entries(STATUS_COLORS).map(([name, color]) => (
                        renderGradient(`status-gradient-${name.toLowerCase().replace(/\s+/g, "-")}`, color)
                      ))}
                    </defs>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      dataKey="value"
                      paddingAngle={2}
                      isAnimationActive={true}
                    >
                      {statusData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={`url(#status-gradient-${entry.name.toLowerCase().replace(/\s+/g, "-")})`}
                        />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ background: '#f8fafc', borderRadius: 12, fontSize: 13, border: '1px solid #cbd5e1' }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex justify-center gap-4 mt-4">
                  {statusData.map((entry) => (
                    <div key={entry.name} className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: getStatusColor(entry.name) }}
                      />
                      <span className="text-sm">{entry.name}: {entry.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Impact Assessment Radar */}
          <Card className="border-slate-200/80 bg-gradient-to-br from-white via-indigo-50/20 to-cyan-50/15 dark:border-slate-800 dark:from-slate-900 dark:via-slate-900 dark:to-indigo-950/15">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Impact Assessment Overview
              </CardTitle>
              <CardDescription>Average scores across all evaluated proposals</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <RadarChart data={impactData} outerRadius={150}>
                  <PolarGrid stroke="#cbd5e1" />
                  <PolarAngleAxis dataKey="metric" tick={{ fontSize: 13, fill: '#334155' }} />
                  <PolarRadiusAxis angle={90} domain={[0, 10]} tick={{ fontSize: 11, fill: '#64748b' }} />
                  <Radar
                    name="Average Score"
                    dataKey="value"
                    stroke="#818cf8"
                    fill="#818cf8"
                    fillOpacity={0.25}
                    strokeWidth={2.5}
                  />
                  <Tooltip contentStyle={{ background: '#f8fafc', borderRadius: 12, fontSize: 13, border: '1px solid #cbd5e1' }} />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-[2fr_3fr]">
            {/* Submissions List */}
            <Card className="border-slate-200/80 bg-gradient-to-br from-white to-slate-50 dark:border-slate-800 dark:from-slate-900 dark:to-slate-900">
              <CardHeader>
                <CardTitle>Recent Submissions</CardTitle>
                <CardDescription>Click a row to inspect it</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 min-w-0">
                  {sorted.slice(0, 10).map((record) => (
                    <div
                      key={record.id}
                      onClick={() => setSelectedId(selectedId === record.id ? null : record.id)}
                      className={`flex min-w-0 items-center justify-between rounded-xl border p-3 cursor-pointer transition-all hover:bg-muted/50 ${selectedId === record.id ? 'border-cyan-300 bg-cyan-50/70 shadow-sm dark:border-cyan-700 dark:bg-cyan-950/20' : 'border-slate-200/80 dark:border-slate-800'}`}
                    >
                      <div className="flex-1 min-w-0 mr-2">
                        <p className="font-medium text-sm break-words [overflow-wrap:anywhere]">{record.issue || 'General Issue'}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs text-muted-foreground">{format(new Date(record.created_at), 'MMM dd, yyyy')}</span>
                          {record.area && <span className="text-xs text-muted-foreground">· {record.area}</span>}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Badge
                          variant="outline"
                          className={record.approved
                            ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                            : "border-amber-200 bg-amber-50 text-amber-700"}
                        >
                          {record.approved ? "Approved" : "Review"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Detail Panel — overall stats by default, full submission detail when selected */}
            <Card className="border-slate-200/80 bg-gradient-to-br from-white via-slate-50 to-amber-50/10 dark:border-slate-800 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900">
              {(() => {
                const selected = sorted.find(r => r.id === selectedId);

                if (!selected) {
                  // Default: overall processing statistics + score breakdown
                  return (
                    <>
                      <CardHeader>
                        <CardTitle>Processing Statistics</CardTitle>
                        <CardDescription>Overall breakdown across all {metrics?.total ?? 0} submissions</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        {metrics && (
                          <>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="rounded-xl border border-cyan-200/70 bg-cyan-50/60 p-4 text-center dark:border-cyan-900/60 dark:bg-cyan-950/20">
                                <p className="text-2xl font-bold">{metrics.total}</p>
                                <p className="text-xs text-muted-foreground mt-1">Total Processed</p>
                              </div>
                              <div className="rounded-xl border border-indigo-200/70 bg-indigo-50/60 p-4 text-center dark:border-indigo-900/60 dark:bg-indigo-950/20">
                                <p className="text-2xl font-bold">{metrics.approvalRate}%</p>
                                <p className="text-xs text-muted-foreground mt-1">Approval Rate</p>
                              </div>
                              <div className="rounded-xl border border-teal-200/70 bg-teal-50/60 p-4 text-center dark:border-teal-900/60 dark:bg-teal-950/20">
                                <p className="text-2xl font-bold text-green-600">{metrics.approved}</p>
                                <p className="text-xs text-muted-foreground mt-1">Approved</p>
                              </div>
                              <div className="rounded-xl border border-amber-200/70 bg-amber-50/60 p-4 text-center dark:border-amber-900/60 dark:bg-amber-950/20">
                                <p className="text-2xl font-bold text-yellow-600">{metrics.revision}</p>
                                <p className="text-xs text-muted-foreground mt-1">Under Review</p>
                              </div>
                            </div>
                            <div>
                              <p className="text-sm font-medium mb-3">Average Impact Scores</p>
                              <div className="space-y-3">
                                {[
                                  { label: 'Social Impact', value: metrics.avgSocial },
                                  { label: 'Feasibility', value: metrics.avgFeasibility },
                                  { label: 'Inclusivity', value: metrics.avgInclusivity },
                                  { label: 'Sustainability', value: metrics.avgSustainability },
                                ].map(({ label, value }) => (
                                  <div key={label} className="flex items-center gap-3">
                                    <span className="text-sm w-28 shrink-0">{label}</span>
                                    <div className="flex-1 bg-muted rounded-full h-2">
                                      <div className="h-2 rounded-full bg-gradient-to-r from-cyan-600 via-indigo-600 to-amber-600" style={{ width: `${(parseFloat(value) / 10) * 100}%` }} />
                                    </div>
                                    <span className="text-sm font-bold w-8 text-right">{value}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </>
                        )}
                        <p className="text-xs text-muted-foreground text-center">← Click a submission to inspect it</p>
                      </CardContent>
                    </>
                  );
                }

                // Selected: full submission detail
                const proposals = Array.isArray(selected.proposals) ? selected.proposals : [];
                return (
                  <>
                    <CardHeader>
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <CardTitle className="text-base leading-snug break-words [overflow-wrap:anywhere]">{selected.issue || 'General Issue'}</CardTitle>
                          <CardDescription className="mt-1 break-words [overflow-wrap:anywhere]">
                            {selected.area && <span className="mr-2">{selected.area}</span>}
                            {selected.participant && <span className="mr-2">· {selected.participant}</span>}
                            · {format(new Date(selected.created_at), 'MMM dd, yyyy')}
                          </CardDescription>
                        </div>
                        <Badge
                          variant="outline"
                          className={`shrink-0 ${selected.approved
                            ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                            : "border-amber-200 bg-amber-50 text-amber-700"}`}
                        >
                          {selected.approved ? "Approved" : "Under Review"}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-5">
                      {/* Scores */}
                      {(selected.avg_feasibility != null || selected.avg_social_impact != null) && (
                        <div>
                          <p className="text-sm font-medium mb-2">Impact Scores</p>
                          <div className="grid grid-cols-2 gap-2">
                            {[
                              { label: 'Social Impact', value: selected.avg_social_impact },
                              { label: 'Feasibility', value: selected.avg_feasibility },
                              { label: 'Inclusivity', value: selected.avg_inclusivity },
                              { label: 'Sustainability', value: selected.avg_sustainability },
                            ].map(({ label, value }) => value != null && (
                              <div key={label} className="flex items-center justify-between rounded-xl border border-slate-200/80 bg-white/80 p-3 dark:border-slate-800 dark:bg-slate-900/60">
                                <span className="text-xs text-muted-foreground">{label}</span>
                                <span className="text-sm font-bold">{value.toFixed(1)}<span className="text-xs font-normal text-muted-foreground">/10</span></span>
                              </div>
                            ))}
                          </div>
                          {selected.ethical_issues_count != null && selected.ethical_issues_count > 0 && (
                            <p className="text-xs text-yellow-600 mt-2">⚠ {selected.ethical_issues_count} ethical issue{selected.ethical_issues_count > 1 ? 's' : ''} flagged</p>
                          )}
                        </div>
                      )}

                      {/* Proposals */}
                      <div>
                        <p className="text-sm font-medium mb-2">AI-Generated Proposals ({proposals.length})</p>
                        {proposals.length === 0 ? (
                          <p className="text-sm text-muted-foreground">No proposals stored for this submission.</p>
                        ) : (
                          <div className="space-y-3 min-w-0">
                            {proposals.map((p: any, idx: number) => (
                              <div key={idx} className="space-y-1.5 min-w-0 overflow-hidden rounded-xl border border-slate-200/80 bg-white/80 p-3 dark:border-slate-800 dark:bg-slate-900/60">
                                <p className="font-semibold text-sm break-words [overflow-wrap:anywhere]">{p.title || `Proposal ${idx + 1}`}</p>
                                {p.solution && <p className="text-xs text-muted-foreground break-words [overflow-wrap:anywhere]">{p.solution}</p>}
                                {Array.isArray(p.implementation_steps) && p.implementation_steps.length > 0 && (
                                  <ul className="list-disc pl-4 space-y-0.5 mt-1">
                                    {p.implementation_steps.map((step: string, i: number) => (
                                      <li key={i} className="text-xs break-words [overflow-wrap:anywhere]">{step}</li>
                                    ))}
                                  </ul>
                                )}
                                {p.expected_impact_6m && (
                                  <p className="text-xs text-primary font-medium mt-1 break-words [overflow-wrap:anywhere]">Impact: {p.expected_impact_6m}</p>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </>
                );
              })()}
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          {/* Activity Timeline */}
          <Card className="border-slate-200/80 bg-gradient-to-br from-white via-cyan-50/20 to-slate-50 dark:border-slate-800 dark:from-slate-900 dark:via-slate-900 dark:to-cyan-950/15">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Activity Timeline
              </CardTitle>
              <CardDescription>Citizen submissions over the last 30 days</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={timelineData}>
                  <defs>
                    {renderGradient('area-gradient', '#34d399')}
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} axisLine={false} />
                  <YAxis tick={{ fontSize: 12 }} axisLine={false} />
                  <Tooltip contentStyle={{ background: '#f8fafc', borderRadius: 12, fontSize: 13, border: '1px solid #cbd5e1' }} />
                  <Area
                    type="monotone"
                    dataKey="count"
                    stroke="#34d399"
                    fill="url(#area-gradient)"
                    fillOpacity={0.6}
                    strokeWidth={2.5}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Impact Trends */}
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="border-slate-200/80 bg-gradient-to-br from-white via-amber-50/20 to-stone-50 dark:border-slate-800 dark:from-slate-900 dark:via-slate-900 dark:to-amber-950/15">
              <CardHeader>
                <CardTitle>Impact Score Distribution</CardTitle>
                <CardDescription>How proposals score across different criteria</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <ComposedChart data={impactData}>
                    <defs>
                      {renderGradient('impact-bar-gradient', '#fb923c')}
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="metric" tick={{ fontSize: 12 }} axisLine={false} />
                    <YAxis domain={[0, 10]} tick={{ fontSize: 12 }} axisLine={false} />
                    <Tooltip contentStyle={{ background: '#f8fafc', borderRadius: 12, fontSize: 13, border: '1px solid #cbd5e1' }} />
                    <Bar dataKey="value" fill="url(#impact-bar-gradient)" radius={[8, 8, 0, 0]} />
                    <Line type="monotone" dataKey="fullMark" stroke="#a3a3a3" strokeDasharray="5 5" />
                  </ComposedChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="border-slate-200/80 bg-gradient-to-br from-white via-slate-50 to-indigo-50/15 dark:border-slate-800 dark:from-slate-900 dark:via-slate-900 dark:to-indigo-950/15">
              <CardHeader>
                <CardTitle>Quality Metrics</CardTitle>
                <CardDescription>Average scores for approved proposals</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {impactData.map((item) => (
                  <div key={item.metric} className="flex items-center justify-between">
                    <span className="text-sm font-medium">{item.metric}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-muted rounded-full h-2">
                        <div
                          className="h-2 rounded-full bg-gradient-to-r from-cyan-600 via-indigo-600 to-amber-600"
                          style={{ width: `${(item.value / 10) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-bold w-8 text-right">{item.value}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

      </Tabs>
    </div>
  );
}
