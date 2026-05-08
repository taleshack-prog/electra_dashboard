'use client';
import Sidebar from '@/components/Sidebar';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface Sessao {
  id: string;
  status: string;
  kwh_entregue?: number;
  custo_total?: number;
  created_at: string;
}

interface Resgate {
  id: string;
  status: string;
  valor?: number;
  created_at: string;
}

const MOCK_TRANSACOES = [
  { id:'TXN-001', tipo:'Recarga',    usuario:'João Silva',    valor:134.40, taxa:13.44, status:'pago',    hora:'21:15' },
  { id:'TXN-002', tipo:'SOS Rescue', usuario:'Marina Costa',  valor:85.00,  taxa:8.50,  status:'pago',    hora:'21:10' },
  { id:'TXN-003', tipo:'Recarga',    usuario:'Carla Mendes',  valor:58.80,  taxa:5.88,  status:'pago',    hora:'21:05' },
  { id:'TXN-004', tipo:'Assinatura', usuario:'Carlos Mendes', valor:129.90, taxa:12.99, status:'pago',    hora:'20:58' },
  { id:'TXN-005', tipo:'SOS Rescue', usuario:'Pedro Lima',    valor:90.00,  taxa:9.00,  status:'pendente',hora:'20:45' },
];

export default function Financeiro() {
  const [sessoes, setSessoes]   = useState<Sessao[]>([]);
  const [resgates, setResgates] = useState<Resgate[]>([]);
  const [loading, setLoading]   = useState(true);
  const [usandoMock, setUsandoMock] = useState(false);

  useEffect(() => { carregarDados(); }, []);

  const carregarDados = async () => {
    setLoading(true);
    const [{ data: s }, { data: r }] = await Promise.all([
      supabase.from('charging_sessions').select('*').order('created_at', { ascending: false }),
      supabase.from('rescue_requests').select('*').order('created_at', { ascending: false }),
    ]);
    if (s) setSessoes(s);
    if (r) setResgates(r);
    const temDados = (s && s.length > 0) || (r && r.length > 0);
    setUsandoMock(!temDados);
    setLoading(false);
  };

  // Calcula KPIs reais se houver dados
  const receitaResgates = resgates.filter(r => r.status === 'concluido').reduce((a, r) => a + (r.valor || 0), 0);
  const receitaSessoes  = sessoes.filter(s => s.status === 'concluido').reduce((a, s) => a + (s.custo_total || 0), 0);
  const receitaTotal    = receitaResgates + receitaSessoes;

  const KPI = usandoMock ? [
    { label:'Receita hoje',  val:'R$ 48.720', sub:'+12% vs ontem',  cor:'#00FF87' },
    { label:'Receita mês',   val:'R$ 847.240',sub:'+8% vs mês ant', cor:'#00E5FF' },
    { label:'Taxa média',    val:'10%',       sub:'Por transação',  cor:'#FFB800' },
    { label:'Ticket médio',  val:'R$ 87,40',  sub:'Por sessão',     cor:'#FF3B5C' },
  ] : [
    { label:'Receita resgates', val:`R$ ${receitaResgates.toFixed(2)}`, sub:`${resgates.filter(r=>r.status==='concluido').length} concluídos`, cor:'#00FF87' },
    { label:'Receita recargas', val:`R$ ${receitaSessoes.toFixed(2)}`,  sub:`${sessoes.filter(s=>s.status==='concluido').length} sessões`,    cor:'#00E5FF' },
    { label:'Total geral',      val:`R$ ${receitaTotal.toFixed(2)}`,    sub:'Soma de todos os serviços', cor:'#FFB800' },
    { label:'SOS aguardando',   val:`${resgates.filter(r=>r.status==='aguardando').length}`, sub:'Pendentes de conclusão', cor:'#FF3B5C' },
  ];

  return (
    <div className="flex min-h-screen" style={{ backgroundColor:'var(--bg)' }}>
      <Sidebar />
      <main className="flex-1 ml-60 p-6 overflow-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold" style={{ color:'var(--text)' }}>Financeiro</h1>
            <p className="text-sm mt-1" style={{ color:'var(--text3)' }}>
              {loading ? 'Carregando...' : `${sessoes.length} sessões · ${resgates.length} resgates`}
              {usandoMock && <span className="ml-2 text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor:'rgba(255,184,0,0.15)', color:'var(--amber)' }}>dados demo</span>}
            </p>
          </div>
          <div className="flex gap-3">
            <button onClick={carregarDados} className="px-4 py-2 rounded-xl text-sm"
              style={{ backgroundColor:'var(--s3)', color:'var(--text2)' }}>↻ Atualizar</button>
            <button className="px-4 py-2 rounded-xl text-sm font-bold"
              style={{ backgroundColor:'rgba(0,229,255,0.1)', color:'var(--blue)' }}>Exportar CSV</button>
          </div>
        </div>

        {usandoMock && (
          <div className="mb-4 px-4 py-3 rounded-xl text-sm flex items-center gap-2"
            style={{ backgroundColor:'rgba(255,184,0,0.08)', border:'1px solid rgba(255,184,0,0.2)', color:'var(--amber)' }}>
            ⚠ Sessões de recarga ainda não registradas — exibindo dados demo. Dados reais aparecem após primeiras recargas.
          </div>
        )}

        <div className="grid grid-cols-4 gap-4 mb-6">
          {KPI.map((k,i) => (
            <div key={i} className="rounded-2xl border p-4" style={{ backgroundColor:'var(--s2)', borderColor:'var(--border)' }}>
              <p className="text-xs mb-2 uppercase tracking-wider font-mono" style={{ color:'var(--text3)' }}>{k.label}</p>
              <p className="text-2xl font-bold mb-1" style={{ color:k.cor }}>{loading ? '...' : k.val}</p>
              <p className="text-xs" style={{ color:'var(--text3)' }}>{k.sub}</p>
            </div>
          ))}
        </div>

        {/* Resgates com valor real */}
        {!usandoMock && resgates.length > 0 && (
          <div className="rounded-2xl border overflow-hidden mb-4" style={{ backgroundColor:'var(--s2)', borderColor:'var(--border)' }}>
            <div className="p-4 border-b flex items-center justify-between" style={{ borderColor:'var(--border)' }}>
              <h2 className="font-bold text-sm" style={{ color:'var(--text)' }}>🆘 Resgates SOS — Receita Real</h2>
              <span className="text-xs" style={{ color:'var(--text3)' }}>{resgates.length} registros</span>
            </div>
            <table className="w-full">
              <thead>
                <tr className="border-b text-xs" style={{ borderColor:'var(--border)', color:'var(--text3)' }}>
                  {['ID','Veículo','Valor','Status','Data'].map(h => (
                    <th key={h} className="text-left px-4 py-3 font-medium uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {resgates.slice(0,8).map((r,i) => (
                  <tr key={r.id} className="border-b" style={{ borderColor:'var(--border)', backgroundColor: i%2===0?'transparent':'rgba(255,255,255,0.01)' }}>
                    <td className="px-4 py-3 text-xs font-mono" style={{ color:'var(--text3)' }}>{r.id.slice(0,8).toUpperCase()}</td>
                    <td className="px-4 py-3 text-sm" style={{ color:'var(--text2)' }}>SOS Rescue</td>
                    <td className="px-4 py-3 text-sm font-bold" style={{ color:'#00FF87' }}>R$ {(r.valor||0).toFixed(2)}</td>
                    <td className="px-4 py-3">
                      <span className="text-xs px-2 py-1 rounded-full capitalize"
                        style={{ backgroundColor: r.status==='concluido'?'rgba(0,255,135,0.1)':'rgba(255,184,0,0.1)', color: r.status==='concluido'?'#00FF87':'#FFB800' }}>
                        {r.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs" style={{ color:'var(--text3)' }}>
                      {new Date(r.created_at).toLocaleDateString('pt-BR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tabela mock quando não há dados reais */}
        {usandoMock && (
          <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor:'var(--s2)', borderColor:'var(--border)' }}>
            <div className="p-4 border-b" style={{ borderColor:'var(--border)' }}>
              <h2 className="font-bold text-sm" style={{ color:'var(--text)' }}>Últimas transações (demo)</h2>
            </div>
            <table className="w-full">
              <thead>
                <tr className="border-b text-xs" style={{ borderColor:'var(--border)', color:'var(--text3)' }}>
                  {['ID','Tipo','Usuário','Valor','Taxa','Líquido','Status','Hora'].map(h => (
                    <th key={h} className="text-left px-4 py-3 font-medium uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {MOCK_TRANSACOES.map((t,i) => (
                  <tr key={t.id} className="border-b" style={{ borderColor:'var(--border)', backgroundColor: i%2===0?'transparent':'rgba(255,255,255,0.01)' }}>
                    <td className="px-4 py-3 text-xs font-mono" style={{ color:'var(--text3)' }}>{t.id}</td>
                    <td className="px-4 py-3"><span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor:'rgba(0,229,255,0.1)', color:'var(--blue)' }}>{t.tipo}</span></td>
                    <td className="px-4 py-3 text-sm" style={{ color:'var(--text)' }}>{t.usuario}</td>
                    <td className="px-4 py-3 text-sm font-bold" style={{ color:'var(--text)' }}>R$ {t.valor.toFixed(2)}</td>
                    <td className="px-4 py-3 text-sm" style={{ color:'var(--red)' }}>-R$ {t.taxa.toFixed(2)}</td>
                    <td className="px-4 py-3 text-sm font-bold" style={{ color:'#00FF87' }}>R$ {(t.valor - t.taxa).toFixed(2)}</td>
                    <td className="px-4 py-3"><span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: t.status==='pago'?'rgba(0,255,135,0.1)':'rgba(255,184,0,0.1)', color: t.status==='pago'?'#00FF87':'#FFB800' }}>{t.status}</span></td>
                    <td className="px-4 py-3 text-xs font-mono" style={{ color:'var(--text3)' }}>{t.hora}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
