import { db } from '../config/firebase.js';

export const saveContact = async (contactData) => {
  try {
    const docRef = db.collection('contacts').doc();
    await docRef.set({
      ...contactData,
      createdAt: new Date().toISOString(),
      status: 'new'
    });
    return { id: docRef.id, ...contactData };
  } catch (error) {
    console.error('Error saving contact:', error);
    throw error;
  }
};
