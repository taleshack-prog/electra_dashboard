import { NextResponse, NextRequest } from 'next/server';
import { neon } from '@neondatabase/serverless';
import jwt from 'jsonwebtoken';

const sql = neon(process.env.DATABASE_URL!);
const JWT_SECRET = process.env.JWT_SECRET || 'electra_jwt_secret_2024_hacktechfarm';
const CORS = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET, POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type, Authorization' };

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: CORS });
}

export async function POST(req: NextRequest) {
  const { latitude, longitude, address, description, urgencyLevel } = await req.json();
  const auth = req.headers.get('authorization');

  let userId = null;
  if (auth) {
    try {
      const decoded = jwt.verify(auth.replace('Bearer ', ''), JWT_SECRET) as {userId: string};
      userId = decoded.userId;
    } catch {}
  }

  try {
    const id = crypto.randomUUID();
    await sql`
      INSERT INTO sos_requests (id, "userId", latitude, longitude, address, description, "urgencyLevel", status, "createdAt", "updatedAt")
      VALUES (${id}, ${userId}, ${latitude}, ${longitude}, ${address||''}, ${description||''}, ${urgencyLevel||'medium'}, 'pending', NOW(), NOW())
    `;
    return NextResponse.json({ ok: true, id }, { headers: CORS });
  } catch(e: any) {
    return NextResponse.json({ error: e.message }, { status: 500, headers: CORS });
  }
}

export async function GET() {
  try {
    const requests = await sql`SELECT * FROM sos_requests ORDER BY "createdAt" DESC LIMIT 50`;
    return NextResponse.json({ requests }, { headers: CORS });
  } catch(e: any) {
    return NextResponse.json({ error: e.message }, { status: 500, headers: CORS });
  }
}
