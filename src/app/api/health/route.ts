import { NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';
import Anthropic from '@anthropic-ai/sdk';

const CORS = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type, Authorization' };

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: CORS });
}

export async function GET() {
  const results: any = { timestamp: new Date().toISOString(), services: {} };

  // Backend
  results.services.backend = { name: 'Dashboard ELECTRA', status: 'ok', ms: 0 };

  // Neon PostgreSQL
  try {
    const sql = neon(process.env.DATABASE_URL!);
    const start = Date.now();
    await sql`SELECT 1`;
    results.services.database = { name: 'Neon PostgreSQL', status: 'ok', ms: Date.now() - start };
  } catch(e: any) {
    results.services.database = { name: 'Neon PostgreSQL', status: 'error', ms: 0, error: e.message };
  }

  // Claude API
  if (process.env.ANTHROPIC_API_KEY) {
    const start = Date.now();
    try {
      const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
      await anthropic.messages.create({ model: 'claude-haiku-4-5-20251001', max_tokens: 10, messages: [{ role: 'user', content: 'hi' }] });
      results.services.ai = { name: 'Claude API (IA Coordenadora)', status: 'ok', ms: Date.now() - start };
    } catch(e: any) {
      results.services.ai = { name: 'Claude API (IA Coordenadora)', status: 'error', ms: Date.now() - start, error: e.message };
    }
  }

  // PWA User
  try {
    const start = Date.now();
    const r = await fetch('https://electra-pwa-user-6hhb.vercel.app/manifest.json', { signal: AbortSignal.timeout(5000) });
    results.services.pwa_user = { name: 'PWA Usuário', status: r.ok ? 'ok' : 'warning', ms: Date.now() - start };
  } catch(e: any) {
    results.services.pwa_user = { name: 'PWA Usuário', status: 'error', ms: 0, error: e.message };
  }

  // PWA Rescue
  try {
    const start = Date.now();
    const r = await fetch('https://electra-app-rescue.vercel.app/manifest.json', { signal: AbortSignal.timeout(5000) });
    results.services.pwa_rescue = { name: 'PWA Rescue', status: r.ok ? 'ok' : 'warning', ms: Date.now() - start };
  } catch(e: any) {
    results.services.pwa_rescue = { name: 'PWA Rescue', status: 'error', ms: 0, error: e.message };
  }

  const statuses = Object.values(results.services).map((s: any) => s.status);
  results.overall = statuses.includes('error') ? 'degraded' : statuses.includes('warning') ? 'warning' : 'healthy';

  // Stats do Neon
  try {
    const sql = neon(process.env.DATABASE_URL!);
    const [users, stations, sos, drivers] = await Promise.all([
      sql`SELECT COUNT(*) FROM users`,
      sql`SELECT COUNT(*) FROM stations`,
      sql`SELECT COUNT(*) FROM sos_requests`,
      sql`SELECT COUNT(*) FROM sos_drivers`,
    ]);
    results.stats = {
      usuarios: +users[0].count,
      estacoes: +stations[0].count,
      resgates: +sos[0].count,
      resgatistas: +drivers[0].count,
    };
  } catch {}

  return NextResponse.json(results, { headers: CORS });
}
