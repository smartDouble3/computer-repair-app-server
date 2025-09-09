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

// middleware
app.use(cors());
app.use(express.json());

// routes
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/api/v1/health', (req, res) => res.json({ ok: true }));
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/tickets', ticketRoutes);
app.use('/api/v1/employees', employeeRoutes);
app.use('/api/v1/users', userRoutes);

// server listen
const port = process.env.PORT || 3000;
app.listen(port, () =>
  console.log(`API running on http://localhost:${port}`)
);
