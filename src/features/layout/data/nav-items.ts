import { PATH } from '@/constants/path-constant';

export type NavItems = {
  path: string;
  name: string;
  type: 'link' | 'button';
  icons?: string;
};

const { ON_BOARDING, SIGN_IN, SIGN_UP, MY_PAGE } = PATH;
export const Private_Nav_Items: NavItems[] = [
  {
    path: '/채용공고',
    type: 'link',
    name: '채용공고',
    icons: '',
  },
  {
    path: '/자소서',
    type: 'link',
    name: '자소서',
    icons: '',
  },
  {
    path: '/히스토리',
    type: 'link',
    name: '히스토리',
    icons: '',
  },
  {
    path: MY_PAGE,
    type: 'link',
    name: '마이페이지',
    icons: '',
  },
  {
    path: ON_BOARDING,
    type: 'button',
    name: '로그아웃',
    icons: '',
  },
];

export const Public_Nav_Items: NavItems[] = [
  {
    path: SIGN_IN,
    name: '로그인',
    type: 'link',
    icons: '',
  },
  {
    path: SIGN_UP,
    name: '회원가입',
    type: 'link',
    icons: '',
  },
];
