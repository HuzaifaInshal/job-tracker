import type { LucideIcon } from "lucide-react";

interface Props {
  label: string;
  value: number | string;
  sub?: string;
  icon: LucideIcon;
  iconColor?: string;
  iconBg?: string;
}

export function StatCard({ label, value, sub, icon: Icon, iconColor = "text-blue-400", iconBg = "bg-blue-500/10 border-blue-500/20" }: Props) {
  return (
    <div className="rounded-xl border p-5 border-slate-200 bg-white dark:border-[#1e2d45] dark:bg-[#0d1120]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
          <p className="text-3xl font-bold mt-1 text-slate-800 dark:text-slate-100">{value}</p>
          {sub && <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{sub}</p>}
        </div>
        <div className={`h-10 w-10 rounded-lg border flex items-center justify-center shrink-0 ${iconBg}`}>
          <Icon className={`h-5 w-5 ${iconColor}`} />
        </div>
      </div>
    </div>
  );
}
