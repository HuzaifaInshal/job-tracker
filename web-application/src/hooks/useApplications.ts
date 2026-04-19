'use client';

import { useEffect, useState } from 'react';
import { subscribeToApplications } from '@/lib/firestore';
import type { Application } from '@/lib/types';

export function useApplications(userId: string | undefined) {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setApplications([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const unsub = subscribeToApplications(userId, (apps) => {
      setApplications(apps);
      setLoading(false);
    });
    return unsub;
  }, [userId]);

  return { applications, loading };
}
