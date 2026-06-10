import { NextResponse } from 'next/server';

export async function GET() {
  const results = { timestamp: new Date().toISOString(), services: {} };
  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  results.services.dashboard = { name: 'Dashboard ELECTRA', status: 'ok', ms: 0 };

  const sbStart = Date.now();
  try {
    const r = await fetch(SUPABASE_URL + '/rest/v1/charging_stations?select=id&limit=1', {
      headers: { 'apikey': SUPABASE_KEY, 'Authorization': 'Bearer ' + SUPABASE_KEY },
      signal: AbortSignal.timeout(5000)
    });
    results.services.supabase = { name: 'Supabase (PostgreSQL)', status: r.ok ? 'ok' : 'error', ms: Date.now() - sbStart };
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
    const gatewayUrl = process.env.OCPP_GATEWAY_URL;
    if (gatewayUrl) {
      const r = await fetch(gatewayUrl + '/ping', { signal: AbortSignal.timeout(5000) });
      const d = await r.json();
      results.services.ocpp = { name: 'OCPP Gateway', status: d.status === 'ok' ? 'ok' : 'warning', ms: Date.now() - ocppStart };
    } else {
      results.services.ocpp = { name: 'OCPP Gateway', status: 'warning', ms: 0, error: 'URL não configurada — deploy Railway pendente' };
    }
  } catch(e) {
    results.services.ocpp = { name: 'OCPP Gateway', status: 'warning', ms: Date.now() - ocppStart, error: 'Gateway offline' };
  }

  try {
    const [usersR, stationsR, rescuesR] = await Promise.all([
      fetch(SUPABASE_URL + '/rest/v1/profiles?select=id', { headers: { 'apikey': SUPABASE_KEY, 'Authorization': 'Bearer ' + SUPABASE_KEY, 'Prefer': 'count=exact', 'Range': '0-0' } }),
      fetch(SUPABASE_URL + '/rest/v1/charging_stations?select=id', { headers: { 'apikey': SUPABASE_KEY, 'Authorization': 'Bearer ' + SUPABASE_KEY, 'Prefer': 'count=exact', 'Range': '0-0' } }),
      fetch(SUPABASE_URL + '/rest/v1/rescue_requests?select=id', { headers: { 'apikey': SUPABASE_KEY, 'Authorization': 'Bearer ' + SUPABASE_KEY, 'Prefer': 'count=exact', 'Range': '0-0' } }),
    ]);
    const parseCount = r => { const cr = r.headers.get('content-range'); return cr ? parseInt(cr.split('/')[1]) : 0; };
    results.stats = { usuarios: parseCount(usersR), estacoes: parseCount(stationsR), resgates: parseCount(rescuesR) };
  } catch {}

  const statuses = Object.values(results.services).map(s => s.status);
  results.overall = statuses.includes('error') ? 'degraded' : statuses.includes('warning') ? 'warning' : 'healthy';

  return NextResponse.json(results);
}
