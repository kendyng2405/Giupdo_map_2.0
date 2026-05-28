import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import * as userService from '../services/user.service.js';

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { uid, email, fullName, phone } = req.body;
    if (!uid || !email || !fullName) {
      return res.status(400).json({ success: false, error: 'Thiếu thông tin bắt buộc.' });
    }
    
    const newUser = await userService.create(uid, { email, fullName, phone });
    res.status(201).json({ success: true, data: newUser });
  } catch (error) {
    console.error('Lỗi khi đăng ký:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/me', requireAuth, async (req, res) => {
  try {
    const user = await userService.findById(req.user.uid);
    res.json({ success: true, data: user });
  } catch (error) {
    console.error('Lỗi khi lấy thông tin user:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
