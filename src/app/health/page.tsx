'use client';
import { useEffect, useState, useCallback } from 'react';

export default function HealthPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastCheck, setLastCheck] = useState(null);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);

  const check = useCallback(async () => {
    setLoading(true);
    try {
      const r = await fetch('/api/health');
      setData(await r.json());
      setLastCheck(new Date());
      setAiAnalysis(null);
    } catch(e) {}
    setLoading(false);
  }, []);

  useEffect(() => { check(); const i = setInterval(check, 30000); return () => clearInterval(i); }, [check]);

  const analisarComIA = async () => {
    if (!data) return;
    setAiLoading(true);
    try {
      const problemas = Object.values(data.services)
        .filter(s => s.status !== 'ok')
        .map(s => `${s.name}: ${s.status} (${s.ms}ms)${s.error ? ' — ' + s.error : ''}`)
        .join('\n');

      const mensagem = problemas
        ? `Analisa o estado do sistema ELECTRA e diagnostica os problemas encontrados:\n\n${problemas}\n\nStatus geral: ${data.overall}\n\nPara cada problema: diagnóstico, causa provável, solução recomendada e impacto nos utilizadores.`
        : `O sistema ELECTRA está com todos os serviços operacionais. Faz um resumo do estado atual:\n\n${Object.values(data.services).map(s => s.name + ': ok (' + s.ms + 'ms)').join('\n')}\n\nEstatísticas: ${JSON.stringify(data.stats)}`;

      const r = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mensagem })
      });
      const d = await r.json();
      setAiAnalysis(d.resposta);
    } catch(e) {
      setAiAnalysis('Erro ao conectar com a IA: ' + e.message);
    }
    setAiLoading(false);
  };

  const color = s => s === 'ok' ? '#00FF87' : s === 'warning' ? '#FFB800' : '#FF3B5C';
  const icon = s => s === 'ok' ? '🟢' : s === 'warning' ? '🟡' : '🔴';
  const label = s => s === 'ok' ? 'Operacional' : s === 'warning' ? 'Atenção' : 'Fora do ar';
  const msColor = ms => ms < 500 ? '#00FF87' : ms < 2000 ? '#FFB800' : '#FF3B5C';
  const overallMsg = { healthy: '✅ Todos os sistemas operacionais', warning: '⚠️ Lentidão detectada', degraded: '🔴 Sistema com falhas' };
  const overallColor = { healthy: '#00FF87', warning: '#FFB800', degraded: '#FF3B5C' };

  const temProblemas = data && Object.values(data.services).some(s => s.status !== 'ok');

  return (
    <div style={{ minHeight: '100vh', background: '#070B14', color: '#EEF2F7', padding: 24, fontFamily: 'DM Sans, sans-serif' }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
              <a href="/" style={{ background: '#111620', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(238,242,247,0.6)', padding: '6px 12px', borderRadius: 8, fontSize: 13, textDecoration: 'none' }}>← Voltar</a>
              <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: 24, fontWeight: 800, color: '#00E5FF', margin: 0 }}>⚡ ELECTRA — Health Monitor</h1>
            </div>
            <p style={{ fontSize: 12, color: 'rgba(238,242,247,0.4)', letterSpacing: 1 }}>HTF · MONITORAMENTO EM TEMPO REAL</p>
            {data && <div style={{ marginTop: 12, fontSize: 18, fontWeight: 700, color: overallColor[data.overall] }}>{overallMsg[data.overall]}</div>}
            {lastCheck && <div style={{ fontSize: 11, color: 'rgba(238,242,247,0.3)', marginTop: 4, fontFamily: 'monospace' }}>Atualizado: {lastCheck.toLocaleTimeString('pt-BR')} · Auto-refresh 30s</div>}
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button onClick={check} disabled={loading} style={{ background: '#111620', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(238,242,247,0.6)', padding: '8px 16px', borderRadius: 8, cursor: 'pointer', fontSize: 13 }}>
              {loading ? 'Verificando...' : '↻ Verificar'}
            </button>
            <button onClick={analisarComIA} disabled={aiLoading || !data} style={{ background: aiLoading ? '#111620' : 'rgba(0,229,255,0.1)', border: '1px solid rgba(0,229,255,0.3)', color: '#00E5FF', padding: '8px 16px', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
              {aiLoading ? '🤖 Analisando...' : '🤖 Analisar com IA'}
            </button>
          </div>
        </div>

        {/* Serviços */}
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

        {/* Stats */}
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

        {/* Análise IA */}
        {aiAnalysis && (
          <>
            <div style={{ marginBottom: 16, fontSize: 10, color: 'rgba(238,242,247,0.3)', letterSpacing: 2, textTransform: 'uppercase' }}>Análise da IA Coordenadora</div>
            <div style={{ background: '#111620', border: '1px solid rgba(0,229,255,0.2)', borderLeft: '3px solid #00E5FF', borderRadius: 12, padding: 20, marginBottom: 32 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <span style={{ fontSize: 20 }}>🤖</span>
                <span style={{ fontFamily: 'Syne, sans-serif', fontSize: 14, fontWeight: 700, color: '#00E5FF' }}>Claude — IA Coordenadora ELECTRA</span>
              </div>
              <div style={{ fontSize: 14, color: 'rgba(238,242,247,0.8)', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{aiAnalysis}</div>
            </div>
          </>
        )}

        {/* Footer */}
        <div style={{ textAlign: 'center', color: 'rgba(238,242,247,0.2)', fontSize: 11, lineHeight: 1.8 }}>
          Desenvolvido por <span style={{ color: '#00E5FF', fontWeight: 600 }}>Hack Tech Farm — HTF</span><br/>
          Heitor • Tales • Francisco
        </div>
      </div>
    </div>
  );
}
