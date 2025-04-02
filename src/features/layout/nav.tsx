'use client';
import { useSession } from 'next-auth/react';
import { useMemo } from 'react';
import { NavItems, Private_Nav_Items, Public_Nav_Items } from './data/nav-items';
import LinkNav from './link-nav';
import ButtonNav from './button-nav';

export const Nav = () => {
  const { data } = useSession();

  const menus: NavItems[] = useMemo(() => (!!data?.user ? Private_Nav_Items : Public_Nav_Items), [data]);

  return (
    <nav className='absolute left-0 top-0 h-full bg-red-950 text-white opacity-90'>
      <span>ChickMate</span>
      <ul>
        {menus.map((menu) => (
          <li key={`menu_${menu.name}`}>
            {menu.type === 'link' ? <LinkNav menu={menu} /> : <ButtonNav menu={menu} />}
          </li>
        ))}
      </ul>
    </nav>
  );
};
