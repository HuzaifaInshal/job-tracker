'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useApplications } from '@/hooks/useApplications';
import { ApplicationTable } from '@/components/dashboard/ApplicationTable';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';

export default function DashboardPage() {
  const { user } = useAuth();
  const { applications, loading } = useApplications(user?.uid);

  return (
    <div className="flex flex-col h-screen bg-slate-50 dark:bg-[#080b12]">
      <DashboardHeader applications={applications} />
      <main className="flex-1 overflow-hidden">
        <ApplicationTable
          applications={applications}
          loading={loading}
          userId={user?.uid ?? ''}
        />
      </main>
    </div>
  );
}
