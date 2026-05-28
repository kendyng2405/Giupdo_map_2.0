import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.routes.js';
import locationRoutes from './routes/location.routes.js';
import userRoutes from './routes/user.routes.js';
import suggestionRoutes from './routes/suggestion.routes.js';
import notificationRoutes from './routes/notification.routes.js';
import contactRoutes from './routes/contact.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: '*' }));
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
