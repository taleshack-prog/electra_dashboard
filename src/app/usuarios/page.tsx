'use client';
import Sidebar from '@/components/Sidebar';
import { useState } from 'react';

const USUARIOS = [
  { id:'USR-001', nome:'João Silva',    email:'joao@email.com',  veiculo:'BYD Dolphin',   plano:'Prata', recargas:24, gasto:'R$ 1.240', status:'Ativo',    data:'Jan 2024' },
  { id:'USR-002', nome:'Marina Costa',  email:'marina@email.com', veiculo:'Tesla Model 3', plano:'Ouro',  recargas:67, gasto:'R$ 4.820', status:'Ativo',    data:'Dez 2023' },
  { id:'USR-003', nome:'Pedro Lima',    email:'pedro@email.com',  veiculo:'Hyundai IONIQ', plano:'Bronze',recargas:8,  gasto:'R$ 320',  status:'Inativo',  data:'Mar 2024' },
  { id:'USR-004', nome:'Ana Souza',     email:'ana@email.com',    veiculo:'Fiat 500e',     plano:'Prata', recargas:31, gasto:'R$ 1.860', status:'Ativo',    data:'Fev 2024' },
  { id:'USR-005', nome:'Carlos Mendes', email:'carlos@email.com', veiculo:'BYD Seal',      plano:'Premium',recargas:92,gasto:'R$ 7.240', status:'Ativo',    data:'Nov 2023' },
  { id:'USR-006', nome:'Beatriz Cruz',  email:'bea@email.com',    veiculo:'Kia EV6',       plano:'Ouro',  recargas:45, gasto:'R$ 3.150', status:'Suspenso', data:'Jan 2024' },
  { id:'USR-007', nome:'Lucas Rocha',   email:'lucas@email.com',  veiculo:'Chevrolet Bolt',plano:'Bronze',recargas:12, gasto:'R$ 480',  status:'Ativo',    data:'Abr 2024' },
  { id:'USR-008', nome:'Fernanda Lima', email:'fer@email.com',    veiculo:'Volvo EX30',    plano:'Premium',recargas:78,gasto:'R$ 5.460', status:'Ativo',    data:'Out 2023' },
];

const planoCor = (p: string) => p==='Premium'?'#00E5FF':p==='Ouro'?'#FFB800':p==='Prata'?'#A8A9AD':'#CD7F32';
const statusCor = (s: string) => s==='Ativo'?'#00FF87':s==='Inativo'?'rgba(240,244,255,0.3)':'#FF3B5C';

export default function Usuarios() {
  const [busca, setBusca] = useState('');
  const [filtro, setFiltro] = useState('todos');

  const filtrados = USUARIOS.filter(u => {
    const matchBusca = u.nome.toLowerCase().includes(busca.toLowerCase()) || u.email.toLowerCase().includes(busca.toLowerCase());
    const matchFiltro = filtro==='todos' || u.status.toLowerCase()===filtro;
    return matchBusca && matchFiltro;
  });

  return (
    <div className="flex min-h-screen" style={{ backgroundColor:'var(--bg)' }}>
      <Sidebar />
      <main className="flex-1 ml-60 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold" style={{ color:'var(--text)' }}>Usuários</h1>
            <p className="text-sm mt-1" style={{ color:'var(--text3)' }}>{USUARIOS.length} usuários cadastrados</p>
          </div>
          <button className="px-4 py-2 rounded-xl text-sm font-bold"
            style={{ backgroundColor:'var(--blue)', color:'#000' }}>+ Novo usuário</button>
        </div>

        {/* Filtros */}
        <div className="flex gap-3 mb-4">
          <input value={busca} onChange={e=>setBusca(e.target.value)}
            placeholder="Buscar por nome ou email..."
            className="flex-1 px-4 py-2 rounded-xl text-sm outline-none"
            style={{ backgroundColor:'var(--s2)', border:'1px solid var(--border)', color:'var(--text)' }} />
          {['todos','ativo','inativo','suspenso'].map(f => (
            <button key={f} onClick={()=>setFiltro(f)}
              className="px-4 py-2 rounded-xl text-sm capitalize"
              style={{
                backgroundColor: filtro===f ? 'rgba(0,229,255,0.15)' : 'var(--s2)',
                border: `1px solid ${filtro===f ? 'rgba(0,229,255,0.3)' : 'var(--border)'}`,
                color: filtro===f ? 'var(--blue)' : 'var(--text3)',
              }}>{f}</button>
          ))}
        </div>

        {/* Tabela */}
        <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor:'var(--s2)', borderColor:'var(--border)' }}>
          <table className="w-full">
            <thead>
              <tr className="border-b text-xs" style={{ borderColor:'var(--border)', color:'var(--text3)' }}>
                {['Usuário','Veículo','Plano','Recargas','Gasto Total','Status','Membro desde','Ações'].map(h => (
                  <th key={h} className="text-left px-4 py-3 font-medium tracking-wider uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtrados.map((u,i) => (
                <tr key={u.id} className="border-b transition-colors hover:opacity-80"
                  style={{ borderColor:'var(--border)', backgroundColor: i%2===0 ? 'transparent' : 'rgba(255,255,255,0.01)' }}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                        style={{ backgroundColor:'rgba(0,229,255,0.15)', color:'var(--blue)' }}>
                        {u.nome.split(' ').map(n=>n[0]).join('').slice(0,2)}
                      </div>
                      <div>
                        <div className="font-medium text-sm" style={{ color:'var(--text)' }}>{u.nome}</div>
                        <div className="text-xs" style={{ color:'var(--text3)' }}>{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm" style={{ color:'var(--text2)' }}>{u.veiculo}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs px-2 py-1 rounded-full font-bold"
                      style={{ backgroundColor: planoCor(u.plano)+'22', color: planoCor(u.plano) }}>{u.plano}</span>
                  </td>
                  <td className="px-4 py-3 text-sm font-mono" style={{ color:'var(--text2)' }}>{u.recargas}</td>
                  <td className="px-4 py-3 text-sm font-bold" style={{ color:'#00FF87' }}>{u.gasto}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs px-2 py-1 rounded-full"
                      style={{ backgroundColor: statusCor(u.status)+'22', color: statusCor(u.status) }}>{u.status}</span>
                  </td>
                  <td className="px-4 py-3 text-sm" style={{ color:'var(--text3)' }}>{u.data}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button className="text-xs px-2 py-1 rounded-lg" style={{ backgroundColor:'rgba(0,229,255,0.1)', color:'var(--blue)' }}>Ver</button>
                      <button className="text-xs px-2 py-1 rounded-lg" style={{ backgroundColor:'rgba(255,59,92,0.1)', color:'var(--red)' }}>Bloquear</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
