'use client';
import Sidebar from '@/components/Sidebar';
import { useState, useEffect } from 'react';

export default function Resgates() {
  const [resgates, setResgates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/sos', { headers: { 'Authorization': 'Bearer admin' } })
      .then(r => r.json())
      .then(d => { if (d.requests) setResgates(d.requests); setLoading(false); });
  }, []);

  const statusCor = (s: string) => ({ pending: '#FFB800', accepted: '#00E5FF', completed: '#00FF87', cancelled: '#FF3B5C' }[s] || '#888');
  const urgCor = (u: string) => u === 'high' ? '#FF3B5C' : u === 'medium' ? '#FFB800' : '#00E5FF';

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0A0E1A', color: '#EEF2F7', fontFamily: 'sans-serif' }}>
      <Sidebar />
      <main style={{ marginLeft: 240, flex: 1, padding: 32, overflowY: 'auto' }}>
        <div style={{ marginBottom: 28 }}>
          <p style={{ fontSize: 11, color: 'rgba(238,242,247,0.35)', fontFamily: 'monospace', letterSpacing: 3, marginBottom: 6 }}>OPERAÇÕES</p>
          <h1 style={{ fontSize: 28, fontWeight: 800 }}>🆘 Resgates SOS</h1>
        </div>
        <div style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 18, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.03)' }}>
                {['Endereço','Urgência','Status','Resgatista','Data'].map(h => (
                  <th key={h} style={{ padding: '14px 16px', textAlign: 'left', fontSize: 11, color: 'rgba(238,242,247,0.4)', fontFamily: 'monospace', letterSpacing: 1, fontWeight: 500 }}>{h.toUpperCase()}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} style={{ padding: 24, textAlign: 'center', color: 'rgba(238,242,247,0.3)' }}>Carregando...</td></tr>
              ) : resgates.map((r, i) => (
                <tr key={i} style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                  <td style={{ padding: '12px 16px', fontSize: 13 }}>{r.address || 'Sem endereço'}</td>
                  <td style={{ padding: '12px 16px' }}><span style={{ color: urgCor(r.urgencyLevel), fontSize: 12, fontFamily: 'monospace' }}>{r.urgencyLevel}</span></td>
                  <td style={{ padding: '12px 16px' }}><span style={{ color: statusCor(r.status), fontSize: 12 }}>{r.status}</span></td>
                  <td style={{ padding: '12px 16px', fontSize: 12, color: 'rgba(238,242,247,0.5)' }}>{r.assignedDriverId ? r.assignedDriverId.slice(0,8)+'...' : '—'}</td>
                  <td style={{ padding: '12px 16px', fontSize: 12, color: 'rgba(238,242,247,0.4)' }}>{new Date(r.createdAt).toLocaleDateString('pt-BR')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
