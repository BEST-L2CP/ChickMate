'use client';

import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { NavItems } from './data/nav-items';

type Props = {
  menu: NavItems;
};

const ButtonNav = ({ menu }: Props) => {
  const router = useRouter();
  const handleNavigate = () => {
    signOut();
    router.replace(menu.path);
  };

  return (
    <button onClick={handleNavigate}>
      {menu?.icons} {menu.name}
    </button>
  );
};

export default ButtonNav;
