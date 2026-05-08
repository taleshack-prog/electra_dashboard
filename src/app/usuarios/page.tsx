'use client';
import Sidebar from '@/components/Sidebar';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface Profile {
  id: string;
  nome?: string;
  email?: string;
  veiculo?: string;
  plano?: string;
  status?: string;
  created_at?: string;
}

const planoCor  = (p: string) => p==='Premium'?'#00E5FF':p==='Ouro'?'#FFB800':p==='Prata'?'#A8A9AD':'#CD7F32';
const statusCor = (s: string) => s==='ativo'?'#00FF87':s==='inativo'?'rgba(240,244,255,0.3)':'#FF3B5C';

const MOCK: Profile[] = [
  { id:'1', nome:'João Silva',    email:'joao@email.com',  veiculo:'BYD Dolphin',   plano:'Prata',   status:'ativo',    created_at:'2024-01-10' },
  { id:'2', nome:'Marina Costa',  email:'marina@email.com',veiculo:'Tesla Model 3', plano:'Ouro',    status:'ativo',    created_at:'2023-12-05' },
  { id:'3', nome:'Pedro Lima',    email:'pedro@email.com', veiculo:'Hyundai IONIQ', plano:'Bronze',  status:'inativo',  created_at:'2024-03-18' },
  { id:'4', nome:'Ana Souza',     email:'ana@email.com',   veiculo:'Fiat 500e',     plano:'Prata',   status:'ativo',    created_at:'2024-02-22' },
  { id:'5', nome:'Carlos Mendes', email:'carlos@email.com',veiculo:'BYD Seal',      plano:'Premium', status:'ativo',    created_at:'2023-11-01' },
  { id:'6', nome:'Beatriz Cruz',  email:'bea@email.com',   veiculo:'Kia EV6',       plano:'Ouro',    status:'suspenso', created_at:'2024-01-30' },
];

export default function Usuarios() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading]   = useState(true);
  const [usandoMock, setUsandoMock] = useState(false);
  const [busca, setBusca]       = useState('');
  const [filtro, setFiltro]     = useState('todos');

  useEffect(() => { carregarUsuarios(); }, []);

  const carregarUsuarios = async () => {
    setLoading(true);
    const { data } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
    if (data && data.length > 0) {
      setProfiles(data);
      setUsandoMock(false);
    } else {
      setProfiles(MOCK);
      setUsandoMock(true);
    }
    setLoading(false);
  };

  const filtrados = profiles.filter(u => {
    const matchBusca  = u.nome?.toLowerCase().includes(busca.toLowerCase()) || u.email?.toLowerCase().includes(busca.toLowerCase());
    const matchFiltro = filtro === 'todos' || u.status === filtro;
    return matchBusca && matchFiltro;
  });

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: 'var(--bg)' }}>
      <Sidebar />
      <main className="flex-1 ml-60 p-6 overflow-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>Usuários</h1>
            <p className="text-sm mt-1" style={{ color: 'var(--text3)' }}>
              {loading ? 'Carregando...' : `${profiles.length} cadastrados`}
              {usandoMock && <span className="ml-2 text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor:'rgba(255,184,0,0.15)', color:'var(--amber)' }}>dados demo</span>}
            </p>
          </div>
          <div className="flex gap-3">
            <button onClick={carregarUsuarios} className="px-4 py-2 rounded-xl text-sm"
              style={{ backgroundColor:'var(--s3)', color:'var(--text2)' }}>↻ Atualizar</button>
            <button className="px-4 py-2 rounded-xl text-sm font-bold"
              style={{ backgroundColor:'var(--blue)', color:'#000' }}>+ Novo usuário</button>
          </div>
        </div>

        {usandoMock && (
          <div className="mb-4 px-4 py-3 rounded-xl text-sm flex items-center gap-2"
            style={{ backgroundColor:'rgba(255,184,0,0.08)', border:'1px solid rgba(255,184,0,0.2)', color:'var(--amber)' }}>
            ⚠ Tabela <code className="mx-1 px-1 rounded" style={{ backgroundColor:'rgba(255,184,0,0.15)' }}>profiles</code> vazia — exibindo dados demo. Cadastros reais aparecem aqui automaticamente.
          </div>
        )}

        <div className="flex gap-3 mb-4">
          <input value={busca} onChange={e => setBusca(e.target.value)}
            placeholder="Buscar por nome ou email..."
            className="flex-1 px-4 py-2 rounded-xl text-sm outline-none"
            style={{ backgroundColor:'var(--s2)', border:'1px solid var(--border)', color:'var(--text)' }} />
          {['todos','ativo','inativo','suspenso'].map(f => (
            <button key={f} onClick={() => setFiltro(f)}
              className="px-4 py-2 rounded-xl text-sm capitalize"
              style={{
                backgroundColor: filtro===f ? 'rgba(0,229,255,0.15)' : 'var(--s2)',
                border:`1px solid ${filtro===f ? 'rgba(0,229,255,0.3)' : 'var(--border)'}`,
                color: filtro===f ? 'var(--blue)' : 'var(--text3)',
              }}>{f}</button>
          ))}
        </div>

        <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor:'var(--s2)', borderColor:'var(--border)' }}>
          <table className="w-full">
            <thead>
              <tr className="border-b text-xs" style={{ borderColor:'var(--border)', color:'var(--text3)' }}>
                {['Usuário','Veículo','Plano','Status','Membro desde','Ações'].map(h => (
                  <th key={h} className="text-left px-4 py-3 font-medium uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtrados.map((u, i) => (
                <tr key={u.id} className="border-b"
                  style={{ borderColor:'var(--border)', backgroundColor: i%2===0 ? 'transparent' : 'rgba(255,255,255,0.01)' }}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                        style={{ backgroundColor:'rgba(0,229,255,0.15)', color:'var(--blue)' }}>
                        {(u.nome || u.email || '?').split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-medium text-sm" style={{ color:'var(--text)' }}>{u.nome || '—'}</div>
                        <div className="text-xs" style={{ color:'var(--text3)' }}>{u.email || '—'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm" style={{ color:'var(--text2)' }}>{u.veiculo || '—'}</td>
                  <td className="px-4 py-3">
                    {u.plano ? (
                      <span className="text-xs px-2 py-1 rounded-full font-bold"
                        style={{ backgroundColor: planoCor(u.plano)+'22', color: planoCor(u.plano) }}>{u.plano}</span>
                    ) : <span style={{ color:'var(--text3)' }}>—</span>}
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs px-2 py-1 rounded-full capitalize"
                      style={{ backgroundColor: statusCor(u.status||'ativo')+'22', color: statusCor(u.status||'ativo') }}>
                      {u.status || 'ativo'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm" style={{ color:'var(--text3)' }}>
                    {u.created_at ? new Date(u.created_at).toLocaleDateString('pt-BR') : '—'}
                  </td>
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
