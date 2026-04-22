'use client';
import Sidebar from '@/components/Sidebar';
import { useState } from 'react';

const RESGATES = [
  { id:'SOS-001', cliente:'Marina Costa', veiculo:'Tesla Model 3', bat:'8%',  local:'Av. Paulista, 900',      resgatista:'Carlos R.', tempo:'4 min',  valor:'R$ 85,00', status:'Em rota',   hora:'21:28' },
  { id:'SOS-002', cliente:'Pedro Lima',   veiculo:'Hyundai IONIQ', bat:'5%',  local:'Av. Faria Lima, 3000',   resgatista:'Pendente',  tempo:'8 min',  valor:'R$ 90,00', status:'Aguardando',hora:'21:25' },
  { id:'SOS-003', cliente:'Ana Souza',    veiculo:'Fiat 500e',     bat:'12%', local:'R. Oscar Freire, 200',   resgatista:'João M.',   tempo:'2 min',  valor:'R$ 40,00', status:'Chegando',  hora:'21:30' },
  { id:'SOS-004', cliente:'Lucas Rocha',  veiculo:'BYD Dolphin',   bat:'18%', local:'R. dos Pinheiros, 500',  resgatista:'Paulo S.',  tempo:'Concluído', valor:'R$ 42,00', status:'Concluído',hora:'20:45' },
  { id:'SOS-005', cliente:'Carla Mendes', veiculo:'BYD Seal',      bat:'6%',  local:'Av. Brigadeiro, 2000',   resgatista:'Carlos R.', tempo:'Concluído', valor:'R$ 88,00', status:'Concluído',hora:'19:12' },
];

const statusCor = (s: string) => s==='Em rota'?'#FFB800':s==='Aguardando'?'#FF3B5C':s==='Chegando'?'#00E5FF':s==='Concluído'?'#00FF87':'rgba(240,244,255,0.3)';

export default function Resgates() {
  const ativos = RESGATES.filter(r => r.status !== 'Concluído');
  const concluidos = RESGATES.filter(r => r.status === 'Concluído');

  return (
    <div className="flex min-h-screen" style={{ backgroundColor:'var(--bg)' }}>
      <Sidebar />
      <main className="flex-1 ml-60 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold" style={{ color:'var(--text)' }}>Resgates SOS</h1>
            <p className="text-sm mt-1" style={{ color:'var(--text3)' }}>{ativos.length} ativos · {concluidos.length} concluídos hoje</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs"
            style={{ backgroundColor:'rgba(255,59,92,0.1)', border:'1px solid rgba(255,59,92,0.2)', color:'var(--red)' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
            {ativos.length} SOS ativos
          </div>
        </div>

        <h2 className="text-sm font-bold mb-3" style={{ color:'var(--text3)', letterSpacing:'2px' }}>ATIVOS AGORA</h2>
        <div className="grid grid-cols-3 gap-4 mb-6">
          {ativos.map(r => (
            <div key={r.id} className="rounded-2xl border p-4" style={{ backgroundColor:'var(--s2)', borderColor: statusCor(r.status)+'44' }}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono" style={{ color:'var(--text3)' }}>{r.id}</span>
                <span className="text-xs px-2 py-1 rounded-full animate-pulse" style={{ backgroundColor: statusCor(r.status)+'22', color: statusCor(r.status) }}>{r.status}</span>
              </div>
              <h3 className="font-bold mb-1" style={{ color:'var(--text)' }}>{r.cliente}</h3>
              <p className="text-xs mb-1" style={{ color:'var(--text3)' }}>{r.veiculo} · 🔋 {r.bat}</p>
              <p className="text-xs mb-3" style={{ color:'var(--text3)' }}>📍 {r.local}</p>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs" style={{ color:'var(--text3)' }}>🚐 {r.resgatista}</span>
                <span className="text-xs font-bold" style={{ color:'#00FF87' }}>{r.valor}</span>
              </div>
              {r.resgatista === 'Pendente' && (
                <button className="w-full py-2 rounded-xl text-xs font-bold" style={{ backgroundColor:'var(--red)', color:'#fff' }}>
                  Despachar resgatista
                </button>
              )}
            </div>
          ))}
        </div>

        <h2 className="text-sm font-bold mb-3" style={{ color:'var(--text3)', letterSpacing:'2px' }}>HISTÓRICO HOJE</h2>
        <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor:'var(--s2)', borderColor:'var(--border)' }}>
          <table className="w-full">
            <thead>
              <tr className="border-b text-xs" style={{ borderColor:'var(--border)', color:'var(--text3)' }}>
                {['ID','Cliente','Local','Resgatista','Valor','Status','Hora'].map(h => (
                  <th key={h} className="text-left px-4 py-3 font-medium uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {concluidos.map(r => (
                <tr key={r.id} className="border-b" style={{ borderColor:'var(--border)' }}>
                  <td className="px-4 py-3 text-xs font-mono" style={{ color:'var(--text3)' }}>{r.id}</td>
                  <td className="px-4 py-3 text-sm font-medium" style={{ color:'var(--text)' }}>{r.cliente}</td>
                  <td className="px-4 py-3 text-xs" style={{ color:'var(--text3)' }}>{r.local}</td>
                  <td className="px-4 py-3 text-sm" style={{ color:'var(--text2)' }}>{r.resgatista}</td>
                  <td className="px-4 py-3 text-sm font-bold" style={{ color:'#00FF87' }}>{r.valor}</td>
                  <td className="px-4 py-3"><span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: statusCor(r.status)+'22', color: statusCor(r.status) }}>{r.status}</span></td>
                  <td className="px-4 py-3 text-xs font-mono" style={{ color:'var(--text3)' }}>{r.hora}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
