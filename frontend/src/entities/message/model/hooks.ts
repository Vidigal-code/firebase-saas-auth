import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '@/shared/config/firebase';
import { useAppSelector } from '@/shared/hooks/redux';

export interface Message {
  id: string;
  clientId: string;
  connectionId: string;
  contactIds: string[];
  content: string;
  status: 'sent' | 'scheduled';
  scheduledFor: string | null;
  createdAt: string;
}

export const useMessages = (connectionId: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAppSelector((state) => state.user);

  useEffect(() => {
    if (!user || !connectionId) {
      setMessages([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'messages'),
      where('clientId', '==', user.uid),
      where('connectionId', '==', connectionId)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Message[];
      
      data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      
      setMessages(data);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching messages:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user, connectionId]);

  return { messages, loading };
};
