import { PATH } from '@/constants/path-constant';
import Link from 'next/link';
const { ON_BOARDING } = PATH;
const Home = () => {
  return (
    <main>
      <p>우리는 언제 불닭이 될 수 있을까?</p>
      <div>
        <p>스마트 면접 코칭 </p>
        <h1>Chick Mate</h1>
      </div>
      <p>칰메이트와 함께하는 AI 스마트 코칭 시스템!</p>
      <Link href={ON_BOARDING}>지금 바로 시작해볼까요?</Link>
    </main>
  );
};

export default Home;
