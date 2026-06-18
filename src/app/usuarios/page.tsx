'use client';
import Sidebar from '@/components/Sidebar';
import { useState, useEffect } from 'react';

export default function Usuarios() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/auth/me', { headers: { 'Authorization': 'Bearer admin' } })
      .then(() => {})
      .catch(() => {});
    fetch('/api/usuarios')
      .then(r => r.json())
      .then(d => { if (d.users) setUsers(d.users); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0A0E1A', color: '#EEF2F7', fontFamily: 'sans-serif' }}>
      <Sidebar />
      <main style={{ marginLeft: 240, flex: 1, padding: 32, overflowY: 'auto' }}>
        <div style={{ marginBottom: 28 }}>
          <p style={{ fontSize: 11, color: 'rgba(238,242,247,0.35)', fontFamily: 'monospace', letterSpacing: 3, marginBottom: 6 }}>GESTÃO</p>
          <h1 style={{ fontSize: 28, fontWeight: 800 }}>👤 Usuários</h1>
        </div>
        <div style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 18, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.03)' }}>
                {['Nome','Email','Telefone','Cadastro'].map(h => (
                  <th key={h} style={{ padding: '14px 16px', textAlign: 'left', fontSize: 11, color: 'rgba(238,242,247,0.4)', fontFamily: 'monospace', letterSpacing: 1, fontWeight: 500 }}>{h.toUpperCase()}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={4} style={{ padding: 24, textAlign: 'center', color: 'rgba(238,242,247,0.3)' }}>Carregando...</td></tr>
              ) : users.length === 0 ? (
                <tr><td colSpan={4} style={{ padding: 24, textAlign: 'center', color: 'rgba(238,242,247,0.3)' }}>Nenhum usuário</td></tr>
              ) : users.map((u, i) => (
                <tr key={i} style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                  <td style={{ padding: '12px 16px', fontSize: 14 }}>{u.name}</td>
                  <td style={{ padding: '12px 16px', fontSize: 13, color: 'rgba(238,242,247,0.5)' }}>{u.email}</td>
                  <td style={{ padding: '12px 16px', fontSize: 13, color: 'rgba(238,242,247,0.5)' }}>{u.phone || '—'}</td>
                  <td style={{ padding: '12px 16px', fontSize: 12, color: 'rgba(238,242,247,0.4)' }}>{new Date(u.createdAt).toLocaleDateString('pt-BR')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
