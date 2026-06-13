import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { neon } from '@neondatabase/serverless';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const CORS = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET, POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type, Authorization' };

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: CORS });
}

export async function POST(req: NextRequest) {
  const { mensagem, system, historico } = await req.json();

  try {
    const sql = neon(process.env.DATABASE_URL!);
    const estacoes = await sql`SELECT name, address, status, "powerKw", "pricePerKwh" FROM stations LIMIT 10`;

    const systemPrompt = system || `Você é a IA coordenadora da plataforma ELECTRA de carregamento de veículos elétricos no Brasil.
Estações disponíveis: ${estacoes.map((e: any) => `${e.name} (${e.status === 'available' ? 'Livre' : 'Ocupado'}, ${e.powerKw}kW, R$${e.pricePerKwh}/kWh)`).join(', ')}.
Responda em português brasileiro natural e de forma concisa.`;

    const messages = [
      ...(historico || []),
      { role: 'user' as const, content: mensagem }
    ];

    const response = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 150,
      system: systemPrompt,
      messages,
    });

    const resposta = response.content[0].type === 'text' ? response.content[0].text : 'Não consegui processar.';
    return NextResponse.json({ resposta }, { headers: CORS });
  } catch (e: any) {
    return NextResponse.json({ resposta: 'Sem conexão no momento.' }, { status: 500, headers: CORS });
  }
}
