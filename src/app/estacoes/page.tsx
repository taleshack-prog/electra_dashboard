'use client';
import Sidebar from '@/components/Sidebar';
import { useState } from 'react';

const ESTACOES = [
  { id:'EST-001', nome:'Eletroposto Central',  end:'Av. Paulista, 1000',      tipo:'DC 150kW', conectores:4, livres:3, preco:'R$ 3,20', status:'Online',     sessoes:127 },
  { id:'EST-002', nome:'BYD Charge Hub',       end:'R. Augusta, 400',         tipo:'AC 22kW',  conectores:6, livres:0, preco:'R$ 2,10', status:'Ocupado',    sessoes:89  },
  { id:'EST-003', nome:'EV Station Plus',      end:'Av. Faria Lima, 3000',    tipo:'DC 50kW',  conectores:3, livres:2, preco:'R$ 2,80', status:'Online',     sessoes:64  },
  { id:'EST-004', nome:'Green Charge SP',      end:'R. Oscar Freire, 200',    tipo:'AC 11kW',  conectores:8, livres:5, preco:'R$ 1,90', status:'Online',     sessoes:42  },
  { id:'EST-005', nome:'TechCharge Itaim',     end:'Av. Brigadeiro Faria Lima',tipo:'DC 100kW',conectores:2, livres:0, preco:'R$ 3,50', status:'Manutenção', sessoes:0   },
  { id:'EST-006', nome:'Charge & Go Pinheiros',end:'R. dos Pinheiros, 500',   tipo:'AC 22kW',  conectores:5, livres:3, preco:'R$ 2,20', status:'Online',     sessoes:38  },
];

const statusCor = (s: string) => s==='Online'?'#00FF87':s==='Ocupado'?'#FFB800':s==='Manutenção'?'#FF3B5C':'rgba(240,244,255,0.3)';

export default function Estacoes() {
  const [busca, setBusca] = useState('');
  const filtradas = ESTACOES.filter(e => e.nome.toLowerCase().includes(busca.toLowerCase()));

  return (
    <div className="flex min-h-screen" style={{ backgroundColor:'var(--bg)' }}>
      <Sidebar />
      <main className="flex-1 ml-60 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold" style={{ color:'var(--text)' }}>Estações</h1>
            <p className="text-sm mt-1" style={{ color:'var(--text3)' }}>{ESTACOES.filter(e=>e.status==='Online').length} online · {ESTACOES.filter(e=>e.status==='Manutenção').length} em manutenção</p>
          </div>
          <button className="px-4 py-2 rounded-xl text-sm font-bold" style={{ backgroundColor:'var(--blue)', color:'#000' }}>+ Nova estação</button>
        </div>

        <input value={busca} onChange={e=>setBusca(e.target.value)}
          placeholder="Buscar estação..." className="w-full px-4 py-2 rounded-xl text-sm outline-none mb-4"
          style={{ backgroundColor:'var(--s2)', border:'1px solid var(--border)', color:'var(--text)' }} />

        <div className="grid grid-cols-2 gap-4">
          {filtradas.map(e => (
            <div key={e.id} className="rounded-2xl border p-4" style={{ backgroundColor:'var(--s2)', borderColor:'var(--border)' }}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono" style={{ color:'var(--text3)' }}>{e.id}</span>
                <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: statusCor(e.status)+'22', color: statusCor(e.status) }}>{e.status}</span>
              </div>
              <h3 className="font-bold mb-1" style={{ color:'var(--text)' }}>{e.nome}</h3>
              <p className="text-xs mb-3" style={{ color:'var(--text3)' }}>📍 {e.end}</p>
              <div className="grid grid-cols-3 gap-2 mb-3">
                {[
                  { label:'Tipo', val:e.tipo },
                  { label:'Livres', val:`${e.livres}/${e.conectores}` },
                  { label:'Preço', val:e.preco+'/kWh' },
                ].map((s,i) => (
                  <div key={i} className="rounded-xl p-2 text-center" style={{ backgroundColor:'var(--s3)' }}>
                    <div className="text-xs font-bold" style={{ color:'var(--text)' }}>{s.val}</div>
                    <div className="text-xs" style={{ color:'var(--text3)' }}>{s.label}</div>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <button className="flex-1 py-1.5 rounded-xl text-xs font-bold" style={{ backgroundColor:'rgba(0,229,255,0.1)', color:'var(--blue)' }}>Detalhes</button>
                <button className="flex-1 py-1.5 rounded-xl text-xs font-bold" style={{ backgroundColor:'rgba(255,184,0,0.1)', color:'var(--amber)' }}>Editar</button>
                <button className="flex-1 py-1.5 rounded-xl text-xs font-bold" style={{ backgroundColor:'rgba(255,59,92,0.1)', color:'var(--red)' }}>Manutenção</button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
