import express from 'express';
import { saveContact } from '../services/contact.service.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, error: 'Vui lòng điền đầy đủ thông tin.' });
    }
    
    const contact = await saveContact({ name, email, message });
    res.json({ success: true, data: contact });
  } catch (error) {
    console.error('Lỗi khi gửi liên hệ:', error);
    res.status(500).json({ success: false, error: 'Lỗi máy chủ khi gửi liên hệ.' });
  }
});

export default router;
