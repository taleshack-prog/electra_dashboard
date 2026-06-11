import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';
import jwt from 'jsonwebtoken';

const sql = neon(process.env.DATABASE_URL);
const JWT_SECRET = process.env.JWT_SECRET || 'electra_secret_2024';

export async function POST(req) {
  const { latitude, longitude, address, description, urgencyLevel } = await req.json();
  const auth = req.headers.get('authorization');

  let userId = null;
  if (auth) {
    try {
      const decoded = jwt.verify(auth.replace('Bearer ', ''), JWT_SECRET);
      userId = decoded.userId;
    } catch {}
  }

  try {
    const id = crypto.randomUUID();
    await sql`
      INSERT INTO sos_requests (id, "userId", latitude, longitude, address, description, "urgencyLevel", status, "createdAt", "updatedAt")
      VALUES (${id}, ${userId}, ${latitude}, ${longitude}, ${address || ''}, ${description || ''}, ${urgencyLevel || 'medium'}, 'pending', NOW(), NOW())
    `;
    return NextResponse.json({ ok: true, id });
  } catch(e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function GET(req) {
  const auth = req.headers.get('authorization');
  if (!auth) return NextResponse.json({ error: 'Token obrigatório' }, { status: 401 });

  try {
    const requests = await sql`SELECT * FROM sos_requests ORDER BY "createdAt" DESC LIMIT 20`;
    return NextResponse.json({ requests });
  } catch(e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
