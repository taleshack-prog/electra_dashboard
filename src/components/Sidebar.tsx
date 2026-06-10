'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function Sidebar() {
  const pathname = usePathname();
  const [sosCount, setSosCount] = useState(0);

  useEffect(() => {
    carregarSOS();
    const channel = supabase
      .channel('sidebar-sos')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'rescue_requests' }, () => {
        carregarSOS();
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  const carregarSOS = async () => {
    const { count } = await supabase
      .from('rescue_requests')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'aguardando');
    setSosCount(count ?? 0);
  };

  const MENU = [
    { href: '/',              icon: '⊞', label: 'Command Center' },
    { href: '/usuarios',      icon: '👤', label: 'Usuários' },
    { href: '/estacoes',      icon: '⚡', label: 'Estações' },
    { href: '/resgates',      icon: '🆘', label: 'Resgates SOS', badge: sosCount },
    { href: '/resgatistas',   icon: '🚐', label: 'Resgatistas' },
    { href: '/financeiro',    icon: '💰', label: 'Financeiro' },
    { href: '/planos',        icon: '🛡', label: 'Planos Seguro' },
    { href: '/notificacoes',  icon: '🔔', label: 'Notificações' },
    { href: '/analytics',     icon: '📊', label: 'Analytics' },
    { href: '/ia',            icon: '🤖', label: 'IA Coordenadora' },
    { href: '/resgatistas-pendentes', icon: '🚐', label: 'Cadastros Pendentes' },
    { href: '/configuracoes', icon: '⚙',  label: 'Configurações' },
    { href: '/health', icon: '💚', label: 'Health Monitor' },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-60 flex flex-col border-r z-50"
      style={{ backgroundColor: 'var(--s1)', borderColor: 'var(--border)' }}>
      <div className="p-6 border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-lg"
            style={{ backgroundColor: 'rgba(0,229,255,0.15)', border: '1px solid rgba(0,229,255,0.3)' }}>
            ⚡
          </div>
          <div>
            <div className="font-bold text-sm" style={{ color: 'var(--text)' }}>ELECTRA</div>
            <div className="text-xs" style={{ color: 'var(--text3)', letterSpacing: '2px' }}>DASHBOARD</div>
          </div>
        </div>
      </div>
      <nav className="flex-1 p-3 overflow-y-auto">
        {MENU.map(item => {
          const active = pathname === item.href;
          return (
            <Link key={item.href} href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1 transition-all"
              style={{
                backgroundColor: active ? 'rgba(0,229,255,0.1)' : 'transparent',
                border: active ? '1px solid rgba(0,229,255,0.2)' : '1px solid transparent',
                color: active ? 'var(--blue)' : 'var(--text2)',
              }}>
              <span className="text-lg">{item.icon}</span>
              <span className="text-sm font-medium flex-1">{item.label}</span>
              {item.badge !== undefined && item.badge > 0 && (
                <span className="text-xs px-2 py-0.5 rounded-full font-bold animate-pulse"
                  style={{ backgroundColor: 'rgba(255,59,92,0.2)', color: 'var(--red)' }}>
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
            style={{ backgroundColor: 'rgba(0,229,255,0.15)', color: 'var(--blue)' }}>
            AD
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-medium truncate" style={{ color: 'var(--text)' }}>Admin ELECTRA</div>
            <div className="text-xs truncate" style={{ color: 'var(--text3)' }}>admin@electra.com</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
