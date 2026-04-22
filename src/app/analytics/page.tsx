'use client';
import Sidebar from '@/components/Sidebar';

const METRICAS = [
  { label:'MAU (Usuários Ativos Mensais)', val:'12.847', delta:'+18%', cor:'#00E5FF' },
  { label:'Taxa de conversão',             val:'34.2%',  delta:'+2.1%', cor:'#00FF87' },
  { label:'Churn rate',                    val:'2.8%',   delta:'-0.4%', cor:'#FFB800' },
  { label:'NPS Score',                     val:'72',     delta:'+5 pts', cor:'#FF3B5C' },
  { label:'Sessões médias/usuário',        val:'4.2/mês',delta:'+0.3',  cor:'#00E5FF' },
  { label:'Tempo médio de sessão',         val:'48 min', delta:'+3 min', cor:'#00FF87' },
];

export default function Analytics() {
  return (
    <div className="flex min-h-screen" style={{ backgroundColor:'var(--bg)' }}>
      <Sidebar />
      <main className="flex-1 ml-60 p-6">
        <h1 className="text-2xl font-bold mb-6" style={{ color:'var(--text)' }}>Analytics</h1>
        <div className="grid grid-cols-3 gap-4 mb-6">
          {METRICAS.map((m,i) => (
            <div key={i} className="rounded-2xl border p-4" style={{ backgroundColor:'var(--s2)', borderColor:'var(--border)' }}>
              <p className="text-xs uppercase tracking-wider mb-3" style={{ color:'var(--text3)' }}>{m.label}</p>
              <p className="text-3xl font-bold mb-1" style={{ color: m.cor }}>{m.val}</p>
              <p className="text-xs" style={{ color:'#00FF87' }}>{m.delta} vs mês anterior</p>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-4">
          {['Top Estações por Receita','Top Usuários por Consumo','Resgates por Região','Horários de Pico'].map((titulo,i) => (
            <div key={i} className="rounded-2xl border p-4" style={{ backgroundColor:'var(--s2)', borderColor:'var(--border)' }}>
              <h3 className="font-bold mb-4 text-sm" style={{ color:'var(--text)' }}>{titulo}</h3>
              <div className="space-y-2">
                {[85,72,64,48,31].map((pct,j) => (
                  <div key={j} className="flex items-center gap-3">
                    <span className="text-xs w-20 truncate" style={{ color:'var(--text3)' }}>Item {j+1}</span>
                    <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ backgroundColor:'var(--s3)' }}>
                      <div className="h-2 rounded-full" style={{ width:`${pct}%`, backgroundColor:'var(--blue)' }} />
                    </div>
                    <span className="text-xs font-mono w-8" style={{ color:'var(--text2)' }}>{pct}%</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
