import jwt from 'jsonwebtoken';
import { pool } from '../../lib/db.js';

const SECRET_KEY = process.env.KEY_LOGIN;

export async function POST({ request }) {
  const { username, password } = await request.json();
  const result = await pool.query('SELECT * FROM admins WHERE username = $1', [
    username,
  ]);
  const user = result.rows[0];

  if (user && user.password_hash === password) {
    const token = jwt.sign({ user: username }, SECRET_KEY, { expiresIn: '1h' });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        'Set-Cookie': `token=${token}; HttpOnly; Path=/; Max-Age=3600`,
        'Content-Type': 'application/json',
      },
    });
  }

  return new Response(JSON.stringify({ error: 'Invalid credentials' }), {
    status: 401,
    headers: { 'Content-Type': 'application/json' },
  });
}
