import type { LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: LucideIcon;
}

const metricThemes = [
  {
    card: "border-cyan-200/80 bg-gradient-to-br from-white via-cyan-50/80 to-slate-50 dark:border-cyan-900/60 dark:from-slate-900 dark:via-cyan-950/20 dark:to-slate-950",
    iconWrap: "bg-cyan-500/12 text-cyan-800 dark:bg-cyan-400/15 dark:text-cyan-300",
  },
  {
    card: "border-teal-200/80 bg-gradient-to-br from-white via-teal-50/80 to-slate-50 dark:border-teal-900/60 dark:from-slate-900 dark:via-teal-950/20 dark:to-slate-950",
    iconWrap: "bg-teal-500/12 text-teal-800 dark:bg-teal-400/15 dark:text-teal-300",
  },
  {
    card: "border-amber-200/80 bg-gradient-to-br from-white via-amber-50/75 to-stone-50 dark:border-amber-900/60 dark:from-slate-900 dark:via-amber-950/20 dark:to-slate-950",
    iconWrap: "bg-amber-500/12 text-amber-800 dark:bg-amber-400/15 dark:text-amber-300",
  },
  {
    card: "border-indigo-200/80 bg-gradient-to-br from-white via-indigo-50/80 to-slate-50 dark:border-indigo-900/60 dark:from-slate-900 dark:via-indigo-950/20 dark:to-slate-950",
    iconWrap: "bg-indigo-500/12 text-indigo-800 dark:bg-indigo-400/15 dark:text-indigo-300",
  },
  {
    card: "border-rose-200/80 bg-gradient-to-br from-white via-rose-50/75 to-stone-50 dark:border-rose-900/60 dark:from-slate-900 dark:via-rose-950/20 dark:to-slate-950",
    iconWrap: "bg-rose-500/12 text-rose-800 dark:bg-rose-400/15 dark:text-rose-300",
  },
  {
    card: "border-slate-200/80 bg-gradient-to-br from-white via-slate-50 to-cyan-50/40 dark:border-slate-800 dark:from-slate-900 dark:via-slate-900 dark:to-cyan-950/15",
    iconWrap: "bg-slate-500/12 text-slate-700 dark:bg-slate-400/15 dark:text-slate-300",
  },
];

export default function MetricCard({ title, value, subtitle, icon: Icon }: MetricCardProps) {
  const theme = metricThemes[title.length % metricThemes.length];

  return (
    <div className={`rounded-2xl border p-6 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-md ${theme.card}`}>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="font-mono-tabular text-3xl font-semibold tracking-tight text-foreground">{value}</p>
          {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
        </div>
        <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${theme.iconWrap}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}
