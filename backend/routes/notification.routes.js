import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import * as notificationService from '../services/notification.service.js';

const router = express.Router();

router.get('/', requireAuth, async (req, res) => {
  try {
    const notifications = await notificationService.getForUser(req.user.uid);
    res.json({ success: true, data: notifications });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.put('/read-all', requireAuth, async (req, res) => {
  try {
    await notificationService.markAllRead(req.user.uid);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.put('/:id/read', requireAuth, async (req, res) => {
  try {
    await notificationService.markRead(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
