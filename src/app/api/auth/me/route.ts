import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';
import jwt from 'jsonwebtoken';

const sql = neon(process.env.DATABASE_URL);
const JWT_SECRET = process.env.JWT_SECRET || 'electra_secret_2024';

export async function GET(req) {
  const auth = req.headers.get('authorization');
  if (!auth) return NextResponse.json({ error: 'Token obrigatório' }, { status: 401 });

  try {
    const token = auth.replace('Bearer ', '');
    const decoded = jwt.verify(token, JWT_SECRET);
    const users = await sql`SELECT id, name, email, phone, points, level, city, state FROM users WHERE id = ${decoded.userId}`;
    if (users.length === 0) return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
    return NextResponse.json({ user: users[0] });
  } catch(e) {
    return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
  }
}
