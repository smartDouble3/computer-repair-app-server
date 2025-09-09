// db.js
import pkg from 'pg';
const { Pool } = pkg;

const connectionString =
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL ||
  process.env.POSTGRES_CONNECTION_STRING;

export const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false }, // Render ต้องใช้ SSL
});

// wrapper สำหรับ query
export const query = (text, params) => pool.query(text, params);

// (optional) function ทดสอบการเชื่อมต่อ
export async function testDB() {
  try {
    const res = await query('SELECT NOW()'); // ใช้ query ตรงๆ
    console.log('✅ DB Connected:', res.rows[0]);
  } catch (err) {
    console.error('❌ DB Connection failed:', err.message);
  }
}
