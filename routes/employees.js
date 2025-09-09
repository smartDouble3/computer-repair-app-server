import { Router } from 'express';
import { pool } from '../db.js';
import { body, validationResult, param } from 'express-validator';
import { uploadEmployeePhoto } from '../middleware/upload.js';

const router = Router();

router.post('/:id/photo',
  // authRequired, adminOnly, // ถ้าจะบังคับเฉพาะ admin ให้ uncomment
  uploadEmployeePhoto.single('file'),
  async (req, res) => {
    try {
      const { id } = req.params;
      if (!req.file) return res.status(400).json({ error_code: 'NO_FILE', message: 'No file uploaded' });
      const url = `/uploads/employees/${req.file.filename}`;
      await pool.query('UPDATE employees SET photo_url = ? WHERE id = ?', [url, id]);
      res.json({ photo_url: url });
    } catch (e) {
      res.status(500).json({ error_code: 'INTERNAL_ERROR', message: e.message });
    }
  }
);

// GET /api/v1/employees - รายชื่อพนักงานทั้งหมด
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM employees ORDER BY created_at DESC');
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error_code: 'INTERNAL_ERROR', message: e.message });
  }
});

// POST /api/v1/employees - เพิ่มพนักงาน (โปรเจกต์จบ: เปิดไว้แบบง่าย ๆ)
router.post(
  '/',
  [body('name').isLength({ min: 2, max: 100 })],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ error_code: 'VALIDATION_ERROR', message: 'Invalid input', details: errors.array() });

    const { name, email = null, phone = null, role = 'technician' } = req.body;
    try {
      const [result] = await pool.query(
        'INSERT INTO employees (name, email, phone, role) VALUES (?,?,?,?)',
        [name, email, phone, role]
      );
      const [rows] = await pool.query('SELECT * FROM employees WHERE id = ?', [result.insertId]);
      res.status(201).json(rows[0]);
    } catch (e) {
      res.status(500).json({ error_code: 'INTERNAL_ERROR', message: e.message });
    }
  }
);

// (ออปชัน) PATCH /api/v1/employees/:id - อัปเดตง่าย ๆ
router.patch(
  '/:id',
  [param('id').toInt().isInt({ min: 1 })],
  async (req, res) => {
    const { id } = req.params;
    const { name, email, phone, role } = req.body;
    try {
      const [exist] = await pool.query('SELECT * FROM employees WHERE id = ?', [id]);
      if (!exist.length) return res.status(404).json({ error_code: 'NOT_FOUND', message: 'Employee not found' });

      await pool.query(
        `UPDATE employees SET
           name = COALESCE(?, name),
           email = COALESCE(?, email),
           phone = COALESCE(?, phone),
           role = COALESCE(?, role)
         WHERE id = ?`,
        [name ?? null, email ?? null, phone ?? null, role ?? null, id]
      );
      const [rows] = await pool.query('SELECT * FROM employees WHERE id = ?', [id]);
      res.json(rows[0]);
    } catch (e) {
      res.status(500).json({ error_code: 'INTERNAL_ERROR', message: e.message });
    }
  }
);

export default router;
