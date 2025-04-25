'use client';
import { Session } from 'next-auth';
import { useSearchParams } from 'next/navigation';
import MyPageCharacter from '@/features/character/my-page-character';
import MyInfo from '@/features/my-page/my-info';
import InterviewDetailField from '@/features/interview-history/interview-detail-field';
import ResumeDetailField from '@/features/resume-list/resume-detail-field';
import { sanitizeQueryParams } from '@/utils/sanitize-query-params';
import { TABS } from '@/constants/my-page-constants';

const { INTERVIEW_HISTORY_TAB, RESUME_TAB } = TABS;

type Props = {
  session: Session;
};

const ViewingField = ({ session }: Props) => {
  const searchParams = useSearchParams();
  const { id, tab } = sanitizeQueryParams(searchParams);
  const targetId = id ? Number(id) : null;
  const userId = session?.user.id ?? null;
  if (!userId) return null;
  const isDetailHistory = tab === INTERVIEW_HISTORY_TAB;
  const isDetailResume = tab === RESUME_TAB;
  return (
    <section className='flex h-[80dvh] w-1/2 flex-col'>
      {!targetId && (
        <>
          <div className='mb-8 flex w-full items-center justify-center'>
            <MyPageCharacter session={session} />
          </div>
          <div className='flex flex-1'>
            <MyInfo session={session} />
          </div>
        </>
      )}
      {targetId && isDetailHistory && <InterviewDetailField interviewId={targetId} />}
      {targetId && isDetailResume && <ResumeDetailField resumeId={targetId} userId={userId} />}
    </section>
  );
};

export default ViewingField;
