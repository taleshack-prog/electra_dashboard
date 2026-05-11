import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@supabase/supabase-js';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function POST(req) {
  const { mensagem } = await req.json();
  const { data: estacoes } = await supabase.from('charging_stations').select('*').limit(10);
  const { data: resgates } = await supabase.from('rescue_requests').select('*').eq('status', 'pending').limit(5);
  const { data: resgatistas } = await supabase.from('resgatistas').select('*').eq('disponivel', true).limit(5);

  const systemPrompt = 'Voce e a IA coordenadora da plataforma ELECTRA de carregamento de veiculos eletricos no Brasil. Dados: Estacoes: ' + (estacoes||[]).length + ', Resgates pendentes: ' + (resgates||[]).length + ', Resgatistas disponiveis: ' + (resgatistas||[]).length + '. Responda em portugues brasileiro.';

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1024,
    system: systemPrompt,
    messages: [{ role: 'user', content: mensagem }],
  });

  return NextResponse.json({
    resposta: response.content[0].type === 'text' ? response.content[0].text : '',
    dados: { estacoes: (estacoes||[]).length, resgates: (resgates||[]).length, resgatistas: (resgatistas||[]).length }
  });
}
