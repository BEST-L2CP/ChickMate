import type { Metadata } from 'next';

import './global-style.css';
import { RQProvider } from '@/provider/react-query-provider';
import Header from '@/features/layout/header';
import AuthProvider from '@/provider/auth-provider';
import Footer from '@/features/layout/footer';

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
            <div id='container' className='flex min-h-[100dvh] flex-col justify-between bg-slate-500'>
              <Header />
              <main className='flex-1 bg-red-200'>{children}</main>

              <Footer />
            </div>
          </RQProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
