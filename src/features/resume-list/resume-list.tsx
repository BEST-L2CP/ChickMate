'use client';
import LoadingAnimation from '@/components/common/loading-animation';
import { TABS } from '@/constants/my-page-constants';
import { RESUME_STATUS } from '@/constants/resume-constants';
import { getMyPagePath } from '@/features/my-page/utils/get-my-page-path';
import { useResumeInfiniteQuery } from '@/features/resume-list/hooks/use-resume-infinite-query';
import ResumeItem from '@/features/resume-list/resume-item';
import { useInfiniteScroll } from '@/hooks/customs/use-infinite-scroll';
import { useRouter } from 'next/navigation';

const { RESUME_TAB } = TABS;
const { SUBMIT } = RESUME_STATUS;
const ResumeList = () => {
  const router = useRouter();
  const { data, isPending, isError, fetchNextPage, hasNextPage, isFetchingNextPage } = useResumeInfiniteQuery(SUBMIT);
  const targetRef = useInfiniteScroll({
    fetchNextPage,
    hasNextPage,
  });

  const handleGetDetailList = (resumeId: number) => {
    router.push(getMyPagePath(RESUME_TAB, resumeId));
  };

  if (isPending) {
    return (
      <div className='flex h-[70dvh] items-center justify-center'>
        <LoadingAnimation />
      </div>
    );
  }

  if (isError) return <div>자소서 리스트를 불러오는데 실패하였습니다.</div>;

  const resumes = data.pages.flatMap((page) => page.response);

  return (
    <ul className='h-full overflow-y-auto scrollbar-hide'>
      {resumes?.map((resume, index) => {
        return (
          <ResumeItem
            key={`resume_list_${resume.id}_${index}`}
            resume={resume}
            onClick={handleGetDetailList}
            isLastChild={resumes.length === index + 1}
          />
        );
      })}
      <div className='flex h-10 w-full items-center justify-center text-sm text-gray-400' ref={targetRef}>
        {isFetchingNextPage && <span>로딩 중..</span>}
      </div>
    </ul>
  );
};

export default ResumeList;
