'use client';

import Typography from '@/components/ui/typography';
import useResumeStore from '@/features/interview/hooks/use-resume-store';
import ResumeItem from '@/features/resume-list/resume-item';
import LoadingAnimation from '@/components/common/loading-animation';
import InterviewBlockComponent from '@/features/interview/interview-block-component';
import { useModalStore } from '@/store/use-modal-store';
import { MODAL_ID } from '@/constants/modal-id-constants';
import { useResumeListQuery } from '@/features/resume-list/hooks/use-resume-list-query';

const { ALL_RESUME_LIST } = MODAL_ID;

const ResumeAllModal = () => {
  const { data: resumeList, isPending, isError } = useResumeListQuery();
  const toggleModal = useModalStore((state) => state.toggleModal);
  const { setResume } = useResumeStore();

  if (isPending) {
    return (
      <div className='mt-8 flex items-center justify-center'>
        <LoadingAnimation />
      </div>
    );
  }
  if (isError || !resumeList)
    return (
      <div className='flex h-44 max-w-[100vw] flex-col items-center justify-center'>
        <InterviewBlockComponent type='getResumeListError' />
      </div>
    );

  if (resumeList.length === 0)
    return (
      <div className='flex h-44 max-w-[100vw] flex-col items-center justify-center'>
        <InterviewBlockComponent type='emptyResumeError' />
      </div>
    );

  return (
    <div>
      <div className='mb-4 flex flex-col items-center justify-center'>
        <Typography size='2xl' weight='bold'>
          내 자소서 리스트
        </Typography>
        <Typography weight='bold' color='primary-600'>
          면접 볼 자소서를 선택하세요!
        </Typography>
      </div>
      <div>
        <ul className='flex h-full flex-col gap-4 overflow-scroll scrollbar-hide'>
          {resumeList.map((resume) => {
            return (
              <ResumeItem
                key={resume.id}
                resume={resume}
                onClick={() => {
                  setResume(resume.id);
                  toggleModal(ALL_RESUME_LIST);
                }}
              />
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default ResumeAllModal;
