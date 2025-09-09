import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export function authRequired(req, res, next) {
const auth = req.headers.authorization || '';
const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
if (!token) return res.status(401).json({ error_code: 'UNAUTHORIZED', message: 'Missing token' });

try {
const payload = jwt.verify(token, process.env.JWT_SECRET);
req.user = payload; // { id, email, role }
next();
} catch (e) {
return res.status(401).json({ error_code: 'UNAUTHORIZED', message: 'Invalid token' });
}
}

export function adminOnly(req, res, next) {
if (req.user?.role !== 'admin') return res.status(403).json({ error_code: 'FORBIDDEN', message: 'Admin only' });
next();
}