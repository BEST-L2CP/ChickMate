import { prisma } from '@/lib/prisma';
import type { User } from '@prisma/client';
import ListByTab from '@/features/my-page/list-by-tab';
import TabButtons from '@/features/my-page/tab-buttons';

type Props = {
  userId: User['id'];
};
const TabsField = async ({ userId }: Props) => {
  const result = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      _count: {
        select: {
          resumes: true,
          interviewHistories: true,
          userSelectedJobs: true,
        },
      },
    },
  });

  const tabCounts = result?._count ?? {
    resumes: 0,
    interviewHistories: 0,
    userSelectedJobs: 0,
  };

  return (
    <section className='h-[80dvh] w-1/2 max-w-[628px] rounded-t-[8px] border bg-cool-gray-10'>
      <TabButtons tabCounts={tabCounts} />
      <div className='p-8'>
        <ListByTab />
      </div>
    </section>
  );
};

export default TabsField;
