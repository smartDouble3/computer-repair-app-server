// server/db.js
import mysql from 'mysql2/promise';

export const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,   // << ใช้ DB_PASSWORD ให้ตรง .env
  database: process.env.DB_NAME,
  // ssl: { rejectUnauthorized: true }  // เปิดเฉพาะตอนใช้ PlanetScale/Cloud DB
  waitForConnections: true,
  connectionLimit: 10,
});
