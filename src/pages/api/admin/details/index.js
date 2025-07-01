import { pool } from '../../../../lib/db.js';

export async function GET() {
  const { rows } = await pool.query('SELECT * FROM details ORDER BY id');
  return new Response(JSON.stringify(rows), {
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function POST({ request }) {
  const { title, date, image, tags, category, description, group, files } =
    await request.json();
  const safeTags = Array.isArray(tags)
    ? tags
    : tags.split(',').map((t) => t.trim());
  const safeCategory = Array.isArray(category)
    ? category
    : category.split(',').map((c) => c.trim());

  await pool.query(
    `INSERT INTO details (title, date, image, tags, category, description, "group", files)
   VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
    [title, date, image, safeTags, safeCategory, description, group, files],
  );

  return new Response(JSON.stringify({ success: true }), { status: 201 });
}
