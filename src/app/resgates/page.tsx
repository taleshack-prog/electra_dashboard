'use client';
import Sidebar from '@/components/Sidebar';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface Resgate {
  id: string;
  endereco: string;
  veiculo: string;
  bateria_nivel: number;
  status: string;
  valor: number;
  created_at: string;
  latitude: number;
  longitude: number;
  resgatista_id: string | null;
  accepted_at: string | null;
  completed_at: string | null;
}

const statusCor = (s: string) => {
  switch (s) {
    case 'aceito':     return '#FFB800';
    case 'aguardando': return '#FF3B5C';
    case 'em_rota':    return '#00E5FF';
    case 'concluido':  return '#00FF87';
    case 'cancelado':  return 'rgba(240,244,255,0.3)';
    default:           return '#FFB800';
  }
};

const statusLabel = (s: string) => {
  switch (s) {
    case 'aceito':     return 'Aceito';
    case 'aguardando': return 'Aguardando';
    case 'em_rota':    return 'Em rota';
    case 'concluido':  return 'Concluído';
    case 'cancelado':  return 'Cancelado';
    default:           return s;
  }
};

const formatTempo = (iso: string) => {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000 / 60);
  if (diff < 1) return 'agora';
  if (diff < 60) return `${diff} min atrás`;
  return `${Math.floor(diff / 60)}h atrás`;
};

export default function Resgates() {
  const [resgates, setResgates]   = useState<Resgate[]>([]);
  const [loading, setLoading]     = useState(true);
  const [filtro, setFiltro]       = useState<'todos' | 'aguardando' | 'aceito' | 'concluido'>('todos');
  const [hora, setHora]           = useState('');

  useEffect(() => {
    const tick = () => setHora(new Date().toLocaleTimeString('pt-BR'));
    tick();
    const i = setInterval(tick, 1000);
    return () => clearInterval(i);
  }, []);

  useEffect(() => {
    carregarResgates();
    const channel = supabase
      .channel('resgates-dashboard')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'rescue_requests' }, () => {
        carregarResgates();
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  const carregarResgates = async () => {
    const { data } = await supabase
      .from('rescue_requests')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setResgates(data);
    setLoading(false);
  };

  const filtrados  = filtro === 'todos' ? resgates : resgates.filter(r => r.status === filtro);
  const ativos     = resgates.filter(r => ['aguardando','aceito','em_rota'].includes(r.status));
  const concluidos = resgates.filter(r => r.status === 'concluido');

  const KPI = [
    { label: 'Aguardando', val: resgates.filter(r => r.status === 'aguardando').length, cor: '#FF3B5C', icon: '🆘' },
    { label: 'Em rota',    val: resgates.filter(r => r.status === 'aceito' || r.status === 'em_rota').length, cor: '#FFB800', icon: '🚐' },
    { label: 'Concluídos', val: concluidos.length, cor: '#00FF87', icon: '✅' },
    { label: 'Total',      val: resgates.length,   cor: '#00E5FF', icon: '📊' },
  ];

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: 'var(--bg)' }}>
      <Sidebar />
      <main className="flex-1 ml-60 p-6 overflow-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>Resgates SOS</h1>
            <p className="text-sm mt-1" style={{ color: 'var(--text3)' }}>
              {loading ? 'Carregando...' : `${ativos.length} ativos · ${concluidos.length} concluídos · dados reais`}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {ativos.length > 0 && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs"
                style={{ backgroundColor: 'rgba(255,59,92,0.1)', border: '1px solid rgba(255,59,92,0.2)', color: 'var(--red)' }}>
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                {ativos.length} SOS ativos
              </div>
            )}
            <span className="font-mono text-sm" style={{ color: 'var(--text3)' }}>{hora}</span>
            <button onClick={carregarResgates} className="px-4 py-2 rounded-xl text-sm"
              style={{ backgroundColor: 'var(--s3)', color: 'var(--text2)' }}>↻ Atualizar</button>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-6">
          {KPI.map((k, i) => (
            <div key={i} className="rounded-2xl border p-4"
              style={{ backgroundColor: 'var(--s2)', borderColor: 'var(--border)' }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs uppercase tracking-widest font-mono" style={{ color: 'var(--text3)' }}>{k.label}</span>
                <span className="text-lg">{k.icon}</span>
              </div>
              <div className="text-3xl font-bold" style={{ color: k.cor }}>{loading ? '...' : k.val}</div>
            </div>
          ))}
        </div>

        <div className="flex gap-2 mb-4">
          {(['todos', 'aguardando', 'aceito', 'concluido'] as const).map(f => (
            <button key={f} onClick={() => setFiltro(f)}
              className="px-4 py-1.5 rounded-xl text-sm capitalize"
              style={{
                backgroundColor: filtro === f ? 'rgba(0,229,255,0.15)' : 'var(--s2)',
                border: `1px solid ${filtro === f ? 'rgba(0,229,255,0.3)' : 'var(--border)'}`,
                color: filtro === f ? 'var(--blue)' : 'var(--text3)',
              }}>
              {f === 'todos' ? 'Todos' : statusLabel(f)}
              {f !== 'todos' && (
                <span className="ml-2 text-xs opacity-60">
                  {resgates.filter(r => r.status === f).length}
                </span>
              )}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="text-4xl mb-4 animate-pulse">🆘</div>
              <p style={{ color: 'var(--text3)' }}>Carregando resgates...</p>
            </div>
          </div>
        ) : filtrados.length === 0 ? (
          <div className="flex items-center justify-center py-20 rounded-2xl border"
            style={{ backgroundColor: 'var(--s2)', borderColor: 'var(--border)' }}>
            <div className="text-center">
              <div className="text-4xl mb-3">✅</div>
              <p className="font-medium" style={{ color: 'var(--text)' }}>Nenhum resgate nesta categoria</p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {filtro === 'todos' && ativos.length > 0 && (
              <>
                <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--text3)' }}>⚡ ATIVOS AGORA</p>
                <div className="grid grid-cols-3 gap-4 mb-6">
                  {ativos.map(r => (
                    <div key={r.id} className="rounded-2xl border p-4 relative overflow-hidden"
                      style={{ backgroundColor: 'var(--s2)', borderColor: statusCor(r.status) + '44' }}>
                      {r.status === 'aguardando' && (
                        <div className="absolute inset-0 rounded-2xl pointer-events-none"
                          style={{ boxShadow: 'inset 0 0 30px rgba(255,59,92,0.08)' }} />
                      )}
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-mono" style={{ color: 'var(--text3)' }}>{r.id.slice(0,8).toUpperCase()}</span>
                        <span className="text-xs px-2 py-1 rounded-full font-medium"
                          style={{ backgroundColor: statusCor(r.status) + '22', color: statusCor(r.status) }}>
                          {statusLabel(r.status)}
                        </span>
                      </div>
                      <p className="text-xs mb-1" style={{ color: 'var(--text3)' }}>{r.veiculo}</p>
                      <p className="text-xs mb-3" style={{ color: 'var(--text3)' }}>📍 {r.endereco}</p>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs" style={{ color: r.bateria_nivel <= 10 ? '#FF3B5C' : 'var(--text3)' }}>
                          🔋 {r.bateria_nivel}%
                        </span>
                        <span className="text-sm font-bold" style={{ color: '#00FF87' }}>R$ {r.valor?.toFixed(2)}</span>
                      </div>
                      <p className="text-xs mb-3" style={{ color: 'var(--text3)' }}>🕐 {formatTempo(r.created_at)}</p>
                      {r.status === 'aguardando' && (
                        <button className="w-full py-2 rounded-xl text-xs font-bold"
                          style={{ backgroundColor: 'var(--red)', color: '#fff' }}>
                          🚐 Despachar resgatista
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--text3)' }}>HISTÓRICO</p>
              </>
            )}
            <div className="rounded-2xl border overflow-hidden"
              style={{ backgroundColor: 'var(--s2)', borderColor: 'var(--border)' }}>
              <table className="w-full">
                <thead>
                  <tr className="border-b text-xs" style={{ borderColor: 'var(--border)', color: 'var(--text3)' }}>
                    {['ID','Veículo','Endereço','Bateria','Valor','Status','Tempo'].map(h => (
                      <th key={h} className="text-left px-4 py-3 font-medium uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {(filtro === 'todos' ? resgates.filter(r => ['concluido','cancelado'].includes(r.status)) : filtrados).map((r, i) => (
                    <tr key={r.id} className="border-b"
                      style={{ borderColor: 'var(--border)', backgroundColor: i%2===0 ? 'transparent' : 'rgba(255,255,255,0.01)' }}>
                      <td className="px-4 py-3 text-xs font-mono" style={{ color: 'var(--text3)' }}>{r.id.slice(0,8).toUpperCase()}</td>
                      <td className="px-4 py-3 text-sm" style={{ color: 'var(--text2)' }}>{r.veiculo}</td>
                      <td className="px-4 py-3 text-xs max-w-xs truncate" style={{ color: 'var(--text3)' }}>📍 {r.endereco}</td>
                      <td className="px-4 py-3">
                        <span className="text-xs font-bold"
                          style={{ color: r.bateria_nivel <= 10 ? '#FF3B5C' : r.bateria_nivel <= 20 ? '#FFB800' : '#00FF87' }}>
                          🔋 {r.bateria_nivel}%
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm font-bold" style={{ color: '#00FF87' }}>R$ {r.valor?.toFixed(2)}</td>
                      <td className="px-4 py-3">
                        <span className="text-xs px-2 py-1 rounded-full"
                          style={{ backgroundColor: statusCor(r.status)+'22', color: statusCor(r.status) }}>
                          {statusLabel(r.status)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs font-mono" style={{ color: 'var(--text3)' }}>{formatTempo(r.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
