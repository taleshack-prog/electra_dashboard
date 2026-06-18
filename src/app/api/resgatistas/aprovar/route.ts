import { NextResponse, NextRequest } from 'next/server';
import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';

const sql = neon(process.env.DATABASE_URL!);
const CORS = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type, Authorization' };

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: CORS });
}

export async function POST(req: NextRequest) {
  const { driverId, email } = await req.json();
  try {
    // Gera senha provisória
    const senhaProvisoria = Math.random().toString(36).slice(-6).toUpperCase() + '1!';
    const hash = await bcrypt.hash(senhaProvisoria, 10);

    await sql`
      UPDATE sos_drivers 
      SET status='aprovado', password=${hash}, "tempPassword"=${senhaProvisoria}, "isAvailable"=false, "updatedAt"=NOW()
      WHERE id=${driverId}
    `;

    // Log da senha (em produção enviar por email)
    console.log(`Resgatista aprovado: ${email} | Senha provisória: ${senhaProvisoria}`);

    return NextResponse.json({ 
      ok: true, 
      message: 'Resgatista aprovado com sucesso',
      senhaProvisoria, // retorna para o admin ver/copiar
      email 
    }, { headers: CORS });
  } catch(e: any) {
    return NextResponse.json({ error: e.message }, { status: 500, headers: CORS });
  }
}
