'use client';
import Sidebar from '@/components/Sidebar';

const TRANSACOES = [
  { id:'TXN-001', tipo:'Recarga',    usuario:'João Silva',    valor:'R$ 134,40', taxa:'R$ 13,44', liquido:'R$ 120,96', status:'Pago',    hora:'21:15' },
  { id:'TXN-002', tipo:'SOS Rescue', usuario:'Marina Costa',  valor:'R$ 85,00',  taxa:'R$ 8,50',  liquido:'R$ 76,50',  status:'Pago',    hora:'21:10' },
  { id:'TXN-003', tipo:'Recarga',    usuario:'Carla Mendes',  valor:'R$ 58,80',  taxa:'R$ 5,88',  liquido:'R$ 52,92',  status:'Pago',    hora:'21:05' },
  { id:'TXN-004', tipo:'Assinatura', usuario:'Carlos Mendes', valor:'R$ 129,90', taxa:'R$ 12,99', liquido:'R$ 116,91', status:'Pago',    hora:'20:58' },
  { id:'TXN-005', tipo:'SOS Rescue', usuario:'Pedro Lima',    valor:'R$ 90,00',  taxa:'R$ 9,00',  liquido:'R$ 81,00',  status:'Pendente',hora:'20:45' },
];

const KPI = [
  { label:'Receita hoje',    val:'R$ 48.720', sub:'+12% vs ontem', cor:'#00FF87' },
  { label:'Receita mês',     val:'R$ 847.240',sub:'+8% vs mês ant', cor:'#00E5FF' },
  { label:'Taxa média',      val:'10%',       sub:'Por transação',  cor:'#FFB800' },
  { label:'Ticket médio',    val:'R$ 87,40',  sub:'Por sessão',     cor:'#FF3B5C' },
];

export default function Financeiro() {
  return (
    <div className="flex min-h-screen" style={{ backgroundColor:'var(--bg)' }}>
      <Sidebar />
      <main className="flex-1 ml-60 p-6">
        <h1 className="text-2xl font-bold mb-6" style={{ color:'var(--text)' }}>Financeiro</h1>

        <div className="grid grid-cols-4 gap-4 mb-6">
          {KPI.map((k,i) => (
            <div key={i} className="rounded-2xl border p-4" style={{ backgroundColor:'var(--s2)', borderColor:'var(--border)' }}>
              <p className="text-xs mb-2 uppercase tracking-wider" style={{ color:'var(--text3)' }}>{k.label}</p>
              <p className="text-2xl font-bold mb-1" style={{ color: k.cor }}>{k.val}</p>
              <p className="text-xs" style={{ color:'var(--text3)' }}>{k.sub}</p>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor:'var(--s2)', borderColor:'var(--border)' }}>
          <div className="p-4 border-b flex items-center justify-between" style={{ borderColor:'var(--border)' }}>
            <h2 className="font-bold" style={{ color:'var(--text)' }}>Últimas transações</h2>
            <button className="text-xs px-3 py-1.5 rounded-xl" style={{ backgroundColor:'rgba(0,229,255,0.1)', color:'var(--blue)' }}>Exportar CSV</button>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b text-xs" style={{ borderColor:'var(--border)', color:'var(--text3)' }}>
                {['ID','Tipo','Usuário','Valor Bruto','Taxa','Líquido','Status','Hora'].map(h=>(
                  <th key={h} className="text-left px-4 py-3 font-medium uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TRANSACOES.map(t => (
                <tr key={t.id} className="border-b" style={{ borderColor:'var(--border)' }}>
                  <td className="px-4 py-3 text-xs font-mono" style={{ color:'var(--text3)' }}>{t.id}</td>
                  <td className="px-4 py-3"><span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor:'rgba(0,229,255,0.1)', color:'var(--blue)' }}>{t.tipo}</span></td>
                  <td className="px-4 py-3 text-sm" style={{ color:'var(--text)' }}>{t.usuario}</td>
                  <td className="px-4 py-3 text-sm font-bold" style={{ color:'var(--text)' }}>{t.valor}</td>
                  <td className="px-4 py-3 text-sm" style={{ color:'var(--red)' }}>-{t.taxa}</td>
                  <td className="px-4 py-3 text-sm font-bold" style={{ color:'#00FF87' }}>{t.liquido}</td>
                  <td className="px-4 py-3"><span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: t.status==='Pago'?'rgba(0,255,135,0.1)':'rgba(255,184,0,0.1)', color: t.status==='Pago'?'#00FF87':'#FFB800' }}>{t.status}</span></td>
                  <td className="px-4 py-3 text-xs font-mono" style={{ color:'var(--text3)' }}>{t.hora}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
