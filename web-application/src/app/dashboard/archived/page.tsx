"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useArchivedApplications } from "@/hooks/useApplications";
import { ApplicationTable } from "@/components/dashboard/ApplicationTable";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";

export default function ArchivedPage() {
  const { user } = useAuth();
  const { applications, loading } = useArchivedApplications(user?.uid);

  return (
    <div className="flex flex-col h-screen bg-slate-50 dark:bg-[#080b12]">
      <DashboardHeader applications={applications} />
      <main className="flex-1">
        <ApplicationTable
          applications={applications}
          loading={loading}
          userId={user?.uid ?? ""}
          isArchived
        />
      </main>
    </div>
  );
}
