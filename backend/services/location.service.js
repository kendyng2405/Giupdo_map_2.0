import { admin, db, storage } from '../config/firebase.js';

export const uploadImage = async (file) => {
  if (!file) return null;
  const ext = file.originalname.split('.').pop();
  const fileName = `locations/${Date.now()}_${Math.random().toString(36).substring(7)}.${ext}`;
  const fileRef = storage.bucket().file(fileName);
  
  await fileRef.save(file.buffer, {
    contentType: file.mimetype,
    public: true
  });
  
  return `https://storage.googleapis.com/${storage.bucket().name}/${fileName}`;
};

export const create = async (data, imageFile) => {
  const imageUrl = await uploadImage(imageFile);
  
  const locData = {
    ...data,
    imageUrl: imageUrl || '',
    isActive: true,
    supportCount: 0,
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  };
  
  // Format arrays and numbers
  if (typeof locData.helpTypes === 'string') {
    try {
      locData.helpTypes = JSON.parse(locData.helpTypes);
    } catch(e) {
      locData.helpTypes = locData.helpTypes.split(',').map(s => s.trim()).filter(Boolean);
    }
  }
  locData.lat = Number(locData.lat);
  locData.lng = Number(locData.lng);
  if (locData.peopleCount) locData.peopleCount = Number(locData.peopleCount);
  
  const docRef = await db.collection('locations').add(locData);
  return { id: docRef.id, ...locData };
};

export const findAll = async (onlyActive = true) => {
  let query = db.collection('locations').orderBy('createdAt', 'desc');
  if (onlyActive) {
    query = query.where('isActive', '==', true);
  }
  
  const snapshot = await query.get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const findById = async (id) => {
  const doc = await db.collection('locations').doc(id).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() };
};

export const update = async (id, data, imageFile) => {
  const updateData = { ...data };
  
  if (imageFile) {
    const imageUrl = await uploadImage(imageFile);
    if (imageUrl) updateData.imageUrl = imageUrl;
  }
  
  if (typeof updateData.helpTypes === 'string') {
    try {
      updateData.helpTypes = JSON.parse(updateData.helpTypes);
    } catch(e) {
      updateData.helpTypes = updateData.helpTypes.split(',').map(s => s.trim()).filter(Boolean);
    }
  }
  if (updateData.lat) updateData.lat = Number(updateData.lat);
  if (updateData.lng) updateData.lng = Number(updateData.lng);
  if (updateData.peopleCount) updateData.peopleCount = Number(updateData.peopleCount);
  
  const docRef = db.collection('locations').doc(id);
  await docRef.update(updateData);
  
  const doc = await docRef.get();
  return { id: doc.id, ...doc.data() };
};

export const deleteLocation = async (id) => {
  const docRef = db.collection('locations').doc(id);
  const doc = await docRef.get();
  
  if (doc.exists) {
    const data = doc.data();
    if (data.imageUrl && data.imageUrl.includes('storage.googleapis.com')) {
      try {
        const url = new URL(data.imageUrl);
        const path = decodeURIComponent(url.pathname.split(`/${storage.bucket().name}/`)[1]);
        if (path) {
          await storage.bucket().file(path).delete();
        }
      } catch (e) {
        console.error('Lỗi khi xóa ảnh:', e);
      }
    }
    await docRef.delete();
  }
};

export const toggleActive = async (id, isActive) => {
  await db.collection('locations').doc(id).update({ isActive });
  return { id, isActive };
};

export const incrementSupport = async (id) => {
  await db.collection('locations').doc(id).update({
    supportCount: admin.firestore.FieldValue.increment(1)
  });
};
