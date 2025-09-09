import { Router } from 'express';
import { body, param, query, validationResult } from 'express-validator';
import { pool } from '../db.js';
import { authRequired, adminOnly } from '../middleware/auth.js';

const router = Router();
const sendValidation = (res, errors) =>
  res.status(400).json({ error_code: 'VALIDATION_ERROR', message: 'Invalid input', details: errors.array() });

/**
 * POST /api/v1/tickets  (create ticket)
 * รับ assigned_employee_id แบบ optional
 */
router.post(
  '/',
  authRequired,
  [
    body('title').isString().isLength({ min: 1, max: 150 }),
    body('description').optional().isString().isLength({ max: 10000 }),
    body('device_brand').optional().isString().isLength({ max: 80 }),
    body('device_model').optional().isString().isLength({ max: 80 }),
    body('assigned_employee_id').optional().toInt().isInt({ min: 1 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return sendValidation(res, errors);

    const {
      title,
      description = null,
      device_brand = null,
      device_model = null,
      assigned_employee_id = null
    } = req.body;

    try {
      const [result] = await pool.query(
        `INSERT INTO tickets (user_id, title, description, device_brand, device_model, assigned_employee_id)
         VALUES (?,?,?,?,?,?)`,
        [req.user.id, title, description, device_brand, device_model, assigned_employee_id]
      );

      const [rows] = await pool.query('SELECT * FROM tickets WHERE id = ?', [result.insertId]);
      return res.status(201).json(rows[0]);
    } catch (e) {
      return res.status(500).json({ error_code: 'INTERNAL_ERROR', message: e.message });
    }
  }
);

/**
 * GET /api/v1/tickets/me  (my history)
 */
router.get(
  '/me',
  authRequired,
  [
    query('status').optional().isIn(['OPEN', 'IN_PROGRESS', 'DONE', 'CANCELLED']),
    query('page').optional().toInt().isInt({ min: 1 }),
    query('limit').optional().toInt().isInt({ min: 1, max: 100 }),
    query('sort').optional().isString()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return sendValidation(res, errors);

    const { status, page = 1, limit = 20, sort = '-created_at' } = req.query;

    const where = ['user_id = ?'];
    const params = [req.user.id];
    if (status) { where.push('status = ?'); params.push(status); }

    const sortField = (sort || '-created_at').replace('-', '');
    const sortDir = String(sort).startsWith('-') ? 'DESC' : 'ASC';
    const offset = (page - 1) * limit;

    try {
      const [countRows] = await pool.query(
        `SELECT COUNT(*) AS total FROM tickets WHERE ${where.join(' AND ')}`,
        params
      );
      const total = countRows[0].total;

      const [items] = await pool.query(
        `SELECT * FROM tickets
         WHERE ${where.join(' AND ')}
         ORDER BY ${sortField} ${sortDir}
         LIMIT ? OFFSET ?`,
        [...params, Number(limit), Number(offset)]
      );

      return res.json({ items, page: Number(page), limit: Number(limit), total });
    } catch (e) {
      return res.status(500).json({ error_code: 'INTERNAL_ERROR', message: e.message });
    }
  }
);

/**
 * GET /api/v1/tickets  (admin list)
 */
router.get(
  '/',
  authRequired,
  adminOnly,
  [
    query('user_id').optional().toInt().isInt({ min: 1 }),
    query('status').optional().isIn(['OPEN', 'IN_PROGRESS', 'DONE', 'CANCELLED']),
    query('page').optional().toInt().isInt({ min: 1 }),
    query('limit').optional().toInt().isInt({ min: 1, max: 100 }),
    query('sort').optional().isString()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return sendValidation(res, errors);

    const { user_id, status, page = 1, limit = 20, sort = '-created_at' } = req.query;

    const where = ['1=1'];
    const params = [];
    if (user_id) { where.push('user_id = ?'); params.push(user_id); }
    if (status)  { where.push('status = ?');  params.push(status);  }

    const sortField = (sort || '-created_at').replace('-', '');
    const sortDir = String(sort).startsWith('-') ? 'DESC' : 'ASC';
    const offset = (page - 1) * limit;

    try {
      const [countRows] = await pool.query(
        `SELECT COUNT(*) AS total FROM tickets WHERE ${where.join(' AND ')}`,
        params
      );
      const total = countRows[0].total;

      const [items] = await pool.query(
        `SELECT * FROM tickets
         WHERE ${where.join(' AND ')}
         ORDER BY ${sortField} ${sortDir}
         LIMIT ? OFFSET ?`,
        [...params, Number(limit), Number(offset)]
      );

      return res.json({ items, page: Number(page), limit: Number(limit), total });
    } catch (e) {
      return res.status(500).json({ error_code: 'INTERNAL_ERROR', message: e.message });
    }
  }
);

/**
 * PATCH /api/v1/tickets/:id  (admin update status)
 */
router.patch(
  '/:id',
  authRequired,
  adminOnly,
  [
    param('id').toInt().isInt({ min: 1 }),
    body('status').optional().isIn(['OPEN', 'IN_PROGRESS', 'DONE', 'CANCELLED'])
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return sendValidation(res, errors);

    const { id } = req.params;
    const { status } = req.body;

    try {
      const [exist] = await pool.query('SELECT * FROM tickets WHERE id = ?', [id]);
      if (!exist.length) return res.status(404).json({ error_code: 'NOT_FOUND', message: 'Ticket not found' });

      if (status) {
        await pool.query('UPDATE tickets SET status = ? WHERE id = ?', [status, id]);
      }

      const [rows] = await pool.query('SELECT * FROM tickets WHERE id = ?', [id]);
      return res.json(rows[0]);
    } catch (e) {
      return res.status(500).json({ error_code: 'INTERNAL_ERROR', message: e.message });
    }
  }
);

export default router;
