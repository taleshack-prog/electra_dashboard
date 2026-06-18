import { NextResponse, NextRequest } from 'next/server';
import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const sql = neon(process.env.DATABASE_URL!);
const JWT_SECRET = process.env.JWT_SECRET || 'electra_jwt_secret_2024_hacktechfarm';
const CORS = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET, POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type, Authorization' };

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: CORS });
}

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  try {
    const drivers = await sql`SELECT * FROM sos_drivers WHERE email = ${email} AND status = 'aprovado'`;
    if (drivers.length === 0) {
      return NextResponse.json({ error: 'Credenciais inválidas ou cadastro não aprovado' }, { status: 401, headers: CORS });
    }
    const driver = drivers[0];
    if (driver.password) {
      const valid = await bcrypt.compare(password, driver.password);
      if (!valid) return NextResponse.json({ error: 'Senha incorreta' }, { status: 401, headers: CORS });
    }
    const token = jwt.sign({ driverId: driver.id, email, role: 'resgatista' }, JWT_SECRET, { expiresIn: '30d' });
    return NextResponse.json({
      ok: true, token,
      driver: { id: driver.id, name: driver.name, email: driver.email, phone: driver.phone }
    }, { headers: CORS });
  } catch(e: any) {
    return NextResponse.json({ error: e.message }, { status: 500, headers: CORS });
  }
}
