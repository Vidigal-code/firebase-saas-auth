import { useState, useEffect } from 'react';
import type { QueryConstraint } from 'firebase/firestore';
import { subscribeToQuery } from '@/shared/lib/firestore';

interface UseFirestoreCollectionResult<T> {
  data: T[];
  loading: boolean;
}

export const useFirestoreCollection = <T>(
  collectionName: string,
  constraints: QueryConstraint[],
  enabled: boolean,
): UseFirestoreCollectionResult<T> => {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!enabled) {
      setData([]);
      setLoading(false);
      return;
    }

    const unsubscribe = subscribeToQuery<T>(
      collectionName,
      constraints,
      (result) => {
        setData(result);
        setLoading(false);
      },
      () => {
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, [collectionName, enabled, JSON.stringify(constraints)]);

  return { data, loading };
};
