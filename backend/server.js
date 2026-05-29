import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

import authRoutes from './routes/auth.routes.js';
import locationRoutes from './routes/location.routes.js';
import userRoutes from './routes/user.routes.js';
import suggestionRoutes from './routes/suggestion.routes.js';
import notificationRoutes from './routes/notification.routes.js';
import contactRoutes from './routes/contact.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// 1. Bảo vệ Headers khỏi các cuộc tấn công phổ biến (XSS, Clickjacking...)
app.use(helmet());

// 2. Chống DDoS và Brute-force (Giới hạn truy cập)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 phút
  max: 300, // Giới hạn mỗi IP chỉ được gửi 300 request trong 15 phút
  message: { success: false, error: 'Quá nhiều yêu cầu từ IP của bạn. Vui lòng thử lại sau 15 phút.' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', apiLimiter);

// 3. Khóa CORS (Chỉ cho phép tên miền chính thức của web truy cập vào API)
const allowedOrigins = [
  'https://giupdo-map-2-0.vercel.app',
  'http://localhost:5173',
  'http://localhost:3000'
];
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Không được phép truy cập (CORS)'));
    }
  }
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/users', userRoutes);
app.use('/api/suggestions', suggestionRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/contact', contactRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, error: 'Đã xảy ra lỗi máy chủ.' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
