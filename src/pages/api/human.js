import { pool } from '../../lib/db.js';

export async function GET() {
  try {
    const { rows } = await pool.query('SELECT * FROM human LIMIT 1');
    return new Response(JSON.stringify(rows), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('GET /api/human error:', err);
    return new Response(JSON.stringify({ error: 'Failed to fetch data' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function POST({ request }) {
  try {
    const { content, image } = await request.json();

    const result = await pool.query(
      'UPDATE human SET content = $1, image = $2 WHERE id = 1',
      [content, image],
    );

    if (result.rowCount === 0) {
      return new Response(
        JSON.stringify({ error: 'No existing row with id = 1 found.' }),
        {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        },
      );
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('POST /api/human error:', err);
    return new Response(JSON.stringify({ error: 'Failed to update data' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
