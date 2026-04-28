"use client";

import { useMemo, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip as ReTooltip, ResponsiveContainer, Cell } from "recharts";
import { ChartCard } from "./shared/ChartCard";
import { AppListTable } from "./shared/AppListTable";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import {
  STATUS_LABELS, CHANNEL_LABELS, APPLY_TYPE_LABELS,
  type Application, type ApplicationStatus, type Timeline
} from "@/lib/types";
import { Loader2 } from "lucide-react";

interface Props {
  applications: Application[];
  timelines: Timeline[];
  loading: boolean;
}

const CHANNEL_COLORS = ["#3b82f6", "#6366f1", "#94a3b8", "#f59e0b"];
const TYPE_COLORS = ["#22d3ee", "#34d399", "#f59e0b", "#94a3b8"];

const tooltipStyle = {
  contentStyle: { background: "#0d1120", border: "1px solid #1e2d45", borderRadius: "10px", color: "#e2e8f0", fontSize: 13 },
  labelStyle: { color: "#e2e8f0", fontWeight: 600, marginBottom: 2 },
  itemStyle: { color: "#94a3b8" },
  cursor: { fill: "rgba(255,255,255,0.04)" },
};

export function TimelineInsightsTab({ applications, timelines, loading }: Props) {
  const [selectedStatus, setSelectedStatus] = useState<ApplicationStatus | "all">("all");

  const matchingApps = useMemo(() => {
    if (selectedStatus === "all") return applications;
    const appIds = new Set(
      timelines
        .filter((t) => t.statusUpdate === selectedStatus)
        .map((t) => t.applicationId)
    );
    return applications.filter((a) => appIds.has(a.id));
  }, [applications, timelines, selectedStatus]);

  const channelData = useMemo(() => {
    const map: Record<string, number> = {};
    matchingApps.forEach((a) => {
      const key = a.channel === "other" && a.channelOther ? a.channelOther : CHANNEL_LABELS[a.channel];
      map[key] = (map[key] ?? 0) + 1;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  }, [matchingApps]);

  const applyTypeData = useMemo(() => {
    const map: Record<string, number> = {};
    matchingApps.forEach((a) => {
      const key = a.applyType === "other" && a.applyTypeOther ? a.applyTypeOther : APPLY_TYPE_LABELS[a.applyType];
      map[key] = (map[key] ?? 0) + 1;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  }, [matchingApps]);

  return (
    <div className="space-y-6">
      {/* Filter */}
      <div className="flex items-center gap-4 flex-wrap">
        <div>
          <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            Filter by timeline status event
          </p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mb-3">
            Find applications that ever had a specific status in their timeline history
          </p>
        </div>
        <Select value={selectedStatus} onValueChange={(v) => setSelectedStatus(v as ApplicationStatus | "all")}>
          <SelectTrigger className="w-52 h-10">
            <SelectValue placeholder="All timeline statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Applications</SelectItem>
            {(Object.keys(STATUS_LABELS) as ApplicationStatus[]).map((s) => (
              <SelectItem key={s} value={s}>{STATUS_LABELS[s]}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {loading && <Loader2 className="h-4 w-4 animate-spin text-slate-400" />}
      </div>

      {/* Summary */}
      <div className="flex items-center gap-2 px-4 py-3 rounded-lg border border-slate-200 bg-slate-50 dark:border-[#1e2d45] dark:bg-[#0b0e1a]">
        <span className="text-sm text-slate-500 dark:text-slate-400">
          {selectedStatus === "all"
            ? `Showing all ${matchingApps.length} applications`
            : `${matchingApps.length} application${matchingApps.length !== 1 ? "s" : ""} ever had status `}
        </span>
        {selectedStatus !== "all" && (
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
            "{STATUS_LABELS[selectedStatus]}"
          </span>
        )}
        <span className="text-sm text-slate-400 dark:text-slate-500">
          {selectedStatus !== "all" && `in their timeline`}
        </span>
      </div>

      {/* Channel + Type breakdown for filtered set */}
      {matchingApps.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <ChartCard title="Channel Distribution" sub="Where these applications came from">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={channelData} barSize={28} layout="vertical">
                <XAxis type="number" tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
                <YAxis type="category" dataKey="name" tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} tickLine={false} width={90} />
                <ReTooltip {...tooltipStyle} />
                <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                  {channelData.map((_, i) => <Cell key={i} fill={CHANNEL_COLORS[i % CHANNEL_COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Apply Type Distribution" sub="How these applications were submitted">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={applyTypeData} barSize={28} layout="vertical">
                <XAxis type="number" tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
                <YAxis type="category" dataKey="name" tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} tickLine={false} width={110} />
                <ReTooltip {...tooltipStyle} />
                <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                  {applyTypeData.map((_, i) => <Cell key={i} fill={TYPE_COLORS[i % TYPE_COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      )}

      {/* Application list */}
      <ChartCard
        title={selectedStatus === "all" ? "All Applications" : `Applications with "${STATUS_LABELS[selectedStatus]}" in Timeline`}
        sub={`${matchingApps.length} result${matchingApps.length !== 1 ? "s" : ""}`}
      >
        <AppListTable
          applications={matchingApps}
          emptyMessage={`No applications ever had "${selectedStatus !== "all" ? STATUS_LABELS[selectedStatus] : ""}" status in their timeline.`}
        />
      </ChartCard>
    </div>
  );
}
