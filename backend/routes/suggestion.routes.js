import express from 'express';
import multer from 'multer';
import { requireAuth, requireAdmin } from '../middleware/auth.js';
import * as suggestionService from '../services/suggestion.service.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get('/', requireAdmin, async (req, res) => {
  try {
    const suggestions = await suggestionService.findAll(req.query.status);
    res.json({ success: true, data: suggestions });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/my', requireAuth, async (req, res) => {
  try {
    const suggestions = await suggestionService.findByUserId(req.user.uid);
    res.json({ success: true, data: suggestions });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/', requireAuth, upload.single('image'), async (req, res) => {
  try {
    const data = { ...req.body, submittedBy: req.user.uid };
    const newSuggestion = await suggestionService.create(data, req.file);
    res.status(201).json({ success: true, data: newSuggestion });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/:id/approve', requireAdmin, async (req, res) => {
  try {
    const result = await suggestionService.approve(req.params.id, req.user.uid);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/:id/reject', requireAdmin, async (req, res) => {
  try {
    const { reason } = req.body;
    const result = await suggestionService.reject(req.params.id, req.user.uid, reason);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    await suggestionService.deleteSuggestion(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
