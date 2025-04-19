import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import Typography from '@/components/ui/typography';
import { authOptions } from '@/utils/auth-option';
import CameraView from '@/features/interview/camera-view';
import { getInterviewHistory } from '@/features/interview/api/server-services';
import QuestionDisplayWithTimer from '@/features/interview/question-display-with-timer';
import QuestionStep from '@/features/interview/question-step';
import type { RouteParams } from '@/types/route-params';

export const metadata: Metadata = {
  title: 'AI 면접',
  description: 'ChickMate에서 AI와 함께 면접을 진행해보세요.',
};

const InterviewPage = async ({ params }: RouteParams) => {
  const session = await getServerSession(authOptions);
  const interviewId = Number(params.id);
  const interviewHistory = await getInterviewHistory(interviewId);

  if (!session || !interviewHistory) return null;

  if (interviewHistory.feedback) {
    return <div>이미 완료된 면접입니다.</div>;
  }

  return (
    <main className='flex flex-col gap-8 px-[50px] py-8'>
      <section className='flex w-full flex-col gap-4'>
        <div className='flex items-center justify-between'>
          <Typography size='2xl' weight='bold'>
            집중하세요! <span className='text-primary-orange-600'>면접이 시작됐습니다</span>
          </Typography>
          <QuestionStep />
        </div>
        <div className='flex h-[335px] gap-5'>
          <div className='flex-1 rounded-lg border border-cool-gray-200 bg-white'>면접관</div>
          <CameraView />
        </div>
      </section>
      <QuestionDisplayWithTimer interviewHistory={interviewHistory} />
    </main>
  );
};

export default InterviewPage;
