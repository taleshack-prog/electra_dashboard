'use client';
import Sidebar from '@/components/Sidebar';
import { useState, useEffect } from 'react';

interface Estacao { id:string; name:string; address:string; city:string; powerKw:number; pricePerKwh:number; status:string; }
const statusCor = (s:string) => s==='available'?'#00FF87':s==='maintenance'?'#FF3B5C':'#FFB800';
const statusLabel = (s:string) => s==='available'?'Disponível':s==='maintenance'?'Manutenção':'Ocupado';

export default function Estacoes() {
  const [estacoes, setEstacoes] = useState<Estacao[]>([]);
  const [busca, setBusca] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/estacoes').then(r=>r.json()).then(d=>{ if(d.stations) setEstacoes(d.stations); setLoading(false); });
  }, []);

  const filtradas = estacoes.filter(e =>
    e.name?.toLowerCase().includes(busca.toLowerCase()) ||
    e.address?.toLowerCase().includes(busca.toLowerCase()) ||
    e.city?.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div style={{display:'flex',minHeight:'100vh',background:'#0A0E1A',color:'#EEF2F7',fontFamily:'sans-serif'}}>
      <Sidebar />
      <main style={{marginLeft:240,flex:1,padding:32,overflowY:'auto'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:28}}>
          <div>
            <p style={{fontSize:11,color:'rgba(238,242,247,0.35)',fontFamily:'monospace',letterSpacing:3,marginBottom:6}}>GESTÃO</p>
            <h1 style={{fontSize:28,fontWeight:800}}>⚡ Estações</h1>
          </div>
          <input value={busca} onChange={e=>setBusca(e.target.value)} placeholder="Buscar estação..."
            style={{padding:'10px 16px',background:'#111827',border:'1px solid rgba(255,255,255,0.08)',borderRadius:12,color:'#EEF2F7',fontSize:13,outline:'none',width:220}} />
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12,marginBottom:24}}>
          {[['⚡','Total',estacoes.length,'#00E5FF'],['🟢','Disponíveis',estacoes.filter(e=>e.status==='available').length,'#00FF87'],['🟡','Ocupadas',estacoes.filter(e=>e.status==='occupied').length,'#FFB800'],['🔴','Manutenção',estacoes.filter(e=>e.status==='maintenance').length,'#FF3B5C']].map(([icon,label,val,cor])=>(
            <div key={label as string} style={{background:'#111827',border:'1px solid rgba(255,255,255,0.07)',borderRadius:14,padding:16}}>
              <div style={{fontSize:20,marginBottom:6}}>{icon}</div>
              <div style={{fontSize:24,fontWeight:800,color:cor as string}}>{val as number}</div>
              <div style={{fontSize:11,color:'rgba(238,242,247,0.4)',marginTop:2}}>{label as string}</div>
            </div>
          ))}
        </div>
        <div style={{background:'#111827',border:'1px solid rgba(255,255,255,0.07)',borderRadius:18,overflow:'hidden'}}>
          <table style={{width:'100%',borderCollapse:'collapse'}}>
            <thead>
              <tr style={{background:'rgba(255,255,255,0.03)'}}>
                {['Nome','Endereço','Cidade','Potência','Preço/kWh','Status'].map(h=>(
                  <th key={h} style={{padding:'14px 16px',textAlign:'left',fontSize:11,color:'rgba(238,242,247,0.4)',fontFamily:'monospace',letterSpacing:1,fontWeight:500}}>{h.toUpperCase()}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? <tr><td colSpan={6} style={{padding:24,textAlign:'center',color:'rgba(238,242,247,0.3)'}}>Carregando...</td></tr>
              : filtradas.length===0 ? <tr><td colSpan={6} style={{padding:24,textAlign:'center',color:'rgba(238,242,247,0.3)'}}>Nenhuma estação encontrada</td></tr>
              : filtradas.map((e,i)=>(
                <tr key={i} style={{borderTop:'1px solid rgba(255,255,255,0.04)'}}>
                  <td style={{padding:'12px 16px',fontSize:14,fontWeight:600}}>{e.name}</td>
                  <td style={{padding:'12px 16px',fontSize:13,color:'rgba(238,242,247,0.5)'}}>{e.address}</td>
                  <td style={{padding:'12px 16px',fontSize:13,color:'rgba(238,242,247,0.5)'}}>{e.city}</td>
                  <td style={{padding:'12px 16px',fontSize:13,color:'#00E5FF',fontFamily:'monospace'}}>{e.powerKw}kW</td>
                  <td style={{padding:'12px 16px',fontSize:13,color:'#00FF87',fontFamily:'monospace'}}>R${e.pricePerKwh}/kWh</td>
                  <td style={{padding:'12px 16px'}}>
                    <span style={{background:statusCor(e.status)+'22',color:statusCor(e.status),fontSize:11,padding:'3px 10px',borderRadius:20,fontFamily:'monospace'}}>{statusLabel(e.status)}</span>
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
