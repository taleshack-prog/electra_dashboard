'use client';
import Sidebar from '@/components/Sidebar';
import { useState } from 'react';

export default function Configuracoes() {
  const [taxaPlataforma, setTaxaPlataforma] = useState('10');
  const [tempoExpiracao, setTempoExpiracao] = useState('5');
  const [raioResgate, setRaioResgate]       = useState('15');

  return (
    <div className="flex min-h-screen" style={{ backgroundColor:'var(--bg)' }}>
      <Sidebar />
      <main className="flex-1 ml-60 p-6">
        <h1 className="text-2xl font-bold mb-6" style={{ color:'var(--text)' }}>Configurações</h1>
        <div className="grid grid-cols-2 gap-6">
          {[
            { titulo:'Plataforma', campos:[
              { label:'Taxa da plataforma (%)', val:taxaPlataforma, set:setTaxaPlataforma },
              { label:'Tempo expiração SOS (min)', val:tempoExpiracao, set:setTempoExpiracao },
              { label:'Raio máximo resgate (km)', val:raioResgate, set:setRaioResgate },
            ]},
            { titulo:'Notificações Sistema', campos:[
              { label:'Email alertas críticos', val:'admin@electra.com', set:()=>{} },
              { label:'Webhook Slack', val:'https://hooks.slack.com/...', set:()=>{} },
            ]},
          ].map((secao,i) => (
            <div key={i} className="rounded-2xl border p-6" style={{ backgroundColor:'var(--s2)', borderColor:'var(--border)' }}>
              <h2 className="font-bold mb-4" style={{ color:'var(--text)' }}>{secao.titulo}</h2>
              {secao.campos.map((campo,j) => (
                <div key={j} className="mb-4">
                  <label className="text-xs uppercase tracking-wider mb-2 block" style={{ color:'var(--text3)' }}>{campo.label}</label>
                  <input value={campo.val} onChange={e=>campo.set(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-sm outline-none"
                    style={{ backgroundColor:'var(--s3)', border:'1px solid var(--border)', color:'var(--text)' }} />
                </div>
              ))}
              <button className="w-full py-2 rounded-xl text-sm font-bold mt-2"
                style={{ backgroundColor:'rgba(0,229,255,0.1)', color:'var(--blue)' }}>Salvar alterações</button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
