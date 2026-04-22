'use client';
import Sidebar from '@/components/Sidebar';

const RESGATISTAS = [
  { id:'RES-001', nome:'Carlos Resgatista', email:'carlos@rescue.com', veiculo:'Van ELECTRA V1', zona:'Centro/Sul', resgates:98,  avaliacao:4.9, ganhos:'R$ 7.240', status:'Online',  missao:'Em rota SOS-001' },
  { id:'RES-002', nome:'João Motorista',    email:'joao@rescue.com',   veiculo:'Van ELECTRA V2', zona:'Norte/Leste',resgates:67,  avaliacao:4.7, ganhos:'R$ 4.820', status:'Online',  missao:'Em atendimento' },
  { id:'RES-003', nome:'Paulo Santos',      email:'paulo@rescue.com',  veiculo:'Van ELECTRA V1', zona:'Oeste',      resgates:124, avaliacao:4.8, ganhos:'R$ 9.120', status:'Offline', missao:'—' },
  { id:'RES-004', nome:'Maria Auxiliadora', email:'maria@rescue.com',  veiculo:'Van ELECTRA V3', zona:'Centro',     resgates:45,  avaliacao:5.0, ganhos:'R$ 3.240', status:'Online',  missao:'Disponível' },
];

const statusCor = (s: string) => s==='Online'?'#00FF87':'rgba(240,244,255,0.3)';

export default function Resgatistas() {
  return (
    <div className="flex min-h-screen" style={{ backgroundColor:'var(--bg)' }}>
      <Sidebar />
      <main className="flex-1 ml-60 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold" style={{ color:'var(--text)' }}>Resgatistas</h1>
            <p className="text-sm mt-1" style={{ color:'var(--text3)' }}>{RESGATISTAS.filter(r=>r.status==='Online').length} online · {RESGATISTAS.length} total</p>
          </div>
          <button className="px-4 py-2 rounded-xl text-sm font-bold" style={{ backgroundColor:'#FF3B5C', color:'#fff' }}>+ Cadastrar resgatista</button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {RESGATISTAS.map(r => (
            <div key={r.id} className="rounded-2xl border p-4" style={{ backgroundColor:'var(--s2)', borderColor:'var(--border)' }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold"
                    style={{ backgroundColor:'rgba(255,59,92,0.15)', color:'#FF3B5C', fontSize:'16px' }}>
                    {r.nome.split(' ').map(n=>n[0]).join('').slice(0,2)}
                  </div>
                  <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2"
                    style={{ backgroundColor: statusCor(r.status), borderColor:'var(--s2)' }} />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold" style={{ color:'var(--text)' }}>{r.nome}</h3>
                  <p className="text-xs" style={{ color:'var(--text3)' }}>{r.id} · {r.zona}</p>
                </div>
                <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: statusCor(r.status)+'22', color: statusCor(r.status) }}>{r.status}</span>
              </div>

              <div className="grid grid-cols-3 gap-2 mb-3">
                {[
                  { label:'Resgates', val:r.resgates },
                  { label:'Avaliação', val:`${r.avaliacao}★` },
                  { label:'Ganhos', val:r.ganhos },
                ].map((s,i) => (
                  <div key={i} className="rounded-xl p-2 text-center" style={{ backgroundColor:'var(--s3)' }}>
                    <div className="text-sm font-bold" style={{ color:'var(--text)' }}>{s.val}</div>
                    <div className="text-xs" style={{ color:'var(--text3)' }}>{s.label}</div>
                  </div>
                ))}
              </div>

              <div className="text-xs p-2 rounded-xl mb-3" style={{ backgroundColor:'var(--s3)', color:'var(--text3)' }}>
                🚐 {r.veiculo} · {r.missao}
              </div>

              <div className="flex gap-2">
                <button className="flex-1 py-1.5 rounded-xl text-xs" style={{ backgroundColor:'rgba(0,229,255,0.1)', color:'var(--blue)' }}>Ver perfil</button>
                <button className="flex-1 py-1.5 rounded-xl text-xs" style={{ backgroundColor:'rgba(255,184,0,0.1)', color:'var(--amber)' }}>Contactar</button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
