import { NextResponse, NextRequest } from 'next/server';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);
const CORS = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type, Authorization' };

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: CORS });
}

export async function POST(req: NextRequest) {
  const { sosId, driverId, kwhEntregue, observacao } = await req.json();
  try {
    await sql`UPDATE sos_requests SET status='completed', "updatedAt"=NOW() WHERE id=${sosId}`;
    await sql`UPDATE sos_drivers SET "isAvailable"=true, "totalJobs"="totalJobs"+1, "updatedAt"=NOW() WHERE id=${driverId}`;
    return NextResponse.json({ ok: true }, { headers: CORS });
  } catch(e: any) {
    return NextResponse.json({ error: e.message }, { status: 500, headers: CORS });
  }
}
