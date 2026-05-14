import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '@/shared/config/firebase';
import { useAppSelector } from '@/shared/hooks/redux';

export interface Contact {
  id: string;
  clientId: string;
  connectionId: string;
  name: string;
  phone: string;
}

export const useContacts = (connectionId: string) => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAppSelector((state) => state.user);

  useEffect(() => {
    if (!user || !connectionId) {
      setContacts([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'contacts'),
      where('clientId', '==', user.uid),
      where('connectionId', '==', connectionId)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Contact[];
      setContacts(data);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching contacts:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user, connectionId]);

  return { contacts, loading };
};
