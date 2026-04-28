'use client';

import { useEffect, useState } from 'react';
import { getAllTimelinesForUser } from '@/lib/firestore';
import type { Timeline } from '@/lib/types';

export function useAllTimelines(applicationIds: string[]) {
  const [timelines, setTimelines] = useState<Timeline[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (applicationIds.length === 0) {
      setTimelines([]);
      return;
    }
    setLoading(true);
    getAllTimelinesForUser(applicationIds)
      .then(setTimelines)
      .finally(() => setLoading(false));
  }, [applicationIds.join(',')]);

  return { timelines, loading };
}
