"use client";

import { useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip as ReTooltip,
  ResponsiveContainer, Cell, PieChart, Pie, Legend
} from "recharts";
import { Briefcase, CheckCircle, XCircle, Clock, Archive } from "lucide-react";
import { StatCard } from "./shared/StatCard";
import { ChartCard } from "./shared/ChartCard";
import {
  STATUS_LABELS, CHANNEL_LABELS, APPLY_TYPE_LABELS,
  STATUS_COLORS, type Application, type ApplicationStatus
} from "@/lib/types";

interface Props {
  applications: Application[];
  allApplications: Application[]; // includes archived
}

const STATUS_HEX: Record<ApplicationStatus, string> = {
  pending: "#f59e0b",
  accepted: "#34d399",
  rejected: "#f87171",
  need_immediate_attention: "#fb923c",
  expired: "#94a3b8",
  disputed: "#c084fc",
  responded: "#22d3ee",
};

const CHANNEL_COLORS = ["#3b82f6", "#6366f1", "#94a3b8"];
const TYPE_COLORS = ["#22d3ee", "#34d399", "#f59e0b", "#94a3b8"];

const tooltipStyle = {
  contentStyle: {
    background: "#0d1120",
    border: "1px solid #1e2d45",
    borderRadius: "10px",
    color: "#e2e8f0",
    fontSize: 13,
  },
  labelStyle: { color: "#e2e8f0", fontWeight: 600, marginBottom: 2 },
  itemStyle: { color: "#94a3b8" },
  cursor: { fill: "rgba(255,255,255,0.04)" },
};

export function OverviewTab({ applications, allApplications }: Props) {
  const active = applications.filter((a) => !a.archived);
  const archived = allApplications.filter((a) => a.archived);
  const accepted = active.filter((a) => a.status === "accepted").length;
  const pending = active.filter((a) => a.status === "pending").length;
  const rejected = active.filter((a) => a.status === "rejected").length;
  const needAttention = active.filter((a) => a.status === "need_immediate_attention").length;

  const responseRate = active.length
    ? Math.round(
        (active.filter((a) => ["responded", "accepted", "rejected"].includes(a.status)).length /
          active.length) *
          100
      )
    : 0;

  const statusData = useMemo(
    () =>
      (Object.keys(STATUS_LABELS) as ApplicationStatus[])
        .map((s) => ({ name: STATUS_LABELS[s], value: active.filter((a) => a.status === s).length, key: s }))
        .filter((d) => d.value > 0),
    [active]
  );

  const channelData = useMemo(() => {
    const map: Record<string, number> = {};
    active.forEach((a) => {
      const key = a.channel === "other" && a.channelOther ? a.channelOther : CHANNEL_LABELS[a.channel];
      map[key] = (map[key] ?? 0) + 1;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  }, [active]);

  const applyTypeData = useMemo(() => {
    const map: Record<string, number> = {};
    active.forEach((a) => {
      const key = a.applyType === "other" && a.applyTypeOther ? a.applyTypeOther : APPLY_TYPE_LABELS[a.applyType];
      map[key] = (map[key] ?? 0) + 1;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  }, [active]);

  const postedByData = useMemo(() => [
    { name: "HR / Recruiter", value: active.filter((a) => a.postedBy === "hr").length },
    { name: "Company", value: active.filter((a) => a.postedBy === "company").length },
  ].filter((d) => d.value > 0), [active]);

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Active" value={active.length} icon={Briefcase} sub={`${archived.length} archived`} />
        <StatCard label="Accepted" value={accepted} icon={CheckCircle} iconColor="text-emerald-400" iconBg="bg-emerald-500/10 border-emerald-500/20" sub={active.length ? `${Math.round((accepted / active.length) * 100)}% success rate` : undefined} />
        <StatCard label="Pending" value={pending} icon={Clock} iconColor="text-amber-400" iconBg="bg-amber-500/10 border-amber-500/20" sub={needAttention > 0 ? `${needAttention} need attention` : undefined} />
        <StatCard label="Rejected" value={rejected} icon={XCircle} iconColor="text-red-400" iconBg="bg-red-500/10 border-red-500/20" sub={`${responseRate}% response rate`} />
      </div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ChartCard title="Status Distribution" sub="Active applications by current status">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={statusData} barSize={28}>
              <XAxis dataKey="name" tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
              <ReTooltip {...tooltipStyle} />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {statusData.map((entry) => (
                  <Cell key={entry.key} fill={STATUS_HEX[entry.key as ApplicationStatus]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Channel Breakdown" sub="Where you applied from">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={channelData} barSize={28} layout="vertical">
              <XAxis type="number" tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
              <YAxis type="category" dataKey="name" tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} tickLine={false} width={90} />
              <ReTooltip {...tooltipStyle} />
              <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                {channelData.map((_, i) => (
                  <Cell key={i} fill={CHANNEL_COLORS[i % CHANNEL_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Charts row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ChartCard title="Apply Type Breakdown" sub="How you submitted applications">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={applyTypeData} barSize={28} layout="vertical">
              <XAxis type="number" tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
              <YAxis type="category" dataKey="name" tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} tickLine={false} width={110} />
              <ReTooltip {...tooltipStyle} />
              <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                {applyTypeData.map((_, i) => (
                  <Cell key={i} fill={TYPE_COLORS[i % TYPE_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Posted By" sub="HR recruiter vs direct company postings">
          {postedByData.length === 0 ? (
            <div className="h-[220px] flex items-center justify-center text-sm text-slate-400">No data</div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={postedByData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} innerRadius={45} paddingAngle={3} label={({ name, percent }) => `${name} ${Math.round((percent ?? 0) * 100)}%`} labelLine={false}>
                  {postedByData.map((_, i) => (
                    <Cell key={i} fill={["#6366f1", "#22d3ee"][i % 2]} />
                  ))}
                </Pie>
                <Legend wrapperStyle={{ fontSize: 12, color: "#94a3b8" }} />
                <ReTooltip {...tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </ChartCard>
      </div>
    </div>
  );
}
