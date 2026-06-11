import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';

const sql = neon(process.env.DATABASE_URL);

export async function POST(req) {
  const { id, email, nome } = await req.json();

  try {
    const senha = Math.random().toString(36).slice(-8) + 'R1!';
    const hashedSenha = await bcrypt.hash(senha, 10);

    await sql`
      UPDATE sos_drivers SET status = 'aprovado', password = ${hashedSenha}, "updatedAt" = NOW()
      WHERE id = ${id}
    `;

    return NextResponse.json({ ok: true, senha });
  } catch(e) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}
