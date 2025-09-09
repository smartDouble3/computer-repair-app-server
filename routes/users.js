import { Router } from 'express';
import { pool } from '../db.js';
import { authRequired } from '../middleware/auth.js';
import { uploadAvatar } from '../middleware/upload.js';

const router = Router();

// GET โปรไฟล์เดิม (มีอยู่แล้ว)
router.get('/me', authRequired, async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, name, email, phone, avatar_url, role, created_at FROM users WHERE id = ?',
      [req.user.id]
    );
    if (!rows.length) return res.status(404).json({ error_code: 'NOT_FOUND', message: 'User not found' });
    res.json(rows[0]);
  } catch (e) {
    res.status(500).json({ error_code: 'INTERNAL_ERROR', message: e.message });
  }
});

// POST อัปโหลดรูปโปรไฟล์
router.post('/me/avatar', authRequired, uploadAvatar.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error_code: 'NO_FILE', message: 'No file uploaded' });
    const url = `/uploads/avatars/${req.file.filename}`;
    await pool.query('UPDATE users SET avatar_url = ? WHERE id = ?', [url, req.user.id]);
    res.json({ avatar_url: url });
  } catch (e) {
    res.status(500).json({ error_code: 'INTERNAL_ERROR', message: e.message });
  }
});

export default router;
