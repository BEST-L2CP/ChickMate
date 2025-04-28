import { getServerSession } from 'next-auth';
import { authOptions } from '@/utils/auth-option';
import TabsField from '@/features/my-page/tabs-field';
import ViewingField from '@/features/my-page/viewing-field';

const MyPage = async () => {
  const session = await getServerSession(authOptions);

  if (!session) return null;

  return (
    <article className='flex h-full w-full items-stretch justify-evenly gap-5 px-12 py-8'>
      <ViewingField session={session} />
      <TabsField userId={session?.user.id} />
    </article>
  );
};

export default MyPage;
