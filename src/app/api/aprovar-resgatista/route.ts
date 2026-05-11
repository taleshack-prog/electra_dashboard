import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  const { id, email, nome } = await req.json();
  const senha = Math.random().toString(36).slice(-8) + 'R1!';

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password: senha,
    email_confirm: true,
    user_metadata: { nome, role: 'resgatista' }
  });

  if (error) {
    console.error('Erro criar user:', error.message);
    return NextResponse.json({ ok: false, error: error.message });
  }

  await supabase.from('resgatistas').upsert({
    user_id: data.user.id,
    nome,
    email,
    status: 'ativo',
    disponivel: false,
  });

  await supabase.from('resgatistas_pendentes')
    .update({ status: 'aprovado' })
    .eq('id', id);

  console.log('Resgatista criado:', email, 'senha:', senha);
  return NextResponse.json({ ok: true, senha, user_id: data.user.id });
}
