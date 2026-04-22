'use client';
import Sidebar from '@/components/Sidebar';
import { useState } from 'react';

export default function Notificacoes() {
  const [titulo, setTitulo] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [publico, setPublico] = useState('todos');
  const [enviadas] = useState([
    { titulo:'Manutenção programada', msg:'Sistema ficará offline 02h-04h domingo', publico:'Todos', data:'20/04', lidas:12847 },
    { titulo:'Nova estação aberta!', msg:'Eletroposto Centro expandido com 4 novos conectores DC', publico:'SP Capital', data:'19/04', lidas:8234 },
    { titulo:'Oferta especial SOS', msg:'30% desconto no próximo resgate para usuários Ouro', publico:'Plano Ouro', data:'18/04', lidas:3421 },
  ]);

  return (
    <div className="flex min-h-screen" style={{ backgroundColor:'var(--bg)' }}>
      <Sidebar />
      <main className="flex-1 ml-60 p-6">
        <h1 className="text-2xl font-bold mb-6" style={{ color:'var(--text)' }}>Notificações</h1>
        <div className="grid grid-cols-2 gap-6">
          <div className="rounded-2xl border p-6" style={{ backgroundColor:'var(--s2)', borderColor:'var(--border)' }}>
            <h2 className="font-bold mb-4" style={{ color:'var(--text)' }}>Enviar notificação</h2>
            <div className="mb-4">
              <label className="text-xs uppercase tracking-wider mb-2 block" style={{ color:'var(--text3)' }}>Público alvo</label>
              <select value={publico} onChange={e=>setPublico(e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-sm outline-none"
                style={{ backgroundColor:'var(--s3)', border:'1px solid var(--border)', color:'var(--text)' }}>
                {['todos','Plano Bronze','Plano Prata','Plano Ouro','Plano Premium','SP Capital','Rio de Janeiro'].map(o=>(
                  <option key={o} value={o}>{o==='todos'?'Todos os usuários':o}</option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="text-xs uppercase tracking-wider mb-2 block" style={{ color:'var(--text3)' }}>Título</label>
              <input value={titulo} onChange={e=>setTitulo(e.target.value)}
                placeholder="Título da notificação"
                className="w-full px-3 py-2 rounded-xl text-sm outline-none"
                style={{ backgroundColor:'var(--s3)', border:'1px solid var(--border)', color:'var(--text)' }} />
            </div>
            <div className="mb-6">
              <label className="text-xs uppercase tracking-wider mb-2 block" style={{ color:'var(--text3)' }}>Mensagem</label>
              <textarea value={mensagem} onChange={e=>setMensagem(e.target.value)}
                placeholder="Conteúdo da notificação..."
                rows={4} className="w-full px-3 py-2 rounded-xl text-sm outline-none resize-none"
                style={{ backgroundColor:'var(--s3)', border:'1px solid var(--border)', color:'var(--text)' }} />
            </div>
            <button className="w-full py-3 rounded-xl font-bold"
              style={{ backgroundColor: titulo&&mensagem?'var(--blue)':'var(--s3)', color: titulo&&mensagem?'#000':'var(--text3)' }}>
              🔔 Enviar notificação
            </button>
          </div>

          <div>
            <h2 className="font-bold mb-4" style={{ color:'var(--text)' }}>Enviadas recentemente</h2>
            {enviadas.map((n,i) => (
              <div key={i} className="rounded-2xl border p-4 mb-3" style={{ backgroundColor:'var(--s2)', borderColor:'var(--border)' }}>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-sm" style={{ color:'var(--text)' }}>{n.titulo}</h3>
                  <span className="text-xs" style={{ color:'var(--text3)' }}>{n.data}</span>
                </div>
                <p className="text-xs mb-3" style={{ color:'var(--text3)' }}>{n.msg}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor:'rgba(0,229,255,0.1)', color:'var(--blue)' }}>{n.publico}</span>
                  <span className="text-xs" style={{ color:'var(--text3)' }}>👁 {n.lidas.toLocaleString()} lidas</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
