'use client';
import { useState } from 'react';

export default function IAPage() {
  const [mensagem, setMensagem] = useState('');
  const [conversa, setConversa] = useState([]);
  const [loading, setLoading] = useState(false);

  const enviar = async () => {
    if (!mensagem.trim()) return;
    const novaMensagem = { role: 'user', content: mensagem };
    setConversa(c => [...c, novaMensagem]);
    setMensagem('');
    setLoading(true);
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mensagem }),
      });
      const data = await res.json();
      setConversa(c => [...c, { role: 'assistant', content: data.resposta, dados: data.dados }]);
    } catch (e) {
      setConversa(c => [...c, { role: 'assistant', content: 'Erro ao conectar com a IA.' }]);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <h1 className="text-2xl font-bold mb-2">🤖 IA Coordenadora ELECTRA</h1>
      <p className="text-gray-400 mb-6">Claude coordenando o ecossistema em tempo real</p>

      <div className="bg-gray-900 rounded-xl p-4 h-96 overflow-y-auto mb-4 space-y-4">
        {conversa.length === 0 && (
          <p className="text-gray-500 text-center mt-20">Faça uma pergunta sobre o sistema ELECTRA...</p>
        )}
        {conversa.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-2xl rounded-xl px-4 py-3 ${m.role === 'user' ? 'bg-cyan-600' : 'bg-gray-800'}`}>
              <p className="text-sm whitespace-pre-wrap">{m.content}</p>
              {m.dados && (
                <div className="mt-2 pt-2 border-t border-gray-700 flex gap-4 text-xs text-gray-400">
                  <span>⚡ {m.dados.estacoes} estações</span>
                  <span>🆘 {m.dados.resgates} resgates</span>
                  <span>🚐 {m.dados.resgatistas} resgatistas</span>
                </div>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-800 rounded-xl px-4 py-3">
              <p className="text-sm text-gray-400">Analisando dados...</p>
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-3">
        <input
          className="flex-1 bg-gray-800 rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-cyan-500"
          placeholder="Ex: Qual resgatista está mais próximo de Porto Alegre?"
          value={mensagem}
          onChange={e => setMensagem(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && enviar()}
        />
        <button
          onClick={enviar}
          disabled={loading}
          className="bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-black font-bold px-6 rounded-xl transition-colors"
        >
          Enviar
        </button>
      </div>
    </div>
  );
}
