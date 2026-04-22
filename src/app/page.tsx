'use client';
import Sidebar from '@/components/Sidebar';
import { useState, useEffect } from 'react';

const KPI = [
  { label:'Usuários ativos',    val:'12.847', delta:'+127 hoje',  cor:'#00E5FF', icon:'👤' },
  { label:'Sessões hoje',       val:'1.284',  delta:'+48 última hora', cor:'#00FF87', icon:'⚡' },
  { label:'SOS ativos',         val:'3',      delta:'2 urgentes', cor:'#FF3B5C', icon:'🆘' },
  { label:'Receita hoje',       val:'R$ 48.720', delta:'+12% vs ontem', cor:'#FFB800', icon:'💰' },
  { label:'Estações online',    val:'847/923', delta:'76 offline', cor:'#00E5FF', icon:'📍' },
  { label:'Resgatistas ativos', val:'24',     delta:'8 em missão', cor:'#00FF87', icon:'🚐' },
];

const SOS_ATIVOS = [
  { id:'SOS-001', cliente:'Marina Costa', veiculo:'Tesla Model 3', bat:'8%', local:'Av. Paulista, 900', tempo:'4 min', resgatista:'Carlos R.', status:'Em rota' },
  { id:'SOS-002', cliente:'Pedro Lima',   veiculo:'Hyundai IONIQ', bat:'5%', local:'Av. Faria Lima, 3000', tempo:'8 min', resgatista:'Pendente', status:'Aguardando' },
  { id:'SOS-003', cliente:'Ana Souza',    veiculo:'Fiat 500e',     bat:'12%', local:'R. Oscar Freire, 200', tempo:'2 min', resgatista:'João M.', status:'Chegando' },
];

const SESSOES_RECENTES = [
  { usuario:'João Silva',    estacao:'Eletroposto Central', kwh:'42 kWh', valor:'R$ 134,40', status:'Ativa' },
  { usuario:'Carla Mendes',  estacao:'BYD Charge Hub',      kwh:'28 kWh', valor:'R$ 58,80',  status:'Ativa' },
  { usuario:'Lucas Rocha',   estacao:'EV Station Plus',     kwh:'65 kWh', valor:'R$ 182,00', status:'Concluída' },
  { usuario:'Beatriz Cruz',  estacao:'Eletroposto Central', kwh:'18 kWh', valor:'R$ 57,60',  status:'Concluída' },
];

export default function CommandCenter() {
  const [hora, setHora] = useState('');

  useEffect(() => {
    const tick = () => setHora(new Date().toLocaleTimeString('pt-BR'));
    tick();
    const i = setInterval(tick, 1000);
    return () => clearInterval(i);
  }, []);

  const statusCor = (s: string) => s==='Ativa' ? '#00FF87' : s==='Em rota' ? '#FFB800' : s==='Chegando' ? '#00E5FF' : s==='Aguardando' ? '#FF3B5C' : 'rgba(240,244,255,0.4)';

  return (
    <div className="flex min-h-screen" style={{ backgroundColor:'var(--bg)' }}>
      <Sidebar />

      <main className="flex-1 ml-60 p-6 overflow-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold" style={{ color:'var(--text)' }}>Command Center</h1>
            <p className="text-sm mt-1" style={{ color:'var(--text3)' }}>Visão geral em tempo real — ELECTRA Platform</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs"
              style={{ backgroundColor:'rgba(0,255,135,0.1)', border:'1px solid rgba(0,255,135,0.2)', color:'#00FF87' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
              Sistema operacional
            </div>
            <span className="font-mono text-sm" style={{ color:'var(--text3)' }}>{hora}</span>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {KPI.map((k,i) => (
            <div key={i} className="rounded-2xl p-4 border"
              style={{ backgroundColor:'var(--s2)', borderColor:'var(--border)' }}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono tracking-widest" style={{ color:'var(--text3)' }}>{k.label.toUpperCase()}</span>
                <span className="text-xl">{k.icon}</span>
              </div>
              <div className="text-2xl font-bold mb-1" style={{ color: k.cor }}>{k.val}</div>
              <div className="text-xs" style={{ color:'var(--text3)' }}>{k.delta}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          {/* SOS Ativos */}
          <div className="rounded-2xl border" style={{ backgroundColor:'var(--s2)', borderColor:'var(--border)' }}>
            <div className="flex items-center justify-between p-4 border-b" style={{ borderColor:'var(--border)' }}>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                <h2 className="font-bold text-sm" style={{ color:'var(--text)' }}>SOS Ativos</h2>
              </div>
              <span className="text-xs px-2 py-1 rounded-full font-bold"
                style={{ backgroundColor:'rgba(255,59,92,0.15)', color:'var(--red)' }}>{SOS_ATIVOS.length}</span>
            </div>
            <div className="p-2">
              {SOS_ATIVOS.map((s,i) => (
                <div key={i} className="p-3 rounded-xl mb-1 cursor-pointer hover:opacity-80 transition-opacity"
                  style={{ backgroundColor:'var(--s3)' }}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-mono" style={{ color:'var(--text3)' }}>{s.id}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: statusCor(s.status)+'22', color: statusCor(s.status) }}>{s.status}</span>
                  </div>
                  <div className="font-semibold text-sm mb-0.5" style={{ color:'var(--text)' }}>{s.cliente}</div>
                  <div className="flex items-center justify-between text-xs" style={{ color:'var(--text3)' }}>
                    <span>🔋 {s.bat} · {s.veiculo}</span>
                    <span>⏱ {s.tempo}</span>
                  </div>
                  <div className="text-xs mt-1" style={{ color:'var(--text3)' }}>
                    📍 {s.local} · 🚐 {s.resgatista}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sessões recentes */}
          <div className="rounded-2xl border" style={{ backgroundColor:'var(--s2)', borderColor:'var(--border)' }}>
            <div className="flex items-center justify-between p-4 border-b" style={{ borderColor:'var(--border)' }}>
              <h2 className="font-bold text-sm" style={{ color:'var(--text)' }}>Sessões de Recarga</h2>
              <span className="text-xs" style={{ color:'var(--text3)' }}>Últimas 4</span>
            </div>
            <div className="p-2">
              {SESSOES_RECENTES.map((s,i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl mb-1"
                  style={{ backgroundColor:'var(--s3)' }}>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                    style={{ backgroundColor:'rgba(0,229,255,0.15)', color:'var(--blue)' }}>
                    {s.usuario.split(' ').map(n=>n[0]).join('').slice(0,2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-xs truncate" style={{ color:'var(--text)' }}>{s.usuario}</div>
                    <div className="text-xs truncate" style={{ color:'var(--text3)' }}>{s.estacao}</div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-xs font-bold" style={{ color:'#00FF87' }}>{s.valor}</div>
                    <div className="text-xs" style={{ color: statusCor(s.status) }}>{s.status}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Alertas */}
        <div className="rounded-2xl border p-4" style={{ backgroundColor:'var(--s2)', borderColor:'var(--border)' }}>
          <h2 className="font-bold text-sm mb-3" style={{ color:'var(--text)' }}>⚠ Alertas do Sistema</h2>
          <div className="grid grid-cols-3 gap-3">
            {[
              { msg:'76 estações offline', tipo:'warning', icon:'📍' },
              { msg:'Resgatista SEM011 sem resposta há 15min', tipo:'error', icon:'🚐' },
              { msg:'Pico de demanda previsto às 18h', tipo:'info', icon:'📊' },
            ].map((a,i) => (
              <div key={i} className="flex items-center gap-2 p-3 rounded-xl text-xs"
                style={{
                  backgroundColor: a.tipo==='error' ? 'rgba(255,59,92,0.08)' : a.tipo==='warning' ? 'rgba(255,184,0,0.08)' : 'rgba(0,229,255,0.08)',
                  border: `1px solid ${a.tipo==='error' ? 'rgba(255,59,92,0.2)' : a.tipo==='warning' ? 'rgba(255,184,0,0.2)' : 'rgba(0,229,255,0.2)'}`,
                  color: a.tipo==='error' ? 'var(--red)' : a.tipo==='warning' ? 'var(--amber)' : 'var(--blue)',
                }}>
                <span>{a.icon}</span>
                <span>{a.msg}</span>
              </div>
            ))}
          </div>
        </div>

      </main>
    </div>
  );
}
