import { NextResponse, NextRequest } from 'next/server';
import { neon } from '@neondatabase/serverless';
import jwt from 'jsonwebtoken';

const sql = neon(process.env.DATABASE_URL!);
const JWT_SECRET = process.env.JWT_SECRET || 'electra_secret_2024';
const CORS = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type, Authorization' };

function getUserId(req: NextRequest) {
  const auth = req.headers.get('authorization');
  if (!auth) return null;
  try {
    const decoded = jwt.verify(auth.replace('Bearer ', ''), JWT_SECRET) as {userId: string};
    return decoded.userId;
  } catch { return null; }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: CORS });
}

export async function GET(req: NextRequest) {
  const userId = getUserId(req);
  if (!userId) return NextResponse.json({ error: 'Não autorizado' }, { status: 401, headers: CORS });
  const vehicles = await sql`SELECT * FROM vehicles WHERE "userId" = ${userId} ORDER BY "isDefault" DESC, "createdAt" ASC`;
  return NextResponse.json({ vehicles }, { headers: CORS });
}

export async function POST(req: NextRequest) {
  const userId = getUserId(req);
  if (!userId) return NextResponse.json({ error: 'Não autorizado' }, { status: 401, headers: CORS });
  const { make, model, year, color, licensePlate, batteryCapacity, chargingPort, maxChargingPower, range } = await req.json();
  const id = crypto.randomUUID();
  await sql`INSERT INTO vehicles (id, "userId", make, model, year, color, "licensePlate", "batteryCapacity", "chargingPort", "maxChargingPower", range, "isDefault", "createdAt", "updatedAt")
    VALUES (${id}, ${userId}, ${make}, ${model}, ${year||2024}, ${color||'Preto'}, ${licensePlate}, ${batteryCapacity||75}, ${chargingPort||'CCS2'}, ${maxChargingPower||150}, ${range||400}, false, NOW(), NOW())`;
  return NextResponse.json({ ok: true, id }, { headers: CORS });
}

export async function DELETE(req: NextRequest) {
  const userId = getUserId(req);
  if (!userId) return NextResponse.json({ error: 'Não autorizado' }, { status: 401, headers: CORS });
  const { id } = await req.json();
  await sql`DELETE FROM vehicles WHERE id = ${id} AND "userId" = ${userId}`;
  return NextResponse.json({ ok: true }, { headers: CORS });
}
