import { pool } from '../../../../lib/db.js';

export async function PUT({ request, params }) {
  const id = params.id;
  const { title, date, image, tags, category, description, group } =
    await request.json();

  await pool.query(
    `UPDATE details SET title = $1, date = $2, image = $3, tags = $4, category = $5, description = $6, "group" = $7 WHERE id = $8`,
    [title, date, image, tags, category, description, group, id],
  );

  return new Response(JSON.stringify({ success: true }));
}

export async function DELETE({ params }) {
  const id = params.id;

  await pool.query('DELETE FROM details WHERE id = $1', [id]);

  return new Response(JSON.stringify({ success: true }));
}
