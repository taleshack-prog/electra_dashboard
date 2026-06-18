'use client';
import Sidebar from '@/components/Sidebar';
import { useState, useEffect } from 'react';

export default function CommandCenter() {
  const [hora, setHora] = useState('');
  const [estacoes, setEstacoes] = useState<any[]>([]);
  const [resgatistas, setResgatistas] = useState<any[]>([]);
  const [resgates, setResgates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const tick = () => setHora(new Date().toLocaleTimeString('pt-BR'));
    tick();
    const i = setInterval(tick, 1000);
    carregarDados();
    const poll = setInterval(carregarDados, 15000);
    return () => { clearInterval(i); clearInterval(poll); };
  }, []);

  const carregarDados = async () => {
    try {
      const [estRes, sosRes, drvRes] = await Promise.all([
        fetch('/api/estacoes'),
        fetch('/api/sos', { headers: { 'Authorization': 'Bearer admin' } }),
        fetch('/api/resgatistas/lista'),
      ]);
      const [estData, sosData, drvData] = await Promise.all([estRes.json(), sosRes.json(), drvRes.json()]);
      if (estData.stations) setEstacoes(estData.stations);
      if (sosData.requests) setResgates(sosData.requests.filter((r: any) => r.status === 'pending'));
      if (drvData.drivers) setResgatistas(drvData.drivers);
    } catch {}
    setLoading(false);
  };

  const estacoesOnline = estacoes.filter(e => e.status === 'available').length;
  const resgatistasOnline = resgatistas.filter((r: any) => r.isAvailable).length;

  const KPI = [
    { label: 'Estações online', val: loading ? '...' : `${estacoesOnline}/${estacoes.length}`, delta: `${estacoes.filter(e => e.status === 'maintenance').length} em manutenção`, cor: '#00E5FF', icon: '⚡' },
    { label: 'Resgatistas ativos', val: loading ? '...' : resgatistasOnline.toString(), delta: `${resgatistas.length} total`, cor: '#00FF87', icon: '🚐' },
    { label: 'SOS aguardando', val: loading ? '...' : resgates.length.toString(), delta: 'Em tempo real', cor: '#FF3B5C', icon: '🆘' },
    { label: 'Sessões hoje', val: '1.284', delta: '+48 última hora', cor: '#FFB800', icon: '🔋' },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0A0E1A', color: '#EEF2F7', fontFamily: 'sans-serif' }}>
      <Sidebar />
      <main style={{ marginLeft: 240, flex: 1, padding: 32, overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
          <div>
            <p style={{ fontSize: 11, color: 'rgba(238,242,247,0.35)', fontFamily: 'monospace', letterSpacing: 3, marginBottom: 6 }}>COMMAND CENTER</p>
            <h1 style={{ fontSize: 28, fontWeight: 800 }}>Visão Geral</h1>
          </div>
          <div style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '8px 16px', fontFamily: 'monospace', fontSize: 14, color: '#00E5FF' }}>
            🟢 Neon · {hora}
          </div>
        </div>

        {/* KPIs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
          {KPI.map((k, i) => (
            <div key={i} style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 18, padding: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <span style={{ fontSize: 22 }}>{k.icon}</span>
                <span style={{ fontSize: 11, color: 'rgba(238,242,247,0.35)', fontFamily: 'monospace' }}>{k.label.toUpperCase()}</span>
              </div>
              <div style={{ fontSize: 36, fontWeight: 800, color: k.cor, marginBottom: 4 }}>{k.val}</div>
              <div style={{ fontSize: 12, color: 'rgba(238,242,247,0.38)' }}>{k.delta}</div>
            </div>
          ))}
        </div>

        {/* Tabelas */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
          {/* Estações */}
          <div style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 18, padding: 20 }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 14, color: '#00E5FF' }}>⚡ Estações — Neon</h3>
            {loading ? <p style={{ color: 'rgba(238,242,247,0.3)', fontSize: 13 }}>Carregando...</p> :
              estacoes.length === 0 ? <p style={{ color: 'rgba(238,242,247,0.3)', fontSize: 13 }}>0 registos</p> :
              estacoes.slice(0, 5).map((e, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.04)', fontSize: 13 }}>
                  <span>{e.name}</span>
                  <span style={{ color: e.status === 'available' ? '#00FF87' : '#FF3B5C' }}>{e.status === 'available' ? '● Livre' : '● Ocupado'}</span>
                </div>
              ))
            }
          </div>

          {/* SOS Pendentes */}
          <div style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 18, padding: 20 }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 14, color: '#FF3B5C' }}>🆘 SOS Pendentes — Neon</h3>
            {loading ? <p style={{ color: 'rgba(238,242,247,0.3)', fontSize: 13 }}>Carregando...</p> :
              resgates.length === 0 ? <p style={{ color: 'rgba(238,242,247,0.3)', fontSize: 13 }}>Nenhum SOS pendente ✅</p> :
              resgates.slice(0, 5).map((r, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.04)', fontSize: 13 }}>
                  <span style={{ color: 'rgba(238,242,247,0.7)' }}>{r.address || 'Localização...'}</span>
                  <span style={{ color: '#FF3B5C', fontFamily: 'monospace', fontSize: 11 }}>{r.urgencyLevel}</span>
                </div>
              ))
            }
          </div>
        </div>

        {/* Alertas */}
        <div style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 18, padding: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 14 }}>⚠ Alertas do Sistema</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { icon: '📍', msg: `${estacoes.filter(e => e.status === 'maintenance').length} estações em manutenção`, cor: '#FFB800' },
              { icon: '🚐', msg: `${resgatistasOnline} resgatistas online agora`, cor: '#00FF87' },
              { icon: '🆘', msg: `${resgates.length} SOS aguardando resgatista`, cor: resgates.length > 0 ? '#FF3B5C' : '#00FF87' },
            ].map((a, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: 'rgba(255,255,255,0.03)', borderRadius: 10, fontSize: 13 }}>
                <span>{a.icon}</span>
                <span style={{ color: a.cor }}>{a.msg}</span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
