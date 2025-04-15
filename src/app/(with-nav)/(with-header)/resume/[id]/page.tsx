import { Metadata } from 'next';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { QUERY_KEY } from '@/constants/query-key';
import Typography from '@/components/ui/typography';
import { serverActionWithSentry } from '@/utils/server-action-with-sentry';
import ResumeForm from '@/features/resume/resume-form';
import UserInfoSummary from '@/features/resume/user-info-summary';
import { getDraftResumeList } from '@/features/resume/api/server-services';

export const metadata: Metadata = {
  title: '자기소개서 작성',
  description: 'Chick Mate에서 자기소개서를 관리해보세요.',
};

const ResumePage = async () => {
  const { RESUME_DRAFT } = QUERY_KEY;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: [RESUME_DRAFT],
    queryFn: () => serverActionWithSentry(getDraftResumeList),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <main className='flex w-full gap-4 px-[50px] py-8'>
        <section className='flex w-full flex-col gap-4'>
          <Typography size='2xl' weight='bold'>
            <span className='text-primary-orange-600'>자소서</span>를 작성 해 볼까요?
          </Typography>
          <ResumeForm />
        </section>
        <UserInfoSummary />
      </main>
    </HydrationBoundary>
  );
};

export default ResumePage;
