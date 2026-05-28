import express from 'express';
import multer from 'multer';
import { requireAuth, requireAdmin } from '../middleware/auth.js';
import * as locationService from '../services/location.service.js';
import * as userService from '../services/user.service.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get('/', async (req, res) => {
  try {
    const onlyActive = req.query.all !== 'true';
    const locations = await locationService.findAll(onlyActive);
    res.json({ success: true, data: locations });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const location = await locationService.findById(req.params.id);
    if (!location) return res.status(404).json({ success: false, error: 'Không tìm thấy địa điểm.' });
    res.json({ success: true, data: location });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/', requireAdmin, upload.single('image'), async (req, res) => {
  try {
    const data = { ...req.body, createdBy: req.user.uid };
    const newLocation = await locationService.create(data, req.file);
    res.status(201).json({ success: true, data: newLocation });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.put('/:id', requireAdmin, upload.single('image'), async (req, res) => {
  try {
    const updatedLocation = await locationService.update(req.params.id, req.body, req.file);
    res.json({ success: true, data: updatedLocation });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    await locationService.deleteLocation(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.patch('/:id/toggle', requireAdmin, async (req, res) => {
  try {
    const { isActive } = req.body;
    const result = await locationService.toggleActive(req.params.id, isActive);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/:id/support', requireAuth, async (req, res) => {
  try {
    const { lat, lng } = req.body;
    if (!lat || !lng) {
      return res.status(400).json({ success: false, error: 'Không thể xác định vị trí của bạn.' });
    }
    
    const location = await locationService.findById(req.params.id);
    if (!location) return res.status(404).json({ success: false, error: 'Địa điểm không tồn tại.' });
    
    // Check distance (< 500m)
    const R = 6371e3; // metres
    const φ1 = lat * Math.PI/180;
    const φ2 = location.lat * Math.PI/180;
    const Δφ = (location.lat - lat) * Math.PI/180;
    const Δλ = (location.lng - lng) * Math.PI/180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;

    if (distance > 500) {
      return res.status(400).json({ success: false, error: `Bạn cần ở gần địa điểm này (hiện tại: ${(distance/1000).toFixed(1)}km)` });
    }
    
    await userService.addSupportedLocation(req.user.uid, req.params.id);
    await locationService.incrementSupport(req.params.id);
    
    res.json({ success: true, message: 'Đã xác nhận hỗ trợ thành công!' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
