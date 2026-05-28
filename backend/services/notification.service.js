import { admin, db } from '../config/firebase.js';

export const create = async ({ toUid, type, title, body, link }) => {
  const notifData = {
    toUid,
    type,
    title,
    body,
    link: link || '',
    read: false,
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  };
  
  const docRef = await db.collection('notifications').add(notifData);
  return { id: docRef.id, ...notifData };
};

export const createForMany = async (uids, { type, title, body, link }) => {
  const batch = db.batch();
  
  uids.forEach(uid => {
    const notifRef = db.collection('notifications').doc();
    batch.set(notifRef, {
      toUid: uid,
      type,
      title,
      body,
      link: link || '',
      read: false,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
  });
  
  await batch.commit();
};

export const getForUser = async (uid, limit = 50) => {
  const snapshot = await db.collection('notifications')
    .where('toUid', '==', uid)
    .orderBy('createdAt', 'desc')
    .limit(limit)
    .get();
    
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const markRead = async (id) => {
  await db.collection('notifications').doc(id).update({ read: true });
};

export const markAllRead = async (uid) => {
  const snapshot = await db.collection('notifications')
    .where('toUid', '==', uid)
    .where('read', '==', false)
    .get();
    
  if (snapshot.empty) return;
  
  const batch = db.batch();
  snapshot.docs.forEach(doc => {
    batch.update(doc.ref, { read: true });
  });
  
  await batch.commit();
};

export const deleteNotification = async (id) => {
  await db.collection('notifications').doc(id).delete();
};
