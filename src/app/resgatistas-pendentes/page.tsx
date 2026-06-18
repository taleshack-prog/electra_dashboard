'use client';
import Sidebar from '@/components/Sidebar';
import { useState, useEffect } from 'react';

export default function ResgatistasP() {
  const [drivers, setDrivers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [aprovando, setAprovando] = useState<string|null>(null);

  const carregar = () => {
    fetch('/api/resgatistas/lista')
      .then(r => r.json())
      .then(d => { if (d.drivers) setDrivers(d.drivers.filter((x: any) => x.status === 'pendente')); setLoading(false); });
  };

  useEffect(() => { carregar(); }, []);

  const aprovar = async (id: string, email: string) => {
    setAprovando(id);
    try {
      await fetch('/api/resgatistas/aprovar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ driverId: id, email }),
      });
      carregar();
    } catch {}
    setAprovando(null);
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0A0E1A', color: '#EEF2F7', fontFamily: 'sans-serif' }}>
      <Sidebar />
      <main style={{ marginLeft: 240, flex: 1, padding: 32, overflowY: 'auto' }}>
        <div style={{ marginBottom: 28 }}>
          <p style={{ fontSize: 11, color: 'rgba(238,242,247,0.35)', fontFamily: 'monospace', letterSpacing: 3, marginBottom: 6 }}>APROVAÇÃO</p>
          <h1 style={{ fontSize: 28, fontWeight: 800 }}>⏳ Cadastros Pendentes</h1>
        </div>
        {loading ? <p style={{ color: 'rgba(238,242,247,0.3)' }}>Carregando...</p> :
        drivers.length === 0 ? (
          <div style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 18, padding: 40, textAlign: 'center', color: 'rgba(238,242,247,0.3)' }}>
            ✅ Nenhum cadastro pendente
          </div>
        ) : drivers.map((d, i) => (
          <div key={i} style={{ background: '#111827', border: '1px solid rgba(255,184,0,0.2)', borderRadius: 18, padding: 20, marginBottom: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>{d.name}</h3>
                <p style={{ fontSize: 13, color: 'rgba(238,242,247,0.5)', marginBottom: 2 }}>{d.email} · {d.phone || 'sem telefone'}</p>
                <p style={{ fontSize: 13, color: 'rgba(238,242,247,0.5)', marginBottom: 2 }}>CPF: {d.cpf || '—'} · CNH: {d.cnh || '—'}</p>
                <p style={{ fontSize: 13, color: 'rgba(238,242,247,0.5)' }}>Veículo: {d.vehicleModel || '—'} · Placa: {d.vehiclePlate || '—'}</p>
              </div>
              <button onClick={() => aprovar(d.id, d.email)} disabled={aprovando === d.id}
                style={{ padding: '10px 20px', background: '#00FF87', border: 'none', borderRadius: 12, color: '#070B14', fontWeight: 700, fontSize: 13, cursor: 'pointer', opacity: aprovando === d.id ? 0.7 : 1 }}>
                {aprovando === d.id ? 'Aprovando...' : '✅ Aprovar'}
              </button>
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}
