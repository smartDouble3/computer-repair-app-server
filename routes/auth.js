import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../db.js';

const router = Router();

// POST /api/v1/auth/register
router.post(
  '/register',
  [
    body('name').trim().isLength({ min: 2, max: 100 }),
    body('email').trim().isEmail().isLength({ max: 120 }),
    // ทำให้ phone เป็นทางเลือก และยอมรับค่าว่าง
    body('phone')
      .optional({ nullable: true, checkFalsy: true })
      .isString()
      .isLength({ min: 0, max: 30 }),
    body('password').isLength({ min: 6, max: 72 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error_code: 'VALIDATION_ERROR',
        message: 'Invalid input',
        details: errors.array()
      });
    }

    const name = String(req.body.name).trim();
    const email = String(req.body.email).trim();
    const phone = req.body.phone?.toString().trim() || null; // <- ถ้าว่างให้เป็น null
    const password = String(req.body.password);

    try {
      const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
      if (existing.length) {
        return res.status(409).json({ error_code: 'EMAIL_TAKEN', message: 'Email already used' });
      }

      const hash = await bcrypt.hash(password, 10);
      const [result] = await pool.query(
        'INSERT INTO users (name, email, phone, password_hash) VALUES (?,?,?,?)',
        [name, email, phone, hash]
      );

      return res.status(201).json({ id: result.insertId, name, email, phone });
    } catch (e) {
      return res.status(500).json({ error_code: 'INTERNAL_ERROR', message: e.message });
    }
  }
);

// POST /api/v1/auth/login (เหมือนเดิม)
router.post(
  '/login',
  [body('email').isEmail(), body('password').isLength({ min: 6, max: 72 })],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error_code: 'VALIDATION_ERROR', message: 'Invalid input', details: errors.array() });
    }

    const { email, password } = req.body;
    try {
      const [rows] = await pool.query(
        'SELECT id, name, email, role, password_hash FROM users WHERE email = ?',
        [email]
      );
      if (!rows.length) {
        return res.status(401).json({ error_code: 'INVALID_CREDENTIALS', message: 'Invalid email or password' });
      }

      const user = rows[0];
      const ok = await bcrypt.compare(password, user.password_hash);
      if (!ok) {
        return res.status(401).json({ error_code: 'INVALID_CREDENTIALS', message: 'Invalid email or password' });
      }

      const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

      return res.json({
        token,
        user: { id: user.id, name: user.name, email: user.email, role: user.role }
      });
    } catch (e) {
      return res.status(500).json({ error_code: 'INTERNAL_ERROR', message: e.message });
    }
  }
);

export default router;
