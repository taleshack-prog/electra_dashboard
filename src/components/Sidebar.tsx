'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const pathname = usePathname();
  const [sosCount, setSosCount] = useState(0);

  useEffect(() => {
    const carregar = () => {
      fetch('/api/sos', { headers: { 'Authorization': 'Bearer admin' } })
        .then(r => r.json())
        .then(d => {
          if (d.requests) setSosCount(d.requests.filter((r: any) => r.status === 'pending').length);
        }).catch(() => {});
    };
    carregar();
    const interval = setInterval(carregar, 15000);
    return () => clearInterval(interval);
  }, []);

  const MENU = [
    { href: '/',                      icon: '⊞', label: 'Command Center' },
    { href: '/usuarios',              icon: '👤', label: 'Usuários' },
    { href: '/estacoes',              icon: '⚡', label: 'Estações' },
    { href: '/resgates',              icon: '🆘', label: 'Resgates SOS', badge: sosCount },
    { href: '/resgatistas',           icon: '🚐', label: 'Resgatistas' },
    { href: '/resgatistas-pendentes', icon: '⏳', label: 'Cadastros Pendentes' },
    { href: '/financeiro',            icon: '💰', label: 'Financeiro' },
    { href: '/planos',                icon: '🛡', label: 'Planos Seguro' },
    { href: '/notificacoes',          icon: '🔔', label: 'Notificações' },
    { href: '/analytics',             icon: '📊', label: 'Analytics' },
    { href: '/ia',                    icon: '🤖', label: 'IA Coordenadora' },
    { href: '/configuracoes',         icon: '⚙',  label: 'Configurações' },
    { href: '/health',                icon: '💚', label: 'Health Monitor' },
  ];

  return (
    <aside style={{ position: 'fixed', left: 0, top: 0, height: '100vh', width: 240, display: 'flex', flexDirection: 'column', borderRight: '1px solid rgba(255,255,255,0.07)', background: '#0D1117', zIndex: 50, overflowY: 'auto' }}>
      {/* Logo */}
      <div style={{ padding: '24px 20px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(0,229,255,0.15)', border: '1px solid rgba(0,229,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>⚡</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 14, color: '#EEF2F7' }}>ELECTRA</div>
            <div style={{ fontSize: 10, color: 'rgba(238,242,247,0.35)', letterSpacing: 2 }}>DASHBOARD</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '12px 10px', overflowY: 'auto' }}>
        {MENU.map(item => {
          const active = pathname === item.href;
          return (
            <Link key={item.href} href={item.href} style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 12, marginBottom: 2, textDecoration: 'none', transition: 'all 0.15s',
              background: active ? 'rgba(0,229,255,0.1)' : 'transparent',
              border: active ? '1px solid rgba(0,229,255,0.2)' : '1px solid transparent',
              color: active ? '#00E5FF' : 'rgba(238,242,247,0.6)',
            }}>
              <span style={{ fontSize: 16, flexShrink: 0 }}>{item.icon}</span>
              <span style={{ fontSize: 13, fontWeight: 500, flex: 1 }}>{item.label}</span>
              {item.badge !== undefined && item.badge > 0 && (
                <span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 20, fontWeight: 700, background: 'rgba(255,59,92,0.2)', color: '#FF3B5C' }}>{item.badge}</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div style={{ padding: '16px 20px', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(0,229,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#00E5FF', flexShrink: 0 }}>AD</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 500, color: '#EEF2F7', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Admin ELECTRA</div>
            <div style={{ fontSize: 11, color: 'rgba(238,242,247,0.35)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>admin@electra.com</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
