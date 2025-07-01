import { pool } from '../../../../lib/db.js';

export async function PUT({ request, params }) {
  const id = params.id;
  const { title, date, image, tags, category, description, group, files } =
    await request.json();

  const safeTags = Array.isArray(tags)
    ? tags
    : tags.split(',').map((t) => t.trim());
  const safeCategory = Array.isArray(category)
    ? category
    : category.split(',').map((c) => c.trim());
  await pool.query(
    `UPDATE details SET title = $1, date = $2, image = $3, tags = $4, category = $5, description = $6, "group" = $7, "files" = $8 WHERE id = $9`,
    [title, date, image, safeTags, safeCategory, description, group, files, id],
  );
  return new Response(JSON.stringify({ success: true }));
}

export async function DELETE({ params }) {
  const id = params.id;

  await pool.query('DELETE FROM details WHERE id = $1', [id]);

  return new Response(JSON.stringify({ success: true }));
}
