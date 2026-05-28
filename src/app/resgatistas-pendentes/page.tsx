'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function ResgatistasPage() {
  const [pendentes, setPendentes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchPendentes(); }, []);

  const fetchPendentes = async () => {
    const { data } = await supabase
      .from('resgatistas_pendentes')
      .select('*')
      .order('created_at', { ascending: false });
    setPendentes(data || []);
    setLoading(false);
  };

  const aprovar = async (r) => {
    const res = await fetch('/api/aprovar-resgatista', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: r.id, email: r.email, nome: r.nome, telefone: r.telefone, veiculo_modelo: r.veiculo_modelo, veiculo_placa: r.veiculo_placa }),
    });
    const data = await res.json();
    if (data.ok) {
      await supabase.from('resgatistas_pendentes').update({ status: 'aprovado' }).eq('id', r.id);
      fetchPendentes();
      alert('Resgatista aprovado!\nEmail: ' + r.email + '\nSenha: ' + data.senha);
    } else {
      alert('Erro: ' + data.error);
    }
  };

  const rejeitar = async (id) => {
    await supabase.from('resgatistas_pendentes').update({ status: 'rejeitado' }).eq('id', id);
    fetchPendentes();
  };

  const badge = (status) => {
    const colors = { pendente: 'bg-yellow-500', aprovado: 'bg-green-500', rejeitado: 'bg-red-500' };
    return colors[status] || 'bg-gray-500';
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <h1 className="text-2xl font-bold mb-2">🚐 Cadastros de Resgatistas</h1>
      <p className="text-gray-400 mb-6">Aprovação de novos resgatistas para a plataforma</p>

      {loading ? <p className="text-gray-400">Carregando...</p> : (
        <div className="space-y-4">
          {pendentes.length === 0 && <p className="text-gray-500">Nenhum cadastro pendente.</p>}
          {pendentes.map(r => (
            <div key={r.id} className="bg-gray-900 rounded-xl p-5 border border-gray-800">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h2 className="text-lg font-bold">{r.nome}</h2>
                  <p className="text-gray-400 text-sm">{r.email} · {r.telefone}</p>
                </div>
                <span className={"px-3 py-1 rounded-full text-xs font-bold text-white " + badge(r.status)}>
                  {r.status.toUpperCase()}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm text-gray-400 mb-4">
                <span>📋 CPF: {r.cpf || '—'}</span>
                <span>🪪 CNH: {r.cnh || '—'}</span>
                <span>🚐 Veículo: {r.veiculo_modelo || '—'}</span>
                <span>🔢 Placa: {r.veiculo_placa || '—'}</span>
                <span>📅 {new Date(r.created_at).toLocaleDateString('pt-BR')}</span>
              </div>
              {r.status === 'pendente' && (
                <div className="flex gap-3">
                  <button onClick={() => aprovar(r)}
                    className="flex-1 bg-green-600 hover:bg-green-500 text-white font-bold py-2 rounded-lg transition-colors">
                    ✅ Aprovar
                  </button>
                  <button onClick={() => rejeitar(r.id)}
                    className="flex-1 bg-red-800 hover:bg-red-700 text-white font-bold py-2 rounded-lg transition-colors">
                    ✗ Rejeitar
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
