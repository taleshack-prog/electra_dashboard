'use client';
import Sidebar from '@/components/Sidebar';
import { useState, useEffect } from 'react';

export default function Financeiro() {
  const [resgates, setResgates] = useState<any[]>([]);
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/sos').then(r=>r.json()),
      fetch('/api/usuarios').then(r=>r.json()),
    ]).then(([sos,usr])=>{
      if(sos.requests) setResgates(sos.requests);
      if(usr.users) setUsuarios(usr.users);
      setLoading(false);
    });
  }, []);

  const concluidos = resgates.filter(r=>r.status==='completed').length;
  const receitaTotal = concluidos * 65;
  const receitaMes = resgates.filter(r=>{
    const d=new Date(r.createdAt); const n=new Date();
    return d.getMonth()===n.getMonth()&&d.getFullYear()===n.getFullYear()&&r.status==='completed';
  }).length * 65;

  return (
    <div style={{display:'flex',minHeight:'100vh',background:'#0A0E1A',color:'#EEF2F7',fontFamily:'sans-serif'}}>
      <Sidebar />
      <main style={{marginLeft:240,flex:1,padding:32,overflowY:'auto'}}>
        <div style={{marginBottom:28}}>
          <p style={{fontSize:11,color:'rgba(238,242,247,0.35)',fontFamily:'monospace',letterSpacing:3,marginBottom:6}}>FINANCEIRO</p>
          <h1 style={{fontSize:28,fontWeight:800}}>💰 Financeiro</h1>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12,marginBottom:28}}>
          {[
            ['💰','Receita Total','R$ '+receitaTotal.toLocaleString('pt-BR'),'#00FF87','estimado'],
            ['📅','Receita do Mês','R$ '+receitaMes.toLocaleString('pt-BR'),'#00E5FF','mês atual'],
            ['🆘','Resgates Concluídos',concluidos,'#FFB800','total histórico'],
            ['👤','Usuários',usuarios.length,'#A78BFA','cadastrados'],
          ].map(([icon,label,val,cor,delta])=>(
            <div key={label as string} style={{background:'#111827',border:'1px solid rgba(255,255,255,0.07)',borderRadius:18,padding:20}}>
              <div style={{fontSize:22,marginBottom:10}}>{icon}</div>
              <div style={{fontSize:28,fontWeight:800,color:cor as string,marginBottom:4}}>{val as string|number}</div>
              <div style={{fontSize:11,color:'rgba(238,242,247,0.4)'}}>{label as string}</div>
              <div style={{fontSize:11,color:'rgba(238,242,247,0.3)',marginTop:4}}>{delta as string}</div>
            </div>
          ))}
        </div>
        <div style={{background:'#111827',border:'1px solid rgba(255,255,255,0.07)',borderRadius:18,overflow:'hidden'}}>
          <div style={{padding:'16px 20px',borderBottom:'1px solid rgba(255,255,255,0.04)'}}>
            <h3 style={{fontSize:14,fontWeight:600,color:'#00E5FF'}}>🆘 Histórico de Resgates — Neon</h3>
          </div>
          <table style={{width:'100%',borderCollapse:'collapse'}}>
            <thead>
              <tr style={{background:'rgba(255,255,255,0.03)'}}>
                {['ID','Endereço','Urgência','Status','Valor Est.','Data'].map(h=>(
                  <th key={h} style={{padding:'12px 16px',textAlign:'left',fontSize:11,color:'rgba(238,242,247,0.4)',fontFamily:'monospace',letterSpacing:1,fontWeight:500}}>{h.toUpperCase()}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? <tr><td colSpan={6} style={{padding:20,textAlign:'center',color:'rgba(238,242,247,0.3)'}}>Carregando...</td></tr>
              : resgates.slice(0,20).map((r,i)=>(
                <tr key={i} style={{borderTop:'1px solid rgba(255,255,255,0.04)'}}>
                  <td style={{padding:'11px 16px',fontSize:12,fontFamily:'monospace',color:'rgba(238,242,247,0.4)'}}>{r.id.slice(0,8)}...</td>
                  <td style={{padding:'11px 16px',fontSize:13}}>{r.address||'—'}</td>
                  <td style={{padding:'11px 16px'}}><span style={{color:r.urgencyLevel==='high'?'#FF3B5C':r.urgencyLevel==='medium'?'#FFB800':'#00E5FF',fontSize:12,fontFamily:'monospace'}}>{r.urgencyLevel}</span></td>
                  <td style={{padding:'11px 16px'}}><span style={{color:r.status==='completed'?'#00FF87':r.status==='pending'?'#FFB800':'#00E5FF',fontSize:12}}>{r.status}</span></td>
                  <td style={{padding:'11px 16px',fontSize:13,color:'#00FF87',fontFamily:'monospace'}}>R$ {r.urgencyLevel==='high'?'85,00':'45,00'}</td>
                  <td style={{padding:'11px 16px',fontSize:12,color:'rgba(238,242,247,0.4)'}}>{new Date(r.createdAt).toLocaleDateString('pt-BR')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
