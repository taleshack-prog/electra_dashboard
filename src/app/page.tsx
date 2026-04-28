'use client';
import Sidebar from '@/components/Sidebar';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function CommandCenter() {
  const [hora, setHora]               = useState('');
  const [estacoes, setEstacoes]       = useState<any[]>([]);
  const [resgatistas, setResgatistas] = useState<any[]>([]);
  const [resgates, setResgates]       = useState<any[]>([]);
  const [loading, setLoading]         = useState(true);

  useEffect(() => {
    const tick = () => setHora(new Date().toLocaleTimeString('pt-BR'));
    tick();
    const i = setInterval(tick, 1000);
    carregarDados();
    return () => clearInterval(i);
  }, []);

  const carregarDados = async () => {
    const [{ data: est }, { data: res }, { data: sos }] = await Promise.all([
      supabase.from('charging_stations').select('*'),
      supabase.from('resgatistas').select('*'),
      supabase.from('rescue_requests').select('*').eq('status', 'aguardando'),
    ]);
    if (est) setEstacoes(est);
    if (res) setResgatistas(res);
    if (sos) setResgates(sos);
    setLoading(false);
  };

  const estacoesOnline  = estacoes.filter(e => e.status === 'online').length;
  const resgatistasOnline = resgatistas.filter(r => r.status === 'online').length;

  const KPI = [
    { label:'Estações online',    val: loading ? '...' : `${estacoesOnline}/${estacoes.length}`, delta:`${estacoes.filter(e=>e.status==='manutencao').length} em manutenção`, cor:'#00E5FF', icon:'⚡' },
    { label:'Resgatistas ativos', val: loading ? '...' : resgatistasOnline.toString(), delta:`${resgatistas.length} total`, cor:'#00FF87', icon:'🚐' },
    { label:'SOS aguardando',     val: loading ? '...' : resgates.length.toString(), delta:'Em tempo real', cor:'#FF3B5C', icon:'🆘' },
    { label:'Sessões hoje',       val:'1.284', delta:'+48 última hora', cor:'#FFB800', icon:'🔋' },
  ];

  return (
    <div className="flex min-h-screen" style={{ backgroundColor:'var(--bg)' }}>
      <Sidebar />
      <main className="flex-1 ml-60 p-6 overflow-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold" style={{ color:'var(--text)' }}>Command Center</h1>
            <p className="text-sm mt-1" style={{ color:'var(--text3)' }}>Dados em tempo real — Supabase</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs"
              style={{ backgroundColor:'rgba(0,255,135,0.1)', border:'1px solid rgba(0,255,135,0.2)', color:'#00FF87' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
              Supabase conectado
            </div>
            <span className="font-mono text-sm" style={{ color:'var(--text3)' }}>{hora}</span>
          </div>
        </div>

        {/* KPIs reais */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {KPI.map((k,i) => (
            <div key={i} className="rounded-2xl p-4 border"
              style={{ backgroundColor:'var(--s2)', borderColor:'var(--border)' }}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono tracking-widest" style={{ color:'var(--text3)' }}>{k.label.toUpperCase()}</span>
                <span className="text-xl">{k.icon}</span>
              </div>
              <div className="text-3xl font-bold mb-1" style={{ color: k.cor }}>{k.val}</div>
              <div className="text-xs" style={{ color:'var(--text3)' }}>{k.delta}</div>
            </div>
          ))}
        </div>

        {/* Estações reais */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="rounded-2xl border" style={{ backgroundColor:'var(--s2)', borderColor:'var(--border)' }}>
            <div className="p-4 border-b flex items-center justify-between" style={{ borderColor:'var(--border)' }}>
              <h2 className="font-bold text-sm" style={{ color:'var(--text)' }}>⚡ Estações — Supabase</h2>
              <span className="text-xs" style={{ color:'var(--text3)' }}>{estacoes.length} registos</span>
            </div>
            <div className="p-2">
              {loading ? (
                <p className="text-center py-4 text-sm" style={{ color:'var(--text3)' }}>Carregando...</p>
              ) : estacoes.slice(0,4).map((e,i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl mb-1"
                  style={{ backgroundColor:'var(--s3)' }}>
                  <div className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: e.status==='online'?'#00FF87':'#FF3B5C' }} />
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-xs truncate" style={{ color:'var(--text)' }}>{e.nome}</div>
                    <div className="text-xs truncate" style={{ color:'var(--text3)' }}>{e.tipo} {e.potencia_kw}kW · {e.conectores_livres}/{e.conectores_total} livres</div>
                  </div>
                  <div className="text-xs font-bold flex-shrink-0" style={{ color:'#00FF87' }}>R$ {e.preco_kwh}/kWh</div>
                </div>
              ))}
            </div>
          </div>

          {/* Resgatistas reais */}
          <div className="rounded-2xl border" style={{ backgroundColor:'var(--s2)', borderColor:'var(--border)' }}>
            <div className="p-4 border-b flex items-center justify-between" style={{ borderColor:'var(--border)' }}>
              <h2 className="font-bold text-sm" style={{ color:'var(--text)' }}>🚐 Resgatistas — Supabase</h2>
              <span className="text-xs" style={{ color:'var(--text3)' }}>{resgatistas.length} registos</span>
            </div>
            <div className="p-2">
              {loading ? (
                <p className="text-center py-4 text-sm" style={{ color:'var(--text3)' }}>Carregando...</p>
              ) : resgatistas.map((r,i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl mb-1"
                  style={{ backgroundColor:'var(--s3)' }}>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                    style={{ backgroundColor:'rgba(255,59,92,0.15)', color:'#FF3B5C' }}>
                    {r.nome.split(' ').map((n:string)=>n[0]).join('').slice(0,2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-xs truncate" style={{ color:'var(--text)' }}>{r.nome}</div>
                    <div className="text-xs truncate" style={{ color:'var(--text3)' }}>{r.zona} · ★ {r.avaliacao}</div>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: r.status==='online'?'rgba(0,255,135,0.15)':'rgba(255,255,255,0.05)', color: r.status==='online'?'#00FF87':'rgba(240,244,255,0.3)' }}>
                    {r.status}
                  </span>
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
              { msg:`${estacoes.filter(e=>e.status==='manutencao').length} estações em manutenção`, tipo:'warning', icon:'📍' },
              { msg:`${resgatistasOnline} resgatistas online agora`, tipo:'info', icon:'🚐' },
              { msg:`${resgates.length} SOS aguardando resgatista`, tipo: resgates.length>0?'error':'info', icon:'🆘' },
            ].map((a,i) => (
              <div key={i} className="flex items-center gap-2 p-3 rounded-xl text-xs"
                style={{
                  backgroundColor: a.tipo==='error'?'rgba(255,59,92,0.08)':a.tipo==='warning'?'rgba(255,184,0,0.08)':'rgba(0,229,255,0.08)',
                  border:`1px solid ${a.tipo==='error'?'rgba(255,59,92,0.2)':a.tipo==='warning'?'rgba(255,184,0,0.2)':'rgba(0,229,255,0.2)'}`,
                  color: a.tipo==='error'?'var(--red)':a.tipo==='warning'?'var(--amber)':'var(--blue)',
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
