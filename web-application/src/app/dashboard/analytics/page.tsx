"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useApplications } from "@/hooks/useApplications";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { AnalyticsDashboard } from "@/components/analytics/AnalyticsDashboard";

export default function AnalyticsPage() {
  const { user } = useAuth();
  const { applications, loading } = useApplications(user?.uid);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-[#080b12]">
      <DashboardHeader applications={applications} />
      <main className="flex-1 container mx-auto px-6 py-8">
        <AnalyticsDashboard applications={applications} loading={loading} userId={user?.uid ?? ""} />
      </main>
    </div>
  );
}
