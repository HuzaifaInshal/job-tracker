'use client';

import { useEffect, useState } from 'react';
import { subscribeToTimelines } from '@/lib/firestore';
import type { Timeline } from '@/lib/types';

export function useTimelines(applicationId: string | null) {
  const [timelines, setTimelines] = useState<Timeline[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!applicationId) {
      setTimelines([]);
      return;
    }
    setLoading(true);
    const unsub = subscribeToTimelines(applicationId, (t) => {
      setTimelines(t);
      setLoading(false);
    });
    return unsub;
  }, [applicationId]);

  return { timelines, loading };
}
