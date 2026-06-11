import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const sql = neon(process.env.DATABASE_URL);
const JWT_SECRET = process.env.JWT_SECRET || 'electra_secret_2024';

export async function POST(req) {
  const { email, password } = await req.json();

  try {
    const drivers = await sql`SELECT * FROM sos_drivers WHERE email = ${email} AND status = 'aprovado'`;
    if (drivers.length === 0) {
      return NextResponse.json({ error: 'Credenciais inválidas ou cadastro não aprovado' }, { status: 401 });
    }

    const driver = drivers[0];
    if (driver.password) {
      const valid = await bcrypt.compare(password, driver.password);
      if (!valid) return NextResponse.json({ error: 'Credenciais inválidas' }, { status: 401 });
    }

    const token = jwt.sign({ driverId: driver.id, email, role: 'resgatista' }, JWT_SECRET, { expiresIn: '30d' });

    return NextResponse.json({
      ok: true,
      token,
      driver: { id: driver.id, name: driver.name, email: driver.email, phone: driver.phone }
    });
  } catch(e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
