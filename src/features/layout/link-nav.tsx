import Link from 'next/link';
import type { NavItems } from './data/nav-items';

type Props = {
  menu: NavItems;
};

const LinkNav = ({ menu }: Props) => {
  return (
    <Link href={menu.path}>
      {menu?.icons}
      {menu.name}
    </Link>
  );
};

export default LinkNav;
