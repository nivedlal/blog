import { pool } from '../../../../lib/db.js';

export async function GET() {
  const { rows } = await pool.query('SELECT * FROM details ORDER BY id');
  return new Response(JSON.stringify(rows), {
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function POST({ request }) {
  const { title, date, image, tags, category, description, group } =
    await request.json();

  await pool.query(
    `INSERT INTO details (title, date, image, tags, category, description, "group")
     VALUES ($1, $2, $3, $4, $5, $6, $7)`,
    [title, date, image, tags, category, description, group],
  );

  return new Response(JSON.stringify({ success: true }), { status: 201 });
}
