import { admin, db, storage } from '../config/firebase.js';
import { uploadImage } from './location.service.js';
import * as locationService from './location.service.js';
import * as notificationService from './notification.service.js';

export const create = async (data, imageFile) => {
  const imageUrl = await uploadImage(imageFile);
  
  const sugData = {
    ...data,
    imageUrl: imageUrl || '',
    status: 'pending',
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  };
  
  if (typeof sugData.helpTypes === 'string') {
    sugData.helpTypes = sugData.helpTypes.split(',').map(s => s.trim()).filter(Boolean);
  }
  sugData.lat = Number(sugData.lat);
  sugData.lng = Number(sugData.lng);
  if (sugData.peopleCount) sugData.peopleCount = Number(sugData.peopleCount);
  
  const docRef = await db.collection('suggestions').add(sugData);
  
  // Thông báo cho admin
  const admins = await db.collection('users').where('role', 'in', ['admin', 'founder']).get();
  const adminIds = admins.docs.map(doc => doc.id);
  
  await notificationService.createForMany(adminIds, {
    type: 'suggestion_new',
    title: 'Đề xuất địa điểm mới',
    body: `${sugData.submitterName || 'Một người dùng'} vừa gửi đề xuất: ${sugData.title}`,
    link: '/admin/suggestions'
  });
  
  return { id: docRef.id, ...sugData };
};

export const findAll = async (status) => {
  let query = db.collection('suggestions').orderBy('createdAt', 'desc');
  if (status) {
    query = query.where('status', '==', status);
  }
  
  const snapshot = await query.get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const findByUserId = async (uid) => {
  const snapshot = await db.collection('suggestions')
    .where('submittedBy', '==', uid)
    .orderBy('createdAt', 'desc')
    .get();
    
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const findById = async (id) => {
  const doc = await db.collection('suggestions').doc(id).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() };
};

export const approve = async (id, reviewerUid) => {
  const docRef = db.collection('suggestions').doc(id);
  const doc = await docRef.get();
  if (!doc.exists) throw new Error('Không tìm thấy đề xuất');
  
  const data = doc.data();
  if (data.status !== 'pending') throw new Error('Đề xuất này đã được xử lý');
  
  // Cập nhật trạng thái
  await docRef.update({
    status: 'approved',
    reviewedBy: reviewerUid,
    reviewedAt: admin.firestore.FieldValue.serverTimestamp()
  });
  
  // Tạo địa điểm mới
  const locData = { ...data };
  delete locData.status;
  delete locData.submittedBy;
  delete locData.submitterName;
  
  const newLocation = await locationService.create({
    ...locData,
    createdBy: reviewerUid
  }, null); // image already uploaded and URL copied
  
  // Sửa ảnh lại từ imageUrl của suggestion (override because create normally needs file)
  await db.collection('locations').doc(newLocation.id).update({
    imageUrl: data.imageUrl
  });
  
  // Thông báo cho người đề xuất
  await notificationService.create({
    toUid: data.submittedBy,
    type: 'suggestion_approved',
    title: 'Đề xuất đã được duyệt!',
    body: `Đề xuất "${data.title}" của bạn đã được thêm lên bản đồ.`,
    link: `/home`
  });
  
  return { id, status: 'approved' };
};

export const reject = async (id, reviewerUid, reason) => {
  const docRef = db.collection('suggestions').doc(id);
  const doc = await docRef.get();
  if (!doc.exists) throw new Error('Không tìm thấy đề xuất');
  
  const data = doc.data();
  
  await docRef.update({
    status: 'rejected',
    rejectedReason: reason,
    reviewedBy: reviewerUid,
    reviewedAt: admin.firestore.FieldValue.serverTimestamp()
  });
  
  // Thông báo cho người đề xuất
  await notificationService.create({
    toUid: data.submittedBy,
    type: 'suggestion_rejected',
    title: 'Đề xuất bị từ chối',
    body: `Đề xuất "${data.title}" của bạn không được duyệt. Lý do: ${reason}`,
    link: '/profile'
  });
  
  return { id, status: 'rejected' };
};

export const deleteSuggestion = async (id) => {
  const docRef = db.collection('suggestions').doc(id);
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
