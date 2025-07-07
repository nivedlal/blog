import { pool } from '../../lib/db.js';

export async function GET() {
  const { rows } = await pool.query('SELECT * FROM footers ORDER BY section');
  return new Response(JSON.stringify(rows), {
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function POST({ request }) {
  try {
    const { section, content } = await request.json();
    await pool.query(
      `
      INSERT INTO footers (section, content)
      VALUES ($1, $2)
      ON CONFLICT (section) DO UPDATE SET content = EXCLUDED.content
    `,
      [section, content],
    );

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('POST /api/footers error:', err);
    return new Response(JSON.stringify({ error: 'Failed to save footer' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
