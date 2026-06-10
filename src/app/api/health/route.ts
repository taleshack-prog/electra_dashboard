import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  const results = { timestamp: new Date().toISOString(), services: {} };

  results.services.dashboard = { name: 'Dashboard ELECTRA', status: 'ok', ms: 0 };

  const sbStart = Date.now();
  try {
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
    const { error } = await supabase.from('charging_stations').select('id').limit(1);
    results.services.supabase = { name: 'Supabase (PostgreSQL)', status: error ? 'error' : 'ok', ms: Date.now() - sbStart, error: error?.message };
  } catch(e) {
    results.services.supabase = { name: 'Supabase (PostgreSQL)', status: 'error', ms: Date.now() - sbStart, error: e.message };
  }

  const aiStart = Date.now();
  try {
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': process.env.ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({ model: 'claude-haiku-4-5-20251001', max_tokens: 10, messages: [{ role: 'user', content: 'hi' }] }),
      signal: AbortSignal.timeout(6000)
    });
    const d = await r.json();
    results.services.ai = { name: 'Claude API (IA Coordenadora)', status: d.error ? 'error' : 'ok', ms: Date.now() - aiStart, error: d.error?.message };
  } catch(e) {
    results.services.ai = { name: 'Claude API (IA Coordenadora)', status: 'error', ms: Date.now() - aiStart, error: e.message };
  }

  const ocppStart = Date.now();
  try {
    const gatewayUrl = process.env.OCPP_GATEWAY_URL || 'http://localhost:9000';
    const r = await fetch(gatewayUrl + '/ping', { signal: AbortSignal.timeout(5000) });
    const d = await r.json();
    results.services.ocpp = { name: 'OCPP Gateway', status: d.status === 'ok' ? 'ok' : 'warning', ms: Date.now() - ocppStart };
  } catch(e) {
    results.services.ocpp = { name: 'OCPP Gateway', status: 'warning', ms: Date.now() - ocppStart, error: 'Gateway offline ou não configurado' };
  }

  try {
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
    const [{ count: users }, { count: stations }, { count: rescues }] = await Promise.all([
      supabase.from('profiles').select('*', { count: 'exact', head: true }),
      supabase.from('charging_stations').select('*', { count: 'exact', head: true }),
      supabase.from('rescue_requests').select('*', { count: 'exact', head: true }),
    ]);
    results.stats = { usuarios: users || 0, estacoes: stations || 0, resgates: rescues || 0 };
  } catch {}

  const statuses = Object.values(results.services).map(s => s.status);
  results.overall = statuses.includes('error') ? 'degraded' : statuses.includes('warning') ? 'warning' : 'healthy';

  return NextResponse.json(results);
}
