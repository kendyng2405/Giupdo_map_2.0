import admin from 'firebase-admin';

// Khởi tạo Firebase Admin SDK
// Trong môi trường dev, có thể tự động lấy thông tin từ Google Cloud
// Hoặc chỉ định projectId để connect tới project cụ thể (không cần service account JSON nếu chạy local emulator hoặc cloud)
admin.initializeApp({
  projectId: 'kdhelpmap'
});

const db = admin.firestore();
const auth = admin.auth();
const storage = admin.storage();

export { admin, db, auth, storage };
