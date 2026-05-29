import admin from 'firebase-admin';

// Khởi tạo Firebase Admin SDK
// Hỗ trợ 3 cách:
// 1. GOOGLE_APPLICATION_CREDENTIALS env var (path to service account JSON file)
// 2. FIREBASE_SERVICE_ACCOUNT env var (JSON string of service account, for cloud deploy)
// 3. Fallback: chỉ dùng projectId (hoạt động với local emulator)

let credential;

if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  // Parse JSON string từ environment variable (dùng trên Render, Vercel, etc.)
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  credential = admin.credential.cert(serviceAccount);
} else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  // Sử dụng file path (local dev)
  credential = admin.credential.applicationDefault();
}

const appConfig = {
  projectId: process.env.FIREBASE_PROJECT_ID || 'kdhelpmap',
};

if (credential) {
  appConfig.credential = credential;
}

// Thêm storage bucket nếu có
if (process.env.FIREBASE_STORAGE_BUCKET) {
  appConfig.storageBucket = process.env.FIREBASE_STORAGE_BUCKET;
}

admin.initializeApp(appConfig);

const db = admin.firestore();
const auth = admin.auth();
const storage = admin.storage();

export { admin, db, auth, storage };
