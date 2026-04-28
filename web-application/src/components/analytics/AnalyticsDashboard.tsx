"use client";

import { useState, useMemo } from "react";
import { useAllTimelines } from "@/hooks/useAllTimelines";
import { useArchivedApplications } from "@/hooks/useApplications";
import { OverviewTab } from "./OverviewTab";
import { TimelineInsightsTab } from "./TimelineInsightsTab";
import { TrendsTab } from "./TrendsTab";
import { FunnelTab } from "./FunnelTab";
import { BarChart2, GitBranch, TrendingUp, Filter } from "lucide-react";
import type { Application } from "@/lib/types";

interface Props {
  applications: Application[];
  loading: boolean;
  userId: string;
}

const TABS = [
  { id: "overview", label: "Overview", icon: BarChart2 },
  { id: "timeline", label: "Timeline Insights", icon: Filter },
  { id: "trends", label: "Trends", icon: TrendingUp },
  { id: "funnel", label: "Funnel", icon: GitBranch },
] as const;

type TabId = (typeof TABS)[number]["id"];

export function AnalyticsDashboard({ applications, loading, userId }: Props) {
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const { applications: archivedApps } = useArchivedApplications(userId);

  const allApplications = useMemo(
    () => [...applications, ...archivedApps],
    [applications, archivedApps]
  );

  const appIds = useMemo(() => applications.map((a) => a.id), [applications]);
  const { timelines, loading: timelinesLoading } = useAllTimelines(appIds);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-10 w-64 rounded-lg animate-pulse bg-slate-100 dark:bg-[#111827]" />
        <div className="grid grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-28 rounded-xl animate-pulse bg-slate-100 dark:bg-[#111827]" style={{ opacity: 1 - i * 0.15 }} />
          ))}
        </div>
        <div className="grid grid-cols-2 gap-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="h-64 rounded-xl animate-pulse bg-slate-100 dark:bg-[#111827]" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Analytics</h1>
        <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">
          Insights across {applications.length} active application{applications.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Tab bar */}
      <div className="flex items-center gap-1 p-1 rounded-xl border border-slate-200 bg-slate-100 dark:border-[#1e2d45] dark:bg-[#0b0e1a] w-fit">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === id
                ? "bg-white text-slate-800 shadow-sm dark:bg-[#1e2540] dark:text-slate-100"
                : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
            }`}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === "overview" && (
        <OverviewTab applications={applications} allApplications={allApplications} />
      )}
      {activeTab === "timeline" && (
        <TimelineInsightsTab
          applications={applications}
          timelines={timelines}
          loading={timelinesLoading}
        />
      )}
      {activeTab === "trends" && <TrendsTab applications={applications} />}
      {activeTab === "funnel" && (
        <FunnelTab applications={applications} timelines={timelines} />
      )}
    </div>
  );
}
