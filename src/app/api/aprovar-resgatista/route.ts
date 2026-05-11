import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function POST(req) {
  const { id, email, nome } = await req.json();
  
  const senha = Math.random().toString(36).slice(-8) + 'R1!';
  
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password: senha,
    email_confirm: true,
    user_metadata: { nome, role: 'resgatista' }
  });

  if (error) return NextResponse.json({ ok: false, error: error.message });

  await supabase.from('resgatistas').insert({
    user_id: data.user.id,
    nome,
    email,
    status: 'ativo',
    disponivel: false,
  });

  return NextResponse.json({ ok: true, senha });
}
