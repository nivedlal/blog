import { pool } from '../../lib/db.js';

export async function GET() {
  const { rows } = await pool.query('SELECT * FROM mains ORDER BY section');
  return new Response(JSON.stringify(rows), {
    headers: { 'Content-Type': 'application/json' },
  });
}
