import { admin, db } from '../config/firebase.js';

export const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || '';
    const idToken = authHeader.startsWith('Bearer ') ? authHeader.split('Bearer ')[1] : null;

    if (!idToken) {
      return res.status(401).json({ success: false, error: 'Chưa đăng nhập.' });
    }

    const decoded = await admin.auth().verifyIdToken(idToken);
    
    // Fetch user info from Firestore to attach to req.user
    const userDoc = await db.doc(`users/${decoded.uid}`).get();
    
    req.user = {
      uid: decoded.uid,
      email: decoded.email,
      ...userDoc.data()
    };
    
    next();
  } catch (error) {
    console.error('Lỗi xác thực:', error);
    res.status(401).json({ success: false, error: 'Token không hợp lệ hoặc đã hết hạn.' });
  }
};

export const requireAuth = [
  verifyToken,
  (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, error: 'Yêu cầu đăng nhập.' });
    }
    next();
  }
];

export const requireAdmin = [
  verifyToken,
  (req, res, next) => {
    if (!req.user || (req.user.role !== 'admin' && req.user.role !== 'founder')) {
      return res.status(403).json({ success: false, error: 'Không có quyền truy cập.' });
    }
    next();
  }
];

export const requireFounder = [
  verifyToken,
  (req, res, next) => {
    if (!req.user || req.user.role !== 'founder') {
      return res.status(403).json({ success: false, error: 'Chỉ Founder mới có quyền truy cập.' });
    }
    next();
  }
];
