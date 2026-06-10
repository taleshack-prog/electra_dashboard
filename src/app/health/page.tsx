'use client';
import { useEffect, useState, useCallback } from 'react';

export default function HealthPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastCheck, setLastCheck] = useState(null);

  const check = useCallback(async () => {
    setLoading(true);
    try {
      const r = await fetch('/api/health');
      setData(await r.json());
      setLastCheck(new Date());
    } catch(e) {}
    setLoading(false);
  }, []);

  useEffect(() => { check(); const i = setInterval(check, 30000); return () => clearInterval(i); }, [check]);

  const color = s => s === 'ok' ? '#00FF87' : s === 'warning' ? '#FFB800' : '#FF3B5C';
  const icon = s => s === 'ok' ? '🟢' : s === 'warning' ? '🟡' : '🔴';
  const label = s => s === 'ok' ? 'Operacional' : s === 'warning' ? 'Atenção' : 'Fora do ar';
  const msColor = ms => ms < 500 ? '#00FF87' : ms < 2000 ? '#FFB800' : '#FF3B5C';
  const overallMsg = { healthy: '✅ Todos os sistemas operacionais', warning: '⚠️ Lentidão detectada', degraded: '🔴 Sistema com falhas' };

  return (
    <div style={{ minHeight: '100vh', background: '#070B14', color: '#EEF2F7', padding: 24, fontFamily: 'DM Sans, sans-serif' }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: 24, fontWeight: 800, color: '#00E5FF', marginBottom: 4 }}>⚡ ELECTRA — Health Monitor</h1>
            <p style={{ fontSize: 12, color: 'rgba(238,242,247,0.4)', letterSpacing: 1 }}>HTF · MONITORAMENTO EM TEMPO REAL</p>
            {data && <div style={{ marginTop: 12, fontSize: 18, fontWeight: 700, color: color(data.overall) }}>{overallMsg[data.overall]}</div>}
            {lastCheck && <div style={{ fontSize: 11, color: 'rgba(238,242,247,0.3)', marginTop: 4, fontFamily: 'monospace' }}>Atualizado: {lastCheck.toLocaleTimeString('pt-BR')} · Auto-refresh 30s</div>}
          </div>
          <button onClick={check} disabled={loading} style={{ background: '#111620', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(238,242,247,0.6)', padding: '8px 16px', borderRadius: 8, cursor: 'pointer', fontSize: 13 }}>
            {loading ? 'Verificando...' : '↻ Verificar agora'}
          </button>
        </div>

        <div style={{ marginBottom: 16, fontSize: 10, color: 'rgba(238,242,247,0.3)', letterSpacing: 2, textTransform: 'uppercase' }}>Serviços</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 14, marginBottom: 32 }}>
          {data?.services && Object.values(data.services).map((s, i) => (
            <div key={i} style={{ background: '#111620', borderLeft: '3px solid ' + color(s.status), border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <span style={{ fontWeight: 700, fontSize: 14 }}>{icon(s.status)} {s.name}</span>
                <span style={{ fontFamily: 'monospace', fontSize: 11, color: msColor(s.ms) }}>{s.ms}ms</span>
              </div>
              <div style={{ fontSize: 12, color: color(s.status) }}>{label(s.status)}</div>
              {s.error && <div style={{ fontSize: 11, color: '#FF3B5C', marginTop: 6, fontFamily: 'monospace' }}>⚠️ {s.error}</div>}
            </div>
          ))}
          {!data && <div style={{ color: 'rgba(238,242,247,0.3)', padding: 20 }}>Carregando...</div>}
        </div>

        {data?.stats && (
          <>
            <div style={{ marginBottom: 16, fontSize: 10, color: 'rgba(238,242,247,0.3)', letterSpacing: 2, textTransform: 'uppercase' }}>Estatísticas</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, marginBottom: 32 }}>
              {Object.entries(data.stats).map(([k, v]) => (
                <div key={k} style={{ background: '#111620', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: 16, textAlign: 'center' }}>
                  <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 28, fontWeight: 800, color: '#00E5FF' }}>{v}</div>
                  <div style={{ fontSize: 10, color: 'rgba(238,242,247,0.3)', letterSpacing: 1.5, textTransform: 'uppercase', marginTop: 4 }}>{k}</div>
                </div>
              ))}
            </div>
          </>
        )}

        <div style={{ textAlign: 'center', color: 'rgba(238,242,247,0.2)', fontSize: 11, lineHeight: 1.8 }}>
          Desenvolvido por <span style={{ color: '#00E5FF', fontWeight: 600 }}>Hack Tech Farm — HTF</span><br/>
          Heitor • Tales • Francisco
        </div>
      </div>
    </div>
  );
}
