"use client";

import { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip as ReTooltip, ResponsiveContainer, Cell, FunnelChart, Funnel, LabelList } from "recharts";
import { ChartCard } from "./shared/ChartCard";
import { StatCard } from "./shared/StatCard";
import { Target, TrendingDown, MessageSquare, Timer } from "lucide-react";
import { differenceInDays } from "date-fns";
import type { Application, Timeline } from "@/lib/types";

interface Props {
  applications: Application[];
  timelines: Timeline[];
}

const FUNNEL_COLORS = ["#3b82f6", "#22d3ee", "#34d399", "#f59e0b", "#f87171"];

const tooltipStyle = {
  contentStyle: { background: "#0d1120", border: "1px solid #1e2d45", borderRadius: "10px", color: "#e2e8f0", fontSize: 13 },
  cursor: { fill: "rgba(255,255,255,0.04)" },
};

export function FunnelTab({ applications, timelines }: Props) {
  const active = applications.filter((a) => !a.archived);

  const funnelData = useMemo(() => {
    const total = active.length;
    const responded = active.filter((a) => ["responded", "accepted", "rejected", "disputed"].includes(a.status)).length;
    const interviewed = active.filter((a) => {
      const appTimelines = timelines.filter((t) => t.applicationId === a.id);
      return appTimelines.some((t) => t.title.toLowerCase().includes("call") || t.description?.toLowerCase().includes("interview"));
    }).length;
    const accepted = active.filter((a) => a.status === "accepted").length;

    return [
      { name: "Applied", value: total, fill: FUNNEL_COLORS[0] },
      { name: "Responded", value: responded, fill: FUNNEL_COLORS[1] },
      { name: "Interviewed", value: interviewed, fill: FUNNEL_COLORS[2] },
      { name: "Accepted", value: accepted, fill: FUNNEL_COLORS[4] },
    ].filter((s) => s.value > 0);
  }, [active, timelines]);

  const responseRate = active.length
    ? Math.round((active.filter((a) => ["responded", "accepted", "rejected", "disputed"].includes(a.status)).length / active.length) * 100)
    : 0;

  const rejectionRate = active.length
    ? Math.round((active.filter((a) => a.status === "rejected").length / active.length) * 100)
    : 0;

  const acceptanceRate = active.length
    ? Math.round((active.filter((a) => a.status === "accepted").length / active.length) * 100)
    : 0;

  const avgDaysToRespond = useMemo(() => {
    const responded = active.filter((a) => ["responded", "accepted", "rejected"].includes(a.status));
    if (responded.length === 0) return null;

    const diffs = responded.map((a) => {
      const firstResponse = timelines
        .filter((t) => t.applicationId === a.id && t.statusUpdate !== null)
        .sort((x, y) => x.receivedAt.getTime() - y.receivedAt.getTime())[0];
      if (!firstResponse) return null;
      return differenceInDays(firstResponse.receivedAt, a.appliedAt);
    }).filter((d): d is number => d !== null && d >= 0);

    if (diffs.length === 0) return null;
    return Math.round(diffs.reduce((a, b) => a + b, 0) / diffs.length);
  }, [active, timelines]);

  const statusCompareData = useMemo(() => {
    const statuses = ["pending", "responded", "accepted", "rejected", "need_immediate_attention", "expired", "disputed"] as const;
    return statuses.map((s) => ({
      name: s === "need_immediate_attention" ? "Attention" : s.charAt(0).toUpperCase() + s.slice(1),
      value: active.filter((a) => a.status === s).length,
    })).filter((d) => d.value > 0);
  }, [active]);

  return (
    <div className="space-y-6">
      {/* KPI row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Response Rate" value={`${responseRate}%`} icon={MessageSquare} sub="got any response" iconColor="text-cyan-400" iconBg="bg-cyan-500/10 border-cyan-500/20" />
        <StatCard label="Acceptance Rate" value={`${acceptanceRate}%`} icon={Target} sub="of all applications" iconColor="text-emerald-400" iconBg="bg-emerald-500/10 border-emerald-500/20" />
        <StatCard label="Rejection Rate" value={`${rejectionRate}%`} icon={TrendingDown} sub="of all applications" iconColor="text-red-400" iconBg="bg-red-500/10 border-red-500/20" />
        <StatCard
          label="Avg Days to Respond"
          value={avgDaysToRespond !== null ? avgDaysToRespond : "—"}
          icon={Timer}
          sub={avgDaysToRespond !== null ? "from apply to first response" : "not enough data"}
          iconColor="text-amber-400"
          iconBg="bg-amber-500/10 border-amber-500/20"
        />
      </div>

      {/* Funnel */}
      <ChartCard title="Application Funnel" sub="Conversion from applied to accepted">
        {funnelData.length === 0 ? (
          <div className="h-[280px] flex items-center justify-center text-sm text-slate-400">No data yet</div>
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <FunnelChart>
              <ReTooltip {...tooltipStyle} />
              <Funnel dataKey="value" data={funnelData} isAnimationActive>
                <LabelList position="center" fill="#fff" fontSize={13} fontWeight={600} formatter={(v: unknown) => String(v)} />
                <LabelList position="right" fill="#94a3b8" fontSize={12} dataKey="name" />
              </Funnel>
            </FunnelChart>
          </ResponsiveContainer>
        )}
      </ChartCard>

      {/* Status comparison bar */}
      <ChartCard title="Status Comparison" sub="Full breakdown of all active application statuses">
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={statusCompareData} barSize={32}>
            <XAxis dataKey="name" tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
            <ReTooltip {...tooltipStyle} />
            <Bar dataKey="value" radius={[6, 6, 0, 0]} name="Count">
              {statusCompareData.map((_, i) => (
                <Cell key={i} fill={FUNNEL_COLORS[i % FUNNEL_COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}
