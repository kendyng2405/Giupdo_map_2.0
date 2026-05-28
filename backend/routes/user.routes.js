import express from 'express';
import multer from 'multer';
import { requireAuth, requireFounder } from '../middleware/auth.js';
import * as userService from '../services/user.service.js';
import { storage } from '../config/firebase.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get('/me', requireAuth, async (req, res) => {
  try {
    const user = await userService.findById(req.user.uid);
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.put('/me', requireAuth, async (req, res) => {
  try {
    const { fullName, phone } = req.body;
    const user = await userService.updateProfile(req.user.uid, { fullName, phone });
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/me/avatar', requireAuth, upload.single('avatar'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, error: 'Chưa chọn ảnh' });
    
    const file = req.file;
    const ext = file.originalname.split('.').pop();
    const fileName = `avatars/${req.user.uid}.${ext}`;
    const fileRef = storage.bucket().file(fileName);
    
    await fileRef.save(file.buffer, {
      contentType: file.mimetype,
      public: true
    });
    
    const photoURL = `https://storage.googleapis.com/${storage.bucket().name}/${fileName}`;
    const user = await userService.update(req.user.uid, { photoURL });
    
    res.json({ success: true, data: user });
  } catch (error) {
    console.error('Lỗi upload avatar:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.put('/me/email', requireAuth, async (req, res) => {
  try {
    const { email } = req.body;
    const user = await userService.update(req.user.uid, { email });
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/leaderboard', async (req, res) => {
  try {
    const data = await userService.getLeaderboard(10);
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/', requireFounder, async (req, res) => {
  try {
    const users = await userService.getAll();
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.put('/:id', requireFounder, async (req, res) => {
  try {
    const { fullName, phone, points } = req.body;
    const data = { fullName, phone };
    if (points !== undefined) data.points = Number(points);
    
    const user = await userService.update(req.params.id, data);
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.put('/:id/role', requireFounder, async (req, res) => {
  try {
    const { role } = req.body;
    const user = await userService.setRole(req.params.id, role);
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.delete('/:id', requireFounder, async (req, res) => {
  try {
    if (req.params.id === req.user.uid) {
      return res.status(400).json({ success: false, error: 'Không thể tự xóa bản thân.' });
    }
    await userService.deleteUser(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
