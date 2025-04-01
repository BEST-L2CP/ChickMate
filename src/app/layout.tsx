import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './global-style.css';
import { RQProvider } from '@/provider/react-query-provider';
import Header from '@/features/layout/header';
import AuthProvider from '@/provider/auth-provider';

const suit = localFont({
  src: '../../public/fonts/SUIT-Variable.woff2',
  display: 'swap',
});

export const metadata: Metadata = {
  title: '🐣Chick Mate : 당신의 취업 메이트',
  description: '취업, 어렵지 않아요! Chick Mate가 함께할게요😉',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='ko'>
      <body>
        <AuthProvider>
          <RQProvider>
            <div className={suit.className}>
              <Header />
              {children}
            </div>
          </RQProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
