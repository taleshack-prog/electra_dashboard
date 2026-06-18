import { NextResponse, NextRequest } from 'next/server';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);
const CORS = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type, Authorization' };

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: CORS });
}

export async function POST(req: NextRequest) {
  const { sosId, driverId, motivo } = await req.json();
  try {
    // Regista recusa e busca próximo resgatista disponível
    await sql`INSERT INTO sos_recusas (id, "sosId", "driverId", motivo, "createdAt") 
      VALUES (${crypto.randomUUID()}, ${sosId}, ${driverId}, ${motivo||''}, NOW())
      ON CONFLICT DO NOTHING`;
    return NextResponse.json({ ok: true }, { headers: CORS });
  } catch(e: any) {
    return NextResponse.json({ error: e.message }, { status: 500, headers: CORS });
  }
}
