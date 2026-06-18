import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ELECTRA Dashboard',
  description: 'Painel Administrativo ELECTRA',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body style={{ margin: 0, padding: 0, background: '#0A0E1A', color: '#EEF2F7', fontFamily: 'sans-serif' }}>
        {children}
      </body>
    </html>
  );
}
