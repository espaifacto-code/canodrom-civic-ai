import { useState, useMemo, useEffect } from "react";
import { useCivicRecords } from "@/hooks/useCivicRecords";
import StatusBadge from "@/components/dashboard/StatusBadge";
import { format } from "date-fns";
import { ChevronRight, CheckCircle2, AlertTriangle, Shield, X } from "lucide-react";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer,
} from "recharts";
import type { CivicRecord, Proposal } from "@/types/civic";

export default function Explorer() {
  const { data: records = [], isLoading } = useCivicRecords();
  const [selected, setSelected] = useState<CivicRecord | null>(null);
  const [areaFilter, setAreaFilter] = useState("");
  const [issueFilter, setIssueFilter] = useState("");
  const [ethicalFilter, setEthicalFilter] = useState("");

  const areas = useMemo(() => [...new Set(records.map((r) => r.area).filter(Boolean))].sort(), [records]);
  const issues = useMemo(() => [...new Set(records.map((r) => r.issue).filter(Boolean))].sort(), [records]);

  const filtered = useMemo(() => {
    return records.filter((r) => {
      if (areaFilter && r.area !== areaFilter) return false;
      if (issueFilter && r.issue !== issueFilter) return false;
      if (ethicalFilter === "approved" && !r.approved) return false;
      if (ethicalFilter === "revision" && r.approved) return false;
      return true;
    });
  }, [records, areaFilter, issueFilter, ethicalFilter]);

  useEffect(() => {
    if (!filtered.length) {
      setSelected(null);
      return;
    }

    if (!selected || !filtered.some((record) => record.id === selected.id)) {
      setSelected(filtered[0]);
    }
  }, [filtered, selected]);

  const impactData = selected
    ? [
        { metric: "Feasibility", value: selected.avg_feasibility ?? 0 },
        { metric: "Social Impact", value: selected.avg_social_impact ?? 0 },
        { metric: "Inclusivity", value: selected.avg_inclusivity ?? 0 },
        { metric: "Sustainability", value: selected.avg_sustainability ?? 0 },
      ]
    : [];

  if (isLoading) return <div className="flex min-h-[50vh] items-center justify-center text-muted-foreground">Loading data…</div>;

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-semibold tracking-tight">Civic Proposal Explorer</h1>
      <p className="mt-1 text-sm text-muted-foreground">Browse and review AI-generated civic proposals with ethical oversight.</p>

      <div className="mt-6 flex flex-wrap gap-3">
        <select value={areaFilter} onChange={(e) => setAreaFilter(e.target.value)} className="rounded-lg border bg-card px-3 py-2 text-sm">
          <option value="">All Areas</option>
          {areas.map((a) => <option key={a} value={a!}>{a}</option>)}
        </select>
        <select value={issueFilter} onChange={(e) => setIssueFilter(e.target.value)} className="rounded-lg border bg-card px-3 py-2 text-sm">
          <option value="">All Issues</option>
          {issues.map((i) => <option key={i} value={i!}>{i}</option>)}
        </select>
        <select value={ethicalFilter} onChange={(e) => setEthicalFilter(e.target.value)} className="rounded-lg border bg-card px-3 py-2 text-sm">
          <option value="">All Statuses</option>
          <option value="approved">Approved</option>
          <option value="revision">Requires Revision</option>
        </select>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[35%_1fr]">
        {/* List — always visible */}
        <div className="space-y-2 overflow-y-auto lg:max-h-[calc(100vh-200px)]">
          {filtered.map((r) => (
            <button
              key={r.id}
              onClick={() => setSelected(r)}
              className={`w-full rounded-xl p-4 text-left shadow-card transition-all hover:-translate-y-0.5 hover:shadow-md ${
                selected?.id === r.id ? "ring-2 ring-primary bg-card" : "bg-card"
              }`}
            >
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-foreground text-sm">{r.issue ?? "Untitled civic issue"}</h3>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                <span>{r.area ?? "Uncategorized area"}</span>
                <span>·</span>
                <span>{format(new Date(r.created_at), "MMM d, yyyy")}</span>
              </div>
              <div className="mt-2"><StatusBadge status={r.status} approved={r.approved} /></div>
            </button>
          ))}
          {!filtered.length && <p className="py-12 text-center text-sm text-muted-foreground">No records match your filters.</p>}
        </div>

        {/* Detail */}
        {/* Mobile bottom sheet overlay */}
        {selected && (
          <div className="lg:hidden fixed inset-0 z-40 flex flex-col justify-end overflow-hidden">
            <div className="absolute inset-0 bg-black/40" onClick={() => setSelected(null)} />
            <div className="relative z-50 max-h-[80vh] w-screen max-w-full overflow-x-hidden overflow-y-auto rounded-t-2xl bg-background shadow-xl">
              <div className="sticky top-0 flex items-center justify-between border-b bg-background/95 backdrop-blur px-4 py-3">
                <p className="text-sm font-semibold line-clamp-2 pr-4 break-words">{selected.issue ?? "Untitled civic issue"}</p>
                <button onClick={() => setSelected(null)} className="shrink-0 rounded-lg p-1 text-muted-foreground hover:bg-secondary">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="p-4 space-y-4 w-full min-w-0">
                {/* Meta */}
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                  <span>Area: <strong className="text-foreground">{selected.area ?? "Uncategorized area"}</strong></span>
                  <span>Participant: <strong className="text-foreground">{selected.participant ?? "Anonymous"}</strong></span>
                  <span>{format(new Date(selected.created_at), "MMM d, yyyy")}</span>
                </div>

                {/* Impact scores */}
                {(selected.avg_feasibility != null || selected.avg_social_impact != null) && (
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { label: 'Social Impact', value: selected.avg_social_impact },
                      { label: 'Feasibility', value: selected.avg_feasibility },
                      { label: 'Inclusivity', value: selected.avg_inclusivity },
                      { label: 'Sustainability', value: selected.avg_sustainability },
                    ].map(({ label, value }) => value != null && (
                      <div key={label} className="flex items-center justify-between rounded-lg border p-2">
                        <span className="text-xs text-muted-foreground">{label}</span>
                        <span className="text-sm font-bold">{value.toFixed(1)}<span className="text-xs font-normal text-muted-foreground">/10</span></span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Proposals */}
                {(selected.proposals as any[] ?? []).map((p: any, i: number) => (
                  <div key={i} className="rounded-xl bg-primary/[0.03] border p-4 space-y-3 min-w-0">
                    <h3 className="font-semibold break-words">{p.title}</h3>
                    {p.solution && (
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Solution</p>
                        <p className="text-sm break-words">{p.solution}</p>
                      </div>
                    )}
                    {Array.isArray(p.implementation_steps) && p.implementation_steps.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Implementation Steps</p>
                        <ol className="space-y-1">
                          {p.implementation_steps.map((step: string, j: number) => (
                            <li key={j} className="flex gap-2 text-sm">
                              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">{j + 1}</span>
                              {step}
                            </li>
                          ))}
                        </ol>
                      </div>
                    )}
                    {Array.isArray(p.stakeholders) && p.stakeholders.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Stakeholders</p>
                        <div className="flex flex-wrap gap-1">
                          {p.stakeholders.map((s: string) => (
                            <span key={s} className="rounded-md border bg-secondary px-2 py-0.5 text-xs">{s}</span>
                          ))}
                        </div>
                      </div>
                    )}
                    {p.expected_impact_6m && (
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Expected Impact (6 months)</p>
                        <p className="text-sm text-primary font-medium break-words">{p.expected_impact_6m}</p>
                      </div>
                    )}
                  </div>
                ))}

                {!(selected.proposals as any[] ?? []).length && (
                  <div className="rounded-xl border border-dashed p-4 text-sm text-muted-foreground">
                    No proposal details are stored for this record yet.
                  </div>
                )}

                {/* Ethical review */}
                <div className={`rounded-xl p-4 ${selected.approved ? "bg-emerald-50 border border-emerald-200" : "bg-amber-50 border border-amber-200"}`}>
                  <p className={`text-sm font-semibold ${selected.approved ? "text-emerald-800" : "text-amber-800"}`}>
                    {selected.approved ? "✓ Approved by Ethical Review" : "⚠ Requires Revision"}
                  </p>
                  {selected.approved
                    ? <p className="mt-1 text-xs text-emerald-700">This proposal meets all ethical guidelines.</p>
                    : Array.isArray(selected.ethical_issues) && (selected.ethical_issues as string[]).map((issue, i) => (
                        <p key={i} className="mt-1 text-xs text-amber-700">{issue}</p>
                      ))
                  }
                </div>
              </div>
            </div>
          </div>
        )}

        {selected ? (
          <div className="space-y-6 overflow-y-auto lg:max-h-[calc(100vh-200px)] hidden lg:block">
            {/* Header */}
            <div className="rounded-xl bg-card p-6 shadow-card">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-semibold tracking-tight">{selected.issue ?? "Untitled civic issue"}</h2>
                  <div className="mt-2 flex flex-wrap gap-3 text-sm text-muted-foreground">
                    <span>Area: <strong className="text-foreground">{selected.area ?? "Uncategorized area"}</strong></span>
                    <span>Participant: <strong className="text-foreground">{selected.participant ?? "Anonymous"}</strong></span>
                    <span>Date: <strong className="font-mono-tabular text-foreground">{format(new Date(selected.created_at), "MMM d, yyyy")}</strong></span>
                  </div>
                </div>
                <button onClick={() => setSelected(null)} className="rounded-lg p-1 text-muted-foreground hover:bg-secondary lg:hidden">
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Proposals */}
              {(selected.proposals as any[] ?? []).map((p: any, i: number) => (
              <div key={i} className="rounded-xl bg-primary/[0.03] p-6 shadow-card space-y-4">
                <h3 className="text-lg font-semibold tracking-tight">{p.title}</h3>
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Problem Summary</h4>
                  <p className="mt-1 text-sm leading-relaxed">{p.problem_summary ?? p.solution ?? '—'}</p>
                </div>
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Solution</h4>
                  <p className="mt-1 text-sm leading-relaxed">{p.solution}</p>
                </div>
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Implementation Steps</h4>
                  <ol className="mt-2 space-y-1">
                    {(p.implementation_steps ?? []).map((step, j) => (
                      <li key={j} className="flex gap-3 text-sm">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">{j + 1}</span>
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Stakeholders</h4>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {(p.stakeholders ?? []).map((s) => (
                      <span key={s} className="rounded-md border bg-secondary px-2 py-0.5 text-xs font-medium">{s}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Expected Impact (6 Months)</h4>
                  <p className="mt-1 text-sm leading-relaxed">{p.expected_impact_6m}</p>
                </div>
              </div>
            ))}

            {!(selected.proposals as any[] ?? []).length && (
              <div className="rounded-xl border border-dashed bg-card p-6 text-sm text-muted-foreground shadow-card">
                No proposal details are stored for this record yet.
              </div>
            )}

            {/* Ethical Review */}
            <div className={`rounded-xl p-6 shadow-card ${selected.approved ? "bg-emerald-50 border border-emerald-200" : "bg-amber-50 border border-amber-200"}`}>
              <div className="flex items-center gap-3">
                {selected.approved ? (
                  <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                ) : (
                  <AlertTriangle className="h-6 w-6 text-amber-600" />
                )}
                <h3 className={`text-lg font-semibold ${selected.approved ? "text-emerald-800" : "text-amber-800"}`}>
                  {selected.approved ? "Approved by Ethical Review" : "Requires Revision"}
                </h3>
              </div>
              {selected.approved ? (
                <p className="mt-2 text-sm text-emerald-700">This proposal meets all ethical guidelines.</p>
              ) : (
                <div className="mt-3 space-y-2">
                  <p className="text-sm text-amber-700">{selected.ethical_issues_count ?? 0} ethical issue(s) identified:</p>
                  {Array.isArray(selected.ethical_issues) && (selected.ethical_issues as string[]).length > 0 ? (
                    (selected.ethical_issues as string[]).map((issue, i) => (
                      <div key={i} className="rounded-lg bg-amber-100/60 px-3 py-2 text-sm text-amber-800">{issue}</div>
                    ))
                  ) : (
                    <div className="rounded-lg bg-amber-100/60 px-3 py-2 text-sm text-amber-800 italic">
                      Ethical issue details not yet recorded.
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Impact Radar */}
            <div className="rounded-xl bg-card p-6 shadow-card">
              <h3 className="mb-4 text-sm font-semibold">Impact Evaluation</h3>
              <ResponsiveContainer width="100%" height={260}>
                <RadarChart data={impactData}>
                  <PolarGrid stroke="hsl(214, 32%, 91%)" />
                  <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11 }} />
                  <PolarRadiusAxis domain={[0, 10]} tick={{ fontSize: 10 }} />
                  <Radar dataKey="value" stroke="hsl(217, 91%, 60%)" fill="hsl(217, 91%, 60%)" fillOpacity={0.1} />
                </RadarChart>
              </ResponsiveContainer>
              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-muted-foreground">Feasibility:</span> <span className="font-mono-tabular font-medium">{selected.avg_feasibility?.toFixed(1)}</span></div>
                <div><span className="text-muted-foreground">Social Impact:</span> <span className="font-mono-tabular font-medium">{selected.avg_social_impact?.toFixed(1)}</span></div>
                <div><span className="text-muted-foreground">Inclusivity:</span> <span className="font-mono-tabular font-medium">{selected.avg_inclusivity?.toFixed(1)}</span></div>
                <div><span className="text-muted-foreground">Sustainability:</span> <span className="font-mono-tabular font-medium">{selected.avg_sustainability?.toFixed(1)}</span></div>
              </div>
            </div>

            {/* AI Transparency */}
            <div className="rounded-xl bg-slate-900 p-8 text-slate-200">
              <div className="flex items-center gap-2 mb-3">
                <Shield className="h-5 w-5 text-slate-400" />
                <h3 className="text-sm font-semibold">AI Transparency</h3>
              </div>
              <p className="text-sm leading-relaxed text-slate-300">
                This civic AI system generates policy proposals based on citizen input and contextual knowledge. Each proposal is evaluated by an ethical review layer and scored across impact dimensions such as feasibility, inclusivity, and sustainability.
              </p>
            </div>

            {/* Footer notice */}
            <footer className="mx-auto max-w-prose py-12 text-center text-xs text-muted-foreground">
              This platform demonstrates responsible AI-assisted civic participation. Citizen input is translated into policy proposals using AI models combined with contextual knowledge. All proposals undergo ethical review and impact scoring before being presented.
            </footer>
          </div>
        ) : (
          <div className="hidden lg:flex min-h-[300px] items-center justify-center rounded-xl bg-card text-sm text-muted-foreground shadow-card">
            Select a record to view proposal details.
          </div>
        )}
      </div>
    </div>
  );
}
