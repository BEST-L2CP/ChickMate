'use client';

import AdminButton from '@/features/admin/admin-button';
import Image from 'next/image';
import { useState } from 'react';

const AdminPage = () => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className='flex h-full items-center justify-center'
      style={{
        background: 'radial-gradient(circle, #E55A27 30%, #ffffff 100%)',
      }}
    >
      <section
        className='group relative flex items-center gap-10 rounded-3xl border border-white/20 p-10 text-white shadow-2xl backdrop-blur-md'
        style={{
          backgroundColor: '#C2410C',
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <AdminButton />
        <div className='group relative'>
          <Image
            src='/assets/character/card/admin-character.png'
            width={200}
            height={200}
            alt='레옹병아리'
            className='rounded-full border-4 border-white transition-transform duration-500 group-hover:scale-105'
            style={{
              boxShadow: `
                0 0 10px rgba(255, 255, 255, 0.3),
                0 0 20px rgba(226, 86, 39, 0.5),
                0 0 40px rgba(194, 65, 12, 0.5)
              `,
            }}
          />
          <div className='absolute inset-0 animate-ping rounded-full border-4 border-yellow-300 opacity-30 group-hover:opacity-70'></div>
        </div>
      </section>

      <div
        className='absolute left-1/2 top-40 mb-12 -translate-x-1/2 transform animate-pulse rounded-xl bg-black/70 p-6 text-2xl text-yellow-400 shadow-xl'
        style={{
          width: 'max-content',
          transition: 'opacity 0.3s ease',
        }}
      >
        <p>일주일에 한번만 눌러라 마!</p>
        <p>안 그럼 총 맞는다!</p>
      </div>
    </div>
  );
};

export default AdminPage;
