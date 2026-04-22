'use client';
import Sidebar from '@/components/Sidebar';
import { useState } from 'react';

const PLANOS_INICIAL = [
  { id:'bronze',  nome:'Bronze',  preco:19.90, resgates:'1 a cada 2 meses', resgatesNum:0.5, cor:'#CD7F32', usuarios:1247, receita:'R$ 24.815' },
  { id:'prata',   nome:'Prata',   preco:39.90, resgates:'2 por mês',        resgatesNum:2,   cor:'#A8A9AD', usuarios:3841, receita:'R$ 153.255' },
  { id:'ouro',    nome:'Ouro',    preco:69.90, resgates:'5 por mês',        resgatesNum:5,   cor:'#FFB800', usuarios:2134, receita:'R$ 149.167' },
  { id:'premium', nome:'Premium', preco:129.90,resgates:'Ilimitados',       resgatesNum:999, cor:'#00E5FF', usuarios:847,  receita:'R$ 110.015' },
];

export default function Planos() {
  const [planos, setPlanos] = useState(PLANOS_INICIAL);
  const [editando, setEditando] = useState<string|null>(null);
  const [novoPreco, setNovoPreco] = useState('');
  const [novoResgates, setNovoResgates] = useState('');

  const salvar = (id: string) => {
    setPlanos(p => p.map(pl => pl.id===id ? {
      ...pl,
      preco: novoPreco ? parseFloat(novoPreco) : pl.preco,
      resgates: novoResgates || pl.resgates,
    } : pl));
    setEditando(null);
    setNovoPreco('');
    setNovoResgates('');
  };

  const totalUsuarios = planos.reduce((a,p) => a+p.usuarios, 0);
  const totalReceita  = planos.reduce((a,p) => a+p.usuarios*p.preco, 0);

  return (
    <div className="flex min-h-screen" style={{ backgroundColor:'var(--bg)' }}>
      <Sidebar />
      <main className="flex-1 ml-60 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold" style={{ color:'var(--text)' }}>Planos de Seguro Rescue</h1>
            <p className="text-sm mt-1" style={{ color:'var(--text3)' }}>
              {totalUsuarios.toLocaleString('pt-BR')} assinantes · Receita mensal: R$ {totalReceita.toLocaleString('pt-BR', {minimumFractionDigits:2})}
            </p>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {planos.map(p => (
            <div key={p.id} className="rounded-2xl border p-4" style={{ backgroundColor:'var(--s2)', borderColor: p.cor+'33' }}>
              <div className="text-lg mb-1">
                {p.id==='bronze'?'🥉':p.id==='prata'?'🥈':p.id==='ouro'?'🥇':'⚡'}
              </div>
              <p className="font-bold" style={{ color: p.cor }}>{p.nome}</p>
              <p className="text-2xl font-bold my-1" style={{ color:'var(--text)' }}>R$ {p.preco.toFixed(2)}</p>
              <p className="text-xs" style={{ color:'var(--text3)' }}>{p.usuarios.toLocaleString()} assinantes</p>
              <p className="text-xs font-bold mt-1" style={{ color:'#00FF87' }}>{p.receita}/mês</p>
            </div>
          ))}
        </div>

        {/* Tabela de edição */}
        <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor:'var(--s2)', borderColor:'var(--border)' }}>
          <div className="p-4 border-b" style={{ borderColor:'var(--border)' }}>
            <h2 className="font-bold" style={{ color:'var(--text)' }}>Configurar planos</h2>
            <p className="text-xs mt-1" style={{ color:'var(--text3)' }}>Clique em Editar para alterar preço e número de resgates</p>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b text-xs" style={{ borderColor:'var(--border)', color:'var(--text3)' }}>
                {['Plano','Preço/mês','Resgates incluídos','Assinantes','Receita mensal','Ações'].map(h => (
                  <th key={h} className="text-left px-4 py-3 font-medium uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {planos.map(p => (
                <tr key={p.id} className="border-b" style={{ borderColor:'var(--border)' }}>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <span>{p.id==='bronze'?'🥉':p.id==='prata'?'🥈':p.id==='ouro'?'🥇':'⚡'}</span>
                      <span className="font-bold" style={{ color: p.cor }}>{p.nome}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    {editando===p.id ? (
                      <input value={novoPreco} onChange={e=>setNovoPreco(e.target.value)}
                        placeholder={p.preco.toFixed(2)}
                        className="w-24 px-2 py-1 rounded-lg text-sm outline-none"
                        style={{ backgroundColor:'var(--s3)', border:'1px solid var(--border)', color:'var(--text)' }} />
                    ) : (
                      <span className="font-bold" style={{ color:'var(--text)' }}>R$ {p.preco.toFixed(2)}</span>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    {editando===p.id ? (
                      <input value={novoResgates} onChange={e=>setNovoResgates(e.target.value)}
                        placeholder={p.resgates}
                        className="w-40 px-2 py-1 rounded-lg text-sm outline-none"
                        style={{ backgroundColor:'var(--s3)', border:'1px solid var(--border)', color:'var(--text)' }} />
                    ) : (
                      <span className="text-sm" style={{ color:'var(--text2)' }}>{p.resgates}</span>
                    )}
                  </td>
                  <td className="px-4 py-4 font-mono text-sm" style={{ color:'var(--text2)' }}>
                    {p.usuarios.toLocaleString()}
                  </td>
                  <td className="px-4 py-4 font-bold text-sm" style={{ color:'#00FF87' }}>{p.receita}</td>
                  <td className="px-4 py-4">
                    {editando===p.id ? (
                      <div className="flex gap-2">
                        <button onClick={()=>salvar(p.id)} className="text-xs px-3 py-1.5 rounded-lg font-bold"
                          style={{ backgroundColor:'#00FF87', color:'#000' }}>Salvar</button>
                        <button onClick={()=>setEditando(null)} className="text-xs px-3 py-1.5 rounded-lg"
                          style={{ backgroundColor:'var(--s3)', color:'var(--text3)' }}>Cancelar</button>
                      </div>
                    ) : (
                      <button onClick={()=>setEditando(p.id)} className="text-xs px-3 py-1.5 rounded-lg"
                        style={{ backgroundColor:'rgba(255,184,0,0.1)', color:'var(--amber)' }}>Editar</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Info */}
        <div className="mt-4 p-4 rounded-2xl border" style={{ backgroundColor:'rgba(0,229,255,0.05)', borderColor:'rgba(0,229,255,0.15)' }}>
          <p className="text-xs" style={{ color:'var(--text3)' }}>
            💡 Alterações nos planos afetam apenas novos assinantes. Assinantes ativos mantêm o preço contratado até renovação.
          </p>
        </div>
      </main>
    </div>
  );
}
