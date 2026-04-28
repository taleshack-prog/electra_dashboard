'use client';
import Sidebar from '@/components/Sidebar';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface Estacao {
  id: string;
  nome: string;
  endereco: string;
  tipo: string;
  potencia_kw: number;
  preco_kwh: number;
  conectores_total: number;
  conectores_livres: number;
  status: string;
}

const statusCor = (s: string) => s==='online'?'#00FF87':s==='manutencao'?'#FF3B5C':'#FFB800';
const statusLabel = (s: string) => s==='online'?'Online':s==='manutencao'?'Manutenção':'Ocupado';

export default function Estacoes() {
  const [estacoes, setEstacoes] = useState<Estacao[]>([]);
  const [busca, setBusca] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarEstacoes();
  }, []);

  const carregarEstacoes = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('charging_stations').select('*').order('nome');
    if (data) setEstacoes(data);
    setLoading(false);
  };

  const filtradas = estacoes.filter(e => e.nome.toLowerCase().includes(busca.toLowerCase()));

  return (
    <div className="flex min-h-screen" style={{ backgroundColor:'var(--bg)' }}>
      <Sidebar />
      <main className="flex-1 ml-60 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold" style={{ color:'var(--text)' }}>Estações</h1>
            <p className="text-sm mt-1" style={{ color:'var(--text3)' }}>
              {loading ? 'Carregando...' : `${estacoes.filter(e=>e.status==='online').length} online · ${estacoes.length} total`}
            </p>
          </div>
          <div className="flex gap-3">
            <button onClick={carregarEstacoes} className="px-4 py-2 rounded-xl text-sm"
              style={{ backgroundColor:'var(--s3)', color:'var(--text2)' }}>↻ Atualizar</button>
            <button className="px-4 py-2 rounded-xl text-sm font-bold"
              style={{ backgroundColor:'var(--blue)', color:'#000' }}>+ Nova estação</button>
          </div>
        </div>

        <input value={busca} onChange={e=>setBusca(e.target.value)}
          placeholder="Buscar estação..." className="w-full px-4 py-2 rounded-xl text-sm outline-none mb-4"
          style={{ backgroundColor:'var(--s2)', border:'1px solid var(--border)', color:'var(--text)' }} />

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="text-4xl mb-4">⚡</div>
              <p style={{ color:'var(--text3)' }}>Carregando estações...</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {filtradas.map(e => (
              <div key={e.id} className="rounded-2xl border p-4" style={{ backgroundColor:'var(--s2)', borderColor:'var(--border)' }}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono" style={{ color:'var(--text3)' }}>⚡ ELECTRA</span>
                  <span className="text-xs px-2 py-1 rounded-full"
                    style={{ backgroundColor: statusCor(e.status)+'22', color: statusCor(e.status) }}>
                    {statusLabel(e.status)}
                  </span>
                </div>
                <h3 className="font-bold mb-1" style={{ color:'var(--text)' }}>{e.nome}</h3>
                <p className="text-xs mb-3" style={{ color:'var(--text3)' }}>📍 {e.endereco}</p>
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {[
                    { label:'Tipo', val:`${e.tipo} ${e.potencia_kw}kW` },
                    { label:'Livres', val:`${e.conectores_livres}/${e.conectores_total}` },
                    { label:'Preço', val:`R$ ${e.preco_kwh.toFixed(2)}/kWh` },
                  ].map((s,i) => (
                    <div key={i} className="rounded-xl p-2 text-center" style={{ backgroundColor:'var(--s3)' }}>
                      <div className="text-xs font-bold" style={{ color:'var(--text)' }}>{s.val}</div>
                      <div className="text-xs" style={{ color:'var(--text3)' }}>{s.label}</div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <button className="flex-1 py-1.5 rounded-xl text-xs font-bold"
                    style={{ backgroundColor:'rgba(0,229,255,0.1)', color:'var(--blue)' }}>Detalhes</button>
                  <button className="flex-1 py-1.5 rounded-xl text-xs font-bold"
                    style={{ backgroundColor:'rgba(255,184,0,0.1)', color:'var(--amber)' }}>Editar</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
