import 'dotenv/config';
import { readFileSync } from 'fs';
import { pool } from './db.js';

async function main() {
  const sql = readFileSync('./sql/migrations.sql', 'utf8');
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query(sql);
    await client.query('COMMIT');
    console.log('✅ Migration completed');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Migration failed:', err);
    process.exit(1);
  } finally {
    client.release();
    process.exit(0);
  }
}
main();
