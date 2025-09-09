// server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// --- API routes ---
import authRoutes from './routes/auth.js';
import ticketRoutes from './routes/tickets.js';
import employeeRoutes from './routes/employees.js';
import userRoutes from './routes/users.js';

// (ถ้ามีฟังก์ชันทดสอบ DB ให้เปิดบรรทัดนี้)
// import { testDB } from './db.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

const app = express();

/* -------------------- CORS (โปรดักชันพร้อมใช้) -------------------- */
// ใส่หลายโดเมนคั่นด้วยคอมมาใน ENV: CORS_ORIGIN="http://localhost:5173,https://computer-repair-app-frona.onrender.com"
const allowedOrigins = (process.env.CORS_ORIGIN || '')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean);

// ถ้าไม่ได้ตั้ง ENV จะใช้ค่าเริ่มต้นนี้ให้
if (!allowedOrigins.length) {
  allowedOrigins.push(
    'http://localhost:5173',
    'https://computer-repair-app-frona.onrender.com'
  );
}

app.use(cors({
  origin(origin, cb) {
    // อนุญาตเครื่องมืออย่าง curl / health check ที่ไม่มี origin
    if (!origin) return cb(null, true);
    return cb(null, allowedOrigins.includes(origin));
  },
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
  credentials: true,
}));

// ให้ preflight ผ่านแน่ ๆ
app.options('*', (_req, res) => res.sendStatus(204));

/* -------------------- Parsers & Static -------------------- */
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // บน Render ไม่ถาวร

/* -------------------- Health & Root -------------------- */
app.get('/', (_req, res) => {
  res.json({
    message: 'Computer Repair API is running',
    health: '/api/v1/health'
  });
});

app.get('/api/v1/health', (_req, res) => res.json({ ok: true }));

/* -------------------- API Routes -------------------- */
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/tickets', ticketRoutes);
app.use('/api/v1/employees', employeeRoutes);
app.use('/api/v1/users', userRoutes);

/* -------------------- 404 & Error Handler -------------------- */
app.use((req, res) => {
  res.status(404).json({
    error_code: 'NOT_FOUND',
    message: `No route: ${req.method} ${req.originalUrl}`
  });
});

app.use((err, _req, res, _next) => {
  console.error('API Error:', err);
  res.status(err.status || 500).json({
    error_code: err.error_code || 'INTERNAL_ERROR',
    message: err.message || 'Server error'
  });
});

/* -------------------- Start Server -------------------- */
const port = process.env.PORT || 3000;
app.listen(port, async () => {
  console.log(`✅ API running on http://localhost:${port}`);
  // ลองเช็ค DB ตอนสตาร์ต (ถ้ามี)
  // try { await testDB?.(); } catch {}
});
