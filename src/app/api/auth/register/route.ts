import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const sql = neon(process.env.DATABASE_URL);
const JWT_SECRET = process.env.JWT_SECRET || 'electra_secret_2024';

export async function POST(req) {
  const { name, email, password, phone } = await req.json();

  if (!name || !email || !password) {
    return NextResponse.json({ error: 'Campos obrigatórios: name, email, password' }, { status: 400 });
  }

  try {
    const existing = await sql`SELECT id FROM users WHERE email = ${email}`;
    if (existing.length > 0) {
      return NextResponse.json({ error: 'Email já cadastrado' }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const id = crypto.randomUUID();

    await sql`
      INSERT INTO users (id, name, email, password, phone, "emailVerified", "createdAt", "updatedAt")
      VALUES (${id}, ${name}, ${email}, ${hashedPassword}, ${phone || null}, false, NOW(), NOW())
    `;

    const token = jwt.sign({ userId: id, email }, JWT_SECRET, { expiresIn: '30d' });

    return NextResponse.json({ ok: true, token, user: { id, name, email, phone } });
  } catch(e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
