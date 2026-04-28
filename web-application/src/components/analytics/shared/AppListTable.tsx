import { StatusBadge } from "@/components/ui/badge";
import { CHANNEL_LABELS, APPLY_TYPE_LABELS } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import type { Application } from "@/lib/types";
import { Building2 } from "lucide-react";

interface Props {
  applications: Application[];
  emptyMessage?: string;
}

export function AppListTable({ applications, emptyMessage = "No applications found." }: Props) {
  if (applications.length === 0) {
    return (
      <div className="py-10 text-center text-sm text-slate-400 dark:text-slate-500">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="overflow-auto rounded-lg border border-slate-200 dark:border-[#1e2d45]">
      <table className="w-full min-w-[600px] text-sm">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50 dark:border-[#1e2d45] dark:bg-[#0b0e1a]">
            {["Company", "Job Title", "Status", "Channel", "Apply Type", "Applied"].map((h) => (
              <th key={h} className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {applications.map((app) => (
            <tr key={app.id} className="border-b last:border-0 border-slate-100 dark:border-[#1a2035]/60 hover:bg-slate-50 dark:hover:bg-[#111827] transition-colors">
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-md flex items-center justify-center shrink-0 bg-slate-100 border border-slate-200 dark:bg-[#1e2540] dark:border-[#2a3357]">
                    <Building2 className="h-3.5 w-3.5 text-slate-400" />
                  </div>
                  <span className="font-medium text-slate-700 dark:text-slate-200 truncate max-w-[130px]">{app.companyName}</span>
                </div>
              </td>
              <td className="px-4 py-3 text-slate-500 dark:text-slate-400 truncate max-w-[150px]">{app.jobTitle}</td>
              <td className="px-4 py-3"><StatusBadge status={app.status} /></td>
              <td className="px-4 py-3 text-slate-500 dark:text-slate-400">
                {app.channel === "other" && app.channelOther ? app.channelOther : CHANNEL_LABELS[app.channel]}
              </td>
              <td className="px-4 py-3 text-slate-500 dark:text-slate-400">
                {app.applyType === "other" && app.applyTypeOther ? app.applyTypeOther : APPLY_TYPE_LABELS[app.applyType]}
              </td>
              <td className="px-4 py-3 text-slate-400 dark:text-slate-500 whitespace-nowrap">{formatDate(app.appliedAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
