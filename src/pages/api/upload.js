// src/pages/api/upload.js
import formidable from 'formidable';
import path from 'path';
import { Readable } from 'stream';

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST({ request }) {
  // Convert the Astro request body to a Node.js stream
  const buffer = await request.arrayBuffer();
  const stream = Readable.from(Buffer.from(buffer));

  // Create a mock req object with headers and stream methods
  const headers = {};
  for (const [key, value] of request.headers.entries()) {
    headers[key.toLowerCase()] = value;
  }

  const req = Object.assign(stream, { headers });

  // Initialize formidable
  const form = formidable({
    uploadDir: './public/uploads',
    keepExtensions: true,
  });

  // Parse the form data
  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) {
        return resolve(
          new Response(JSON.stringify({ error: err.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
          }),
        );
      }

      const file = files.image?.[0] || files.file?.[0]; // handle both "image" or "file"

      if (!file) {
        return resolve(
          new Response(JSON.stringify({ error: 'No file uploaded' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
          }),
        );
      }

      const filename = path.basename(file.filepath);
      return resolve(
        new Response(JSON.stringify({ imageUrl: `/uploads/${filename}` }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      );
    });
  });
}
