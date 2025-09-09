import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './routes/auth.js';
import ticketRoutes from './routes/tickets.js';
import employeeRoutes from './routes/employees.js';
import userRoutes from './routes/users.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const __root = process.cwd();

const app = express();

// ---------- middleware ----------
const allowedOrigins = [
  'http://localhost:5173', // ตอน dev
  'https://computer-repair-app-frontend.onrender.com' // frontend ที่ deploy บน Render
];

app.use(cors({
  origin: allowedOrigins,
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
  credentials: true,
}));

app.use(express.json({ limit: '2mb' }));

// ---------- health check ----------
app.get('/', (_req, res) => {
  res.json({
    message: 'Computer Repair API is running',
    health: '/api/v1/health'
  });
});

app.get('/api/v1/health', (_req, res) => res.json({ ok: true }));

// ---------- routes ----------
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/tickets', ticketRoutes);
app.use('/api/v1/employees', employeeRoutes);
app.use('/api/v1/users', userRoutes);

// ---------- server listen ----------
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`✅ API running on http://localhost:${port}`);
});
