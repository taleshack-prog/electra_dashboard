'use client';
import Sidebar from '@/components/Sidebar';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface Resgatista {
  id: string;
  nome: string;
  email?: string;
  veiculo?: string;
  zona: string;
  resgates?: number;
  avaliacao: number;
  status: string;
  created_at?: string;
}

const statusCor = (s: string) => s === 'online' ? '#00FF87' : 'rgba(240,244,255,0.25)';
const statusLabel = (s: string) => s === 'online' ? 'Online' : 'Offline';

export default function Resgatistas() {
  const [resgatistas, setResgatistas] = useState<Resgatista[]>([]);
  const [loading, setLoading]         = useState(true);
  const [busca, setBusca]             = useState('');

  useEffect(() => {
    carregarResgatistas();
    const channel = supabase
      .channel('resgatistas-dashboard')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'resgatistas' }, () => {
        carregarResgatistas();
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  const carregarResgatistas = async () => {
    const { data } = await supabase
      .from('resgatistas')
      .select('*')
      .order('nome');
    if (data) setResgatistas(data);
    setLoading(false);
  };

  const filtrados = resgatistas.filter(r =>
    r.nome?.toLowerCase().includes(busca.toLowerCase()) ||
    r.zona?.toLowerCase().includes(busca.toLowerCase())
  );

  const online  = resgatistas.filter(r => r.status === 'online').length;
  const offline = resgatistas.filter(r => r.status !== 'online').length;

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: 'var(--bg)' }}>
      <Sidebar />
      <main className="flex-1 ml-60 p-6 overflow-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>Resgatistas</h1>
            <p className="text-sm mt-1" style={{ color: 'var(--text3)' }}>
              {loading ? 'Carregando...' : `${online} online · ${offline} offline · ${resgatistas.length} total`}
            </p>
          </div>
          <div className="flex gap-3">
            <button onClick={carregarResgatistas} className="px-4 py-2 rounded-xl text-sm"
              style={{ backgroundColor: 'var(--s3)', color: 'var(--text2)' }}>↻ Atualizar</button>
            <button className="px-4 py-2 rounded-xl text-sm font-bold"
              style={{ backgroundColor: '#FF3B5C', color: '#fff' }}>+ Cadastrar</button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: 'Online agora',  val: online,             cor: '#00FF87', icon: '🟢' },
            { label: 'Offline',       val: offline,            cor: 'rgba(240,244,255,0.3)', icon: '⚫' },
            { label: 'Total na rede', val: resgatistas.length, cor: '#00E5FF', icon: '🚐' },
          ].map((k, i) => (
            <div key={i} className="rounded-2xl border p-4"
              style={{ backgroundColor: 'var(--s2)', borderColor: 'var(--border)' }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs uppercase tracking-widest font-mono" style={{ color: 'var(--text3)' }}>{k.label}</span>
                <span>{k.icon}</span>
              </div>
              <div className="text-3xl font-bold" style={{ color: k.cor }}>{loading ? '...' : k.val}</div>
            </div>
          ))}
        </div>

        <input value={busca} onChange={e => setBusca(e.target.value)}
          placeholder="Buscar por nome ou zona..."
          className="w-full px-4 py-2 rounded-xl text-sm outline-none mb-4"
          style={{ backgroundColor: 'var(--s2)', border: '1px solid var(--border)', color: 'var(--text)' }} />

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="text-4xl mb-4 animate-pulse">🚐</div>
              <p style={{ color: 'var(--text3)' }}>Carregando resgatistas...</p>
            </div>
          </div>
        ) : filtrados.length === 0 ? (
          <div className="flex items-center justify-center py-20 rounded-2xl border"
            style={{ backgroundColor: 'var(--s2)', borderColor: 'var(--border)' }}>
            <p style={{ color: 'var(--text3)' }}>Nenhum resgatista encontrado</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {filtrados.map(r => (
              <div key={r.id} className="rounded-2xl border p-4"
                style={{ backgroundColor: 'var(--s2)', borderColor: 'var(--border)' }}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-base"
                      style={{ backgroundColor: 'rgba(255,59,92,0.15)', color: '#FF3B5C' }}>
                      {r.nome?.split(' ').map((n: string) => n[0]).join('').slice(0,2).toUpperCase()}
                    </div>
                    <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2"
                      style={{ backgroundColor: statusCor(r.status), borderColor: 'var(--s2)' }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold truncate" style={{ color: 'var(--text)' }}>{r.nome}</h3>
                    <p className="text-xs truncate" style={{ color: 'var(--text3)' }}>
                      {r.email || '—'} · {r.zona}
                    </p>
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full flex-shrink-0"
                    style={{ backgroundColor: statusCor(r.status)+'22', color: statusCor(r.status) }}>
                    {statusLabel(r.status)}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 mb-3">
                  {[
                    { label: 'Resgates', val: r.resgates ?? '—' },
                    { label: 'Avaliação', val: r.avaliacao ? `${r.avaliacao}★` : '—' },
                    { label: 'Zona', val: r.zona ?? '—' },
                  ].map((s, i) => (
                    <div key={i} className="rounded-xl p-2 text-center" style={{ backgroundColor: 'var(--s3)' }}>
                      <div className="text-sm font-bold" style={{ color: 'var(--text)' }}>{s.val}</div>
                      <div className="text-xs" style={{ color: 'var(--text3)' }}>{s.label}</div>
                    </div>
                  ))}
                </div>

                {r.veiculo && (
                  <div className="text-xs p-2 rounded-xl mb-3"
                    style={{ backgroundColor: 'var(--s3)', color: 'var(--text3)' }}>
                    🚐 {r.veiculo}
                  </div>
                )}

                <div className="flex gap-2">
                  <button className="flex-1 py-1.5 rounded-xl text-xs font-medium"
                    style={{ backgroundColor: 'rgba(0,229,255,0.1)', color: 'var(--blue)' }}>Ver perfil</button>
                  <button className="flex-1 py-1.5 rounded-xl text-xs font-medium"
                    style={{ backgroundColor: 'rgba(255,184,0,0.1)', color: 'var(--amber)' }}>Contactar</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
