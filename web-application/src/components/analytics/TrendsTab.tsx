"use client";

import { useMemo } from "react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  Tooltip as ReTooltip, ResponsiveContainer, Cell, CartesianGrid
} from "recharts";
import { ChartCard } from "./shared/ChartCard";
import { StatCard } from "./shared/StatCard";
import { TrendingUp, CalendarDays, Zap } from "lucide-react";
import { format, startOfMonth, differenceInCalendarDays } from "date-fns";
import type { Application } from "@/lib/types";

interface Props {
  applications: Application[];
}

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const DAY_COLORS = ["#3b82f6", "#6366f1", "#8b5cf6", "#a855f7", "#22d3ee", "#34d399", "#f59e0b"];

const tooltipStyle = {
  contentStyle: { background: "#0d1120", border: "1px solid #1e2d45", borderRadius: "10px", color: "#e2e8f0", fontSize: 13 },
  cursor: { fill: "rgba(255,255,255,0.04)" },
};

export function TrendsTab({ applications }: Props) {
  const active = applications.filter((a) => !a.archived);

  const monthlyData = useMemo(() => {
    const map: Record<string, number> = {};
    active.forEach((a) => {
      const key = format(startOfMonth(a.appliedAt), "MMM yyyy");
      map[key] = (map[key] ?? 0) + 1;
    });
    return Object.entries(map)
      .map(([month, count]) => ({ month, count }))
      .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime());
  }, [active]);

  const dayOfWeekData = useMemo(() => {
    const counts = Array(7).fill(0);
    active.forEach((a) => counts[a.appliedAt.getDay()]++);
    return DAYS.map((day, i) => ({ day, count: counts[i] }));
  }, [active]);

  const busiestDay = dayOfWeekData.reduce((a, b) => (b.count > a.count ? b : a), { day: "—", count: 0 });

  const peakMonth = monthlyData.reduce((a, b) => (b.count > a.count ? b : a), { month: "—", count: 0 });

  const avgPerMonth = monthlyData.length
    ? Math.round(active.length / monthlyData.length)
    : 0;

  const streak = useMemo(() => {
    if (active.length < 2) return 0;
    const sorted = [...active].sort((a, b) => b.appliedAt.getTime() - a.appliedAt.getTime());
    let max = 1, cur = 1;
    for (let i = 1; i < sorted.length; i++) {
      const diff = differenceInCalendarDays(sorted[i - 1].appliedAt, sorted[i].appliedAt);
      if (diff <= 1) { cur++; max = Math.max(max, cur); } else cur = 1;
    }
    return max;
  }, [active]);

  return (
    <div className="space-y-6">
      {/* KPI row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Peak Month" value={peakMonth.month} icon={TrendingUp} sub={`${peakMonth.count} applications`} iconColor="text-blue-400" iconBg="bg-blue-500/10 border-blue-500/20" />
        <StatCard label="Avg / Month" value={avgPerMonth} icon={CalendarDays} sub={`over ${monthlyData.length} months`} iconColor="text-indigo-400" iconBg="bg-indigo-500/10 border-indigo-500/20" />
        <StatCard label="Busiest Day" value={busiestDay.day} icon={Zap} sub={`${busiestDay.count} applications`} iconColor="text-amber-400" iconBg="bg-amber-500/10 border-amber-500/20" />
        <StatCard label="Best Streak" value={streak} icon={TrendingUp} sub="consecutive days applied" iconColor="text-emerald-400" iconBg="bg-emerald-500/10 border-emerald-500/20" />
      </div>

      {/* Monthly trend */}
      <ChartCard title="Applications Over Time" sub="Monthly application volume">
        {monthlyData.length === 0 ? (
          <div className="h-[260px] flex items-center justify-center text-sm text-slate-400">No data yet</div>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={monthlyData}>
              <defs>
                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e2d45" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
              <ReTooltip {...tooltipStyle} />
              <Area type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={2} fill="url(#areaGrad)" dot={{ fill: "#3b82f6", r: 4 }} activeDot={{ r: 6 }} name="Applications" />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </ChartCard>

      {/* Day of week */}
      <ChartCard title="Activity by Day of Week" sub="Which days you apply most">
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={dayOfWeekData} barSize={32}>
            <XAxis dataKey="day" tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
            <ReTooltip {...tooltipStyle} />
            <Bar dataKey="count" radius={[6, 6, 0, 0]} name="Applications">
              {dayOfWeekData.map((_, i) => (
                <Cell key={i} fill={DAY_COLORS[i % DAY_COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}
