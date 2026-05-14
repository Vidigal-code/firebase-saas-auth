import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '@/shared/config/firebase';
import { useAppSelector } from '@/shared/hooks/redux';

export interface Connection {
  id: string;
  clientId: string;
  name: string;
}

export const useConnections = () => {
  const [connections, setConnections] = useState<Connection[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAppSelector((state) => state.user);

  useEffect(() => {
    if (!user) {
      setConnections([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'connections'),
      where('clientId', '==', user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Connection[];
      setConnections(data);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching connections:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  return { connections, loading };
};
