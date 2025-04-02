import { Nav } from '@/features/layout/nav';
import React from 'react';

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Nav />
      <main className='flex-1 bg-green-200'>{children}</main>
    </>
  );
};

export default MainLayout;
