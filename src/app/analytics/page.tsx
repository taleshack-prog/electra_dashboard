'use client';
import Sidebar from '@/components/Sidebar';
import { useState, useEffect } from 'react';

function MetricBar({val,max,cor}:{val:number;max:number;cor:string}) {
  return (
    <div style={{height:6,background:'rgba(255,255,255,0.06)',borderRadius:3,overflow:'hidden',marginTop:6}}>
      <div style={{width:`${max>0?Math.round(val/max*100):0}%`,height:'100%',background:cor,borderRadius:3,transition:'width 0.5s'}} />
    </div>
  );
}

export default function Analytics() {
  const [estacoes, setEstacoes] = useState<any[]>([]);
  const [resgates, setResgates] = useState<any[]>([]);
  const [resgatistas, setResgatistas] = useState<any[]>([]);
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/estacoes').then(r=>r.json()),
      fetch('/api/sos').then(r=>r.json()),
      fetch('/api/resgatistas/lista').then(r=>r.json()),
      fetch('/api/usuarios').then(r=>r.json()),
    ]).then(([est,sos,drv,usr])=>{
      if(est.stations) setEstacoes(est.stations);
      if(sos.requests) setResgates(sos.requests);
      if(drv.drivers) setResgatistas(drv.drivers);
      if(usr.users) setUsuarios(usr.users);
      setLoading(false);
    });
  }, []);

  const sosPending=resgates.filter(r=>r.status==='pending').length;
  const sosCompleted=resgates.filter(r=>r.status==='completed').length;
  const sosAccepted=resgates.filter(r=>r.status==='accepted').length;
  const driversOnline=resgatistas.filter(r=>r.isAvailable).length;
  const driversAprovados=resgatistas.filter(r=>r.status==='aprovado').length;
  const estacoesLivres=estacoes.filter(e=>e.status==='available').length;

  return (
    <div style={{display:'flex',minHeight:'100vh',background:'#0A0E1A',color:'#EEF2F7',fontFamily:'sans-serif'}}>
      <Sidebar />
      <main style={{marginLeft:240,flex:1,padding:32,overflowY:'auto'}}>
        <div style={{marginBottom:28}}>
          <p style={{fontSize:11,color:'rgba(238,242,247,0.35)',fontFamily:'monospace',letterSpacing:3,marginBottom:6}}>DADOS</p>
          <h1 style={{fontSize:28,fontWeight:800}}>📊 Analytics — Neon</h1>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12,marginBottom:28}}>
          {[['👤','Usuários',usuarios.length,'#A78BFA'],['⚡','Estações',estacoes.length,'#00E5FF'],['🚐','Resgatistas',resgatistas.length,'#FF3B5C'],['🆘','Resgates',resgates.length,'#FFB800']].map(([icon,label,val,cor])=>(
            <div key={label as string} style={{background:'#111827',border:'1px solid rgba(255,255,255,0.07)',borderRadius:18,padding:20}}>
              <div style={{fontSize:22,marginBottom:8}}>{icon}</div>
              <div style={{fontSize:32,fontWeight:800,color:cor as string}}>{loading?'...':val as number}</div>
              <div style={{fontSize:12,color:'rgba(238,242,247,0.4)',marginTop:4}}>{label as string}</div>
            </div>
          ))}
        </div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:20}}>
          <div style={{background:'#111827',border:'1px solid rgba(255,255,255,0.07)',borderRadius:18,padding:20}}>
            <h3 style={{fontSize:14,fontWeight:600,marginBottom:16,color:'#FF3B5C'}}>🆘 Resgates SOS</h3>
            {[['Pendentes',sosPending,resgates.length,'#FFB800'],['Em andamento',sosAccepted,resgates.length,'#00E5FF'],['Concluídos',sosCompleted,resgates.length,'#00FF87']].map(([l,v,m,c])=>(
              <div key={l as string} style={{marginBottom:14}}>
                <div style={{display:'flex',justifyContent:'space-between',fontSize:13}}>
                  <span style={{color:'rgba(238,242,247,0.6)'}}>{l as string}</span>
                  <span style={{fontWeight:700,color:c as string}}>{v as number}</span>
                </div>
                <MetricBar val={v as number} max={m as number} cor={c as string} />
              </div>
            ))}
          </div>
          <div style={{background:'#111827',border:'1px solid rgba(255,255,255,0.07)',borderRadius:18,padding:20}}>
            <h3 style={{fontSize:14,fontWeight:600,marginBottom:16,color:'#00E5FF'}}>⚡ Estações</h3>
            {[['Disponíveis',estacoesLivres,estacoes.length,'#00FF87'],['Ocupadas',estacoes.filter(e=>e.status==='occupied').length,estacoes.length,'#FFB800'],['Manutenção',estacoes.filter(e=>e.status==='maintenance').length,estacoes.length,'#FF3B5C']].map(([l,v,m,c])=>(
              <div key={l as string} style={{marginBottom:14}}>
                <div style={{display:'flex',justifyContent:'space-between',fontSize:13}}>
                  <span style={{color:'rgba(238,242,247,0.6)'}}>{l as string}</span>
                  <span style={{fontWeight:700,color:c as string}}>{v as number}</span>
                </div>
                <MetricBar val={v as number} max={m as number} cor={c as string} />
              </div>
            ))}
          </div>
          <div style={{background:'#111827',border:'1px solid rgba(255,255,255,0.07)',borderRadius:18,padding:20}}>
            <h3 style={{fontSize:14,fontWeight:600,marginBottom:16,color:'#00FF87'}}>🚐 Resgatistas</h3>
            {[['Online',driversOnline,resgatistas.length,'#00FF87'],['Aprovados',driversAprovados,resgatistas.length,'#00E5FF'],['Pendentes',resgatistas.filter(r=>r.status==='pendente').length,resgatistas.length,'#FFB800']].map(([l,v,m,c])=>(
              <div key={l as string} style={{marginBottom:14}}>
                <div style={{display:'flex',justifyContent:'space-between',fontSize:13}}>
                  <span style={{color:'rgba(238,242,247,0.6)'}}>{l as string}</span>
                  <span style={{fontWeight:700,color:c as string}}>{v as number}</span>
                </div>
                <MetricBar val={v as number} max={m as number} cor={c as string} />
              </div>
            ))}
          </div>
          <div style={{background:'#111827',border:'1px solid rgba(255,255,255,0.07)',borderRadius:18,padding:20}}>
            <h3 style={{fontSize:14,fontWeight:600,marginBottom:16,color:'#A78BFA'}}>📈 Performance</h3>
            {[['Taxa conclusão SOS',resgates.length>0?Math.round(sosCompleted/resgates.length*100):0,100,'#00FF87','%'],['Estações disponíveis',estacoes.length>0?Math.round(estacoesLivres/estacoes.length*100):0,100,'#00E5FF','%'],['Resgatistas aprovados',resgatistas.length>0?Math.round(driversAprovados/resgatistas.length*100):0,100,'#A78BFA','%']].map(([l,v,m,c,u])=>(
              <div key={l as string} style={{marginBottom:14}}>
                <div style={{display:'flex',justifyContent:'space-between',fontSize:13}}>
                  <span style={{color:'rgba(238,242,247,0.6)'}}>{l as string}</span>
                  <span style={{fontWeight:700,color:c as string}}>{v as number}{u}</span>
                </div>
                <MetricBar val={v as number} max={m as number} cor={c as string} />
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
