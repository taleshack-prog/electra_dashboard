import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  const { id, email, nome, telefone, veiculo_modelo, veiculo_placa } = await req.json();
  const senha = Math.random().toString(36).slice(-8) + 'R1!';

  let userId = null;

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password: senha,
    email_confirm: true,
    user_metadata: { nome, role: 'resgatista' }
  });

  if (error) {
    if (error.message.includes('already been registered')) {
      const { data: users } = await supabase.auth.admin.listUsers();
      const existing = users?.users?.find(u => u.email === email);
      if (existing) {
        userId = existing.id;
        await supabase.auth.admin.updateUserById(userId, { password: senha });
      } else {
        return NextResponse.json({ ok: false, error: error.message });
      }
    } else {
      return NextResponse.json({ ok: false, error: error.message });
    }
  } else {
    userId = data.user.id;
  }

  await supabase.from('resgatistas').insert({
    nome,
    email,
    telefone: telefone || null,
    veiculo: veiculo_modelo ? veiculo_modelo + (veiculo_placa ? ' · ' + veiculo_placa : '') : null,
    status: 'offline',
    avaliacao: 5.0,
    total_resgates: 0,
  });

  await supabase.from('resgatistas_pendentes')
    .update({ status: 'aprovado' })
    .eq('id', id);

  console.log('Resgatista criado:', email, 'senha:', senha);
  return NextResponse.json({ ok: true, senha });
}
