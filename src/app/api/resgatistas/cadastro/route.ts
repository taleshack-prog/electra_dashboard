import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

export async function POST(req) {
  const { nome, email, telefone, cpf, cnh, veiculo_modelo, veiculo_placa } = await req.json();

  if (!nome || !email || !cpf) {
    return NextResponse.json({ error: 'Campos obrigatórios: nome, email, cpf' }, { status: 400 });
  }

  try {
    const existing = await sql`SELECT id FROM sos_drivers WHERE email = ${email}`;
    if (existing.length > 0) {
      return NextResponse.json({ error: 'Email já cadastrado' }, { status: 409 });
    }

    const id = crypto.randomUUID();
    await sql`
      INSERT INTO sos_drivers (id, name, email, phone, "cpf", "cnh", "vehicleModel", "vehiclePlate", status, "createdAt", "updatedAt")
      VALUES (${id}, ${nome}, ${email}, ${telefone || null}, ${cpf}, ${cnh || null}, ${veiculo_modelo || null}, ${veiculo_placa || null}, 'pendente', NOW(), NOW())
    `;

    return NextResponse.json({ ok: true, message: 'Cadastro enviado para aprovação' });
  } catch(e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
