import { Metadata } from 'next';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { QUERY_KEY } from '@/constants/query-key';
import { RESUME_STATUS } from '@/constants/resume-constants';
import Typography from '@/components/ui/typography';
import { serverActionWithSentry } from '@/utils/server-action-with-sentry';
import ResumeForm from '@/features/resume/resume-form';
import { getResumeList } from '@/features/resume/api/server-services';

export const metadata: Metadata = {
  title: '🐣ChickMate - 자기소개서 작성',
  description: 'ChickMate에서 자기소개서를 관리해보세요.',
};

const { RESUME_DRAFT } = QUERY_KEY;
const { DRAFT } = RESUME_STATUS;

const ResumePage = async () => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: [RESUME_DRAFT],
    queryFn: () => serverActionWithSentry(() => getResumeList(DRAFT)),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <section className='mx-auto flex w-full max-w-[853px] flex-col gap-4'>
        <Typography as='h2' size='2xl' weight='bold'>
          <span className='mobile:text-xl'>
            <span className='text-primary-orange-600'>자소서</span>를 작성해 볼까요?
          </span>
        </Typography>
        <ResumeForm />
      </section>
    </HydrationBoundary>
  );
};

export default ResumePage;
