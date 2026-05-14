import * as functions from 'firebase-functions/v2';
import * as admin from 'firebase-admin';

admin.initializeApp();

const db = admin.firestore();

export const processScheduledMessages = functions.scheduler.onSchedule('every 1 minutes', async (event) => {
  const now = new Date().toISOString();
  
  try {
    const snapshot = await db.collection('messages')
      .where('status', '==', 'scheduled')
      .where('scheduledFor', '<=', now)
      .get();

    if (snapshot.empty) {
      console.log('No scheduled messages to send at this time.');
      return;
    }

    const batch = db.batch();
    
    snapshot.docs.forEach(doc => {
      batch.update(doc.ref, { 
        status: 'sent',
        sentAt: now
      });
      console.log(`Marking message ${doc.id} as sent.`);
    });

    await batch.commit();
    console.log(`Successfully processed ${snapshot.size} scheduled messages.`);
    
  } catch (error) {
    console.error('Error processing scheduled messages:', error);
  }
});
