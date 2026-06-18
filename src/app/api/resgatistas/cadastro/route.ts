import { NextResponse, NextRequest } from 'next/server';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);
const CORS = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET, POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type, Authorization' };

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: CORS });
}

export async function POST(req: NextRequest) {
  const { nome, email, telefone, cpf, cnh, veiculo_modelo, veiculo_placa } = await req.json();
  if (!nome || !email || !cpf) {
    return NextResponse.json({ error: 'Campos obrigatórios: nome, email, cpf' }, { status: 400, headers: CORS });
  }
  try {
    const existing = await sql`SELECT id FROM sos_drivers WHERE email = ${email}`;
    if (existing.length > 0) {
      return NextResponse.json({ error: 'Email já cadastrado' }, { status: 409, headers: CORS });
    }
    const id = crypto.randomUUID();
    await sql`
      INSERT INTO sos_drivers (id, name, email, phone, cpf, cnh, "vehicleModel", "vehiclePlate", status, "isAvailable", "createdAt", "updatedAt")
      VALUES (${id}, ${nome}, ${email}, ${telefone||null}, ${cpf}, ${cnh||null}, ${veiculo_modelo||null}, ${veiculo_placa||null}, 'pendente', false, NOW(), NOW())
    `;
    return NextResponse.json({ ok: true, message: 'Cadastro enviado para aprovação' }, { headers: CORS });
  } catch(e: any) {
    return NextResponse.json({ error: e.message }, { status: 500, headers: CORS });
  }
}
