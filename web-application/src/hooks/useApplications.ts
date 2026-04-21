'use client';

import { useEffect, useState } from 'react';
import { subscribeToApplications, subscribeToArchivedApplications } from '@/lib/firestore';
import type { Application } from '@/lib/types';

function useAppSubscription(
  userId: string | undefined,
  subscribe: typeof subscribeToApplications
) {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setApplications([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const unsub = subscribe(userId, (apps) => {
      setApplications(apps);
      setLoading(false);
    });
    return unsub;
  }, [userId, subscribe]);

  return { applications, loading };
}

export function useApplications(userId: string | undefined) {
  return useAppSubscription(userId, subscribeToApplications);
}

export function useArchivedApplications(userId: string | undefined) {
  return useAppSubscription(userId, subscribeToArchivedApplications);
}
