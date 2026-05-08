'use client';
import Sidebar from '@/components/Sidebar';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function Analytics() {
  const [estacoes,    setEstacoes]    = useState<any[]>([]);
  const [resgates,    setResgates]    = useState<any[]>([]);
  const [resgatistas, setResgatistas] = useState<any[]>([]);
  const [loading,     setLoading]     = useState(true);

  useEffect(() => { carregarDados(); }, []);

  const carregarDados = async () => {
    const [{ data: e }, { data: r }, { data: rs }] = await Promise.all([
      supabase.from('charging_stations').select('*'),
      supabase.from('rescue_requests').select('*').order('created_at', { ascending: false }),
      supabase.from('resgatistas').select('*'),
    ]);
    if (e)  setEstacoes(e);
    if (r)  setResgates(r);
    if (rs) setResgatistas(rs);
    setLoading(false);
  };

  // Métricas reais calculadas
  const estacoesOnline    = estacoes.filter(e => e.status === 'online').length;
  const estacaoManutencao = estacoes.filter(e => e.status === 'manutencao').length;
  const taxaDisponib      = estacoes.length ? Math.round((estacoesOnline / estacoes.length) * 100) : 0;
  const resgatistasOnline = resgatistas.filter(r => r.status === 'online').length;
  const taxaCobertura     = resgatistas.length ? Math.round((resgatistasOnline / resgatistas.length) * 100) : 0;
  const sosAguardando     = resgates.filter(r => r.status === 'aguardando').length;
  const sosConcluidos     = resgates.filter(r => r.status === 'concluido').length;
  const taxaResolucao     = resgates.length ? Math.round((sosConcluidos / resgates.length) * 100) : 0;
  const receitaTotal      = resgates.filter(r => r.status === 'concluido').reduce((a, r) => a + (r.valor || 0), 0);
  const ticketMedio       = sosConcluidos ? (receitaTotal / sosConcluidos) : 0;

  // Top estações por conectores livres
  const topEstacoes = [...estacoes].sort((a, b) => (b.conectores_livres || 0) - (a.conectores_livres || 0)).slice(0, 5);
  const maxLivres   = topEstacoes[0]?.conectores_livres || 1;

  // Top resgatistas por avaliação
  const topResgatistas = [...resgatistas].sort((a, b) => (b.avaliacao || 0) - (a.avaliacao || 0)).slice(0, 5);

  // Distribuição de status dos resgates
  const statusDist = [
    { label: 'Aguardando', val: sosAguardando,  cor: '#FF3B5C' },
    { label: 'Aceito',     val: resgates.filter(r => r.status === 'aceito').length, cor: '#FFB800' },
    { label: 'Concluído',  val: sosConcluidos,  cor: '#00FF87' },
    { label: 'Cancelado',  val: resgates.filter(r => r.status === 'cancelado').length, cor: 'rgba(240,244,255,0.3)' },
  ];
  const maxStatus = Math.max(...statusDist.map(s => s.val), 1);

  const METRICAS = [
    { label: 'Estações online',      val: loading ? '...' : `${estacoesOnline}/${estacoes.length}`,   sub: `${taxaDisponib}% disponibilidade`,         cor: '#00E5FF' },
    { label: 'Em manutenção',        val: loading ? '...' : estacaoManutencao,                         sub: 'Estações indisponíveis',                   cor: '#FF3B5C' },
    { label: 'Resgatistas online',   val: loading ? '...' : `${resgatistasOnline}/${resgatistas.length}`, sub: `${taxaCobertura}% cobertura`,           cor: '#00FF87' },
    { label: 'Taxa de resolução SOS',val: loading ? '...' : `${taxaResolucao}%`,                       sub: `${sosConcluidos} de ${resgates.length} resgates`, cor: '#FFB800' },
    { label: 'Receita total',        val: loading ? '...' : `R$ ${receitaTotal.toFixed(2)}`,           sub: 'Resgates concluídos',                      cor: '#00FF87' },
    { label: 'Ticket médio SOS',     val: loading ? '...' : `R$ ${ticketMedio.toFixed(2)}`,            sub: 'Por resgate concluído',                    cor: '#00E5FF' },
  ];

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: 'var(--bg)' }}>
      <Sidebar />
      <main className="flex-1 ml-60 p-6 overflow-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>Analytics</h1>
            <p className="text-sm mt-1" style={{ color: 'var(--text3)' }}>
              {loading ? 'Carregando...' : `${estacoes.length} estações · ${resgates.length} resgates · ${resgatistas.length} resgatistas — dados reais`}
            </p>
          </div>
          <button onClick={carregarDados} className="px-4 py-2 rounded-xl text-sm"
            style={{ backgroundColor: 'var(--s3)', color: 'var(--text2)' }}>↻ Atualizar</button>
        </div>

        {/* KPIs reais */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {METRICAS.map((m, i) => (
            <div key={i} className="rounded-2xl border p-4" style={{ backgroundColor: 'var(--s2)', borderColor: 'var(--border)' }}>
              <p className="text-xs uppercase tracking-wider font-mono mb-3" style={{ color: 'var(--text3)' }}>{m.label}</p>
              <p className="text-3xl font-bold mb-1" style={{ color: m.cor }}>{m.val}</p>
              <p className="text-xs" style={{ color: 'var(--text3)' }}>{m.sub}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          {/* Top estações */}
          <div className="rounded-2xl border p-4" style={{ backgroundColor: 'var(--s2)', borderColor: 'var(--border)' }}>
            <h3 className="font-bold text-sm mb-4" style={{ color: 'var(--text)' }}>⚡ Estações — Conectores Livres</h3>
            {loading ? (
              <p className="text-center py-4" style={{ color: 'var(--text3)' }}>Carregando...</p>
            ) : topEstacoes.length === 0 ? (
              <p className="text-center py-4 text-sm" style={{ color: 'var(--text3)' }}>Sem dados</p>
            ) : (
              <div className="space-y-3">
                {topEstacoes.map((e, i) => (
                  <div key={e.id} className="flex items-center gap-3">
                    <span className="text-xs w-4 text-right font-mono" style={{ color: 'var(--text3)' }}>{i+1}</span>
                    <span className="text-xs flex-1 truncate" style={{ color: 'var(--text2)' }}>{e.nome}</span>
                    <div className="w-24 h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--s3)' }}>
                      <div className="h-2 rounded-full" style={{ width: `${((e.conectores_livres||0)/maxLivres)*100}%`, backgroundColor: e.status==='online'?'#00FF87':'#FF3B5C' }} />
                    </div>
                    <span className="text-xs font-mono w-12 text-right" style={{ color: 'var(--text2)' }}>
                      {e.conectores_livres}/{e.conectores_total}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Top resgatistas */}
          <div className="rounded-2xl border p-4" style={{ backgroundColor: 'var(--s2)', borderColor: 'var(--border)' }}>
            <h3 className="font-bold text-sm mb-4" style={{ color: 'var(--text)' }}>🚐 Top Resgatistas — Avaliação</h3>
            {loading ? (
              <p className="text-center py-4" style={{ color: 'var(--text3)' }}>Carregando...</p>
            ) : topResgatistas.length === 0 ? (
              <p className="text-center py-4 text-sm" style={{ color: 'var(--text3)' }}>Sem dados</p>
            ) : (
              <div className="space-y-3">
                {topResgatistas.map((r, i) => (
                  <div key={r.id} className="flex items-center gap-3">
                    <span className="text-xs w-4 text-right font-mono" style={{ color: 'var(--text3)' }}>{i+1}</span>
                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                      style={{ backgroundColor: 'rgba(255,59,92,0.15)', color: '#FF3B5C' }}>
                      {r.nome?.split(' ').map((n:string)=>n[0]).join('').slice(0,2)}
                    </div>
                    <span className="text-xs flex-1 truncate" style={{ color: 'var(--text2)' }}>{r.nome}</span>
                    <div className="w-20 h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--s3)' }}>
                      <div className="h-2 rounded-full" style={{ width: `${((r.avaliacao||0)/5)*100}%`, backgroundColor: '#FFB800' }} />
                    </div>
                    <span className="text-xs font-mono" style={{ color: '#FFB800' }}>{r.avaliacao}★</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Distribuição SOS */}
        <div className="rounded-2xl border p-4" style={{ backgroundColor: 'var(--s2)', borderColor: 'var(--border)' }}>
          <h3 className="font-bold text-sm mb-4" style={{ color: 'var(--text)' }}>🆘 Distribuição de Resgates por Status</h3>
          {loading ? (
            <p className="text-center py-4" style={{ color: 'var(--text3)' }}>Carregando...</p>
          ) : (
            <div className="grid grid-cols-4 gap-4">
              {statusDist.map((s, i) => (
                <div key={i} className="text-center">
                  <div className="text-2xl font-bold mb-1" style={{ color: s.cor }}>{s.val}</div>
                  <div className="h-2 rounded-full overflow-hidden mb-2" style={{ backgroundColor: 'var(--s3)' }}>
                    <div className="h-2 rounded-full transition-all" style={{ width: `${(s.val/maxStatus)*100}%`, backgroundColor: s.cor }} />
                  </div>
                  <div className="text-xs" style={{ color: 'var(--text3)' }}>{s.label}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
