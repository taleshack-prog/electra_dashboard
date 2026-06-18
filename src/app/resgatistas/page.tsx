'use client';
import Sidebar from '@/components/Sidebar';
import { useState, useEffect } from 'react';

export default function Resgatistas() {
  const [drivers, setDrivers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/resgatistas/lista')
      .then(r => r.json())
      .then(d => { if (d.drivers) setDrivers(d.drivers); setLoading(false); });
  }, []);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0A0E1A', color: '#EEF2F7', fontFamily: 'sans-serif' }}>
      <Sidebar />
      <main style={{ marginLeft: 240, flex: 1, padding: 32, overflowY: 'auto' }}>
        <div style={{ marginBottom: 28 }}>
          <p style={{ fontSize: 11, color: 'rgba(238,242,247,0.35)', fontFamily: 'monospace', letterSpacing: 3, marginBottom: 6 }}>GESTÃO</p>
          <h1 style={{ fontSize: 28, fontWeight: 800 }}>🚐 Resgatistas</h1>
        </div>
        <div style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 18, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.03)' }}>
                {['Nome','Email','Veículo','Status','Disponível','Jobs','Avaliação'].map(h => (
                  <th key={h} style={{ padding: '14px 16px', textAlign: 'left', fontSize: 11, color: 'rgba(238,242,247,0.4)', fontFamily: 'monospace', letterSpacing: 1, fontWeight: 500 }}>{h.toUpperCase()}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} style={{ padding: 24, textAlign: 'center', color: 'rgba(238,242,247,0.3)' }}>Carregando...</td></tr>
              ) : drivers.length === 0 ? (
                <tr><td colSpan={7} style={{ padding: 24, textAlign: 'center', color: 'rgba(238,242,247,0.3)' }}>Nenhum resgatista cadastrado</td></tr>
              ) : drivers.map((d, i) => (
                <tr key={i} style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                  <td style={{ padding: '12px 16px', fontSize: 14 }}>{d.name}</td>
                  <td style={{ padding: '12px 16px', fontSize: 13, color: 'rgba(238,242,247,0.5)' }}>{d.email}</td>
                  <td style={{ padding: '12px 16px', fontSize: 13, color: 'rgba(238,242,247,0.5)' }}>{d.vehicleModel || '—'}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ background: d.status==='aprovado'?'rgba(0,255,135,0.15)':d.status==='pendente'?'rgba(255,184,0,0.15)':'rgba(255,59,92,0.15)', color: d.status==='aprovado'?'#00FF87':d.status==='pendente'?'#FFB800':'#FF3B5C', fontSize: 11, padding: '3px 8px', borderRadius: 20, fontFamily: 'monospace' }}>
                      {d.status}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ color: d.isAvailable ? '#00FF87' : '#FF3B5C', fontSize: 13 }}>{d.isAvailable ? '● Online' : '○ Offline'}</span>
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: 13, color: 'rgba(238,242,247,0.5)' }}>{d.totalJobs || 0}</td>
                  <td style={{ padding: '12px 16px', fontSize: 13, color: '#FFB800' }}>⭐ {d.rating || '4.5'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
