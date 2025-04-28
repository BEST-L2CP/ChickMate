import ErrorComponent from '@/components/common/error-component';
import LeftArrowIcon from '@/components/icons/left-arrow-icon';
import Button from '@/components/ui/button';
import LoadingSpinner from '@/components/ui/loading-spinner';
import Typography from '@/components/ui/typography';
import { HISTORY_MESSAGE } from '@/constants/message-constants';
import { PATH } from '@/constants/path-constant';
import { QUERY_KEY } from '@/constants/query-key';
import { useDeleteInterviewMutation } from '@/features/interview-history/hook/use-delete-interview-mutation';
import { useGetInterviewDetailQuery } from '@/features/interview-history/hook/use-get-interview-detail-query';
import InterviewDetailFeedback, { FeedbackItem } from '@/features/interview-history/interview-detail-feedback';
import InterviewDetailHistory from '@/features/interview-history/interview-detail-history';
import { useAsyncFuncDebounce } from '@/hooks/customs/use-async-func-debounce';
import type { InterviewHistoryType } from '@/types/DTO/interview-history-dto';
import { getErrorMessage } from '@/utils/get-error-message';
import { showNotiflixConfirm } from '@/utils/show-notiflix-confirm';
import { useQueryClient } from '@tanstack/react-query';
import clsx from 'clsx';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Notify } from 'notiflix';
import { useState } from 'react';

type Props = {
  interviewId: InterviewHistoryType['id'];
};

const { MY_PAGE } = PATH;
const SELECT_ACTIVE_TAB = {
  INTERVIEW_FEEDBACK: 'feedback',
  INTERVIEW_HISTORY: 'history',
};
const { INTERVIEW_FEEDBACK, INTERVIEW_HISTORY } = SELECT_ACTIVE_TAB;
const { TABS_COUNT } = QUERY_KEY;
const { DELETE_SUCCESS } = HISTORY_MESSAGE;

const InterviewDetailField = ({ interviewId }: Props) => {
  const [activeTab, setActiveTab] = useState<string>(INTERVIEW_FEEDBACK);
  const [isDeleting, setIsDeleting] = useState(false);
  const { data, isPending, isError, error: getError } = useGetInterviewDetailQuery(interviewId, !isDeleting);
  const { mutateAsync: deleteInterviewAsyncMutation } = useDeleteInterviewMutation();
  const debouncedDelete = useAsyncFuncDebounce(async () => await deleteInterviewAsyncMutation(interviewId));

  const queryClient = useQueryClient();
  const router = useRouter();

  const confirmDeleteHistory = () => {
    showNotiflixConfirm({
      message: '면접기록을 삭제하시곘습니까?',
      okFunction: handleDeleteHistory,
    });
  };

  const handleDeleteHistory = async () => {
    try {
      await debouncedDelete();
      setIsDeleting(true);
      Notify.success(DELETE_SUCCESS);
      router.replace(MY_PAGE);
      queryClient.invalidateQueries({ queryKey: [TABS_COUNT] });
    } catch (error) {
      setIsDeleting(false);
      Notify.failure(getErrorMessage(error));
    }
  };

  if (isPending)
    return (
      <div className='flex h-full w-full items-center justify-center'>
        <LoadingSpinner />
      </div>
    );

  if (isError) {
    return <ErrorComponent errorMessage={getError?.message} />;
  }

  const feedback = data.feedback as FeedbackItem[];

  return (
    <div className='flex h-full flex-col'>
      <div className='mb-8 flex items-center gap-7'>
        <Link href={MY_PAGE}>
          <LeftArrowIcon />
        </Link>
        <div>
          <Typography size='3xl' weight='bold' as='h2'>
            면접 결과
          </Typography>
          <Typography size='xl' as='h3' weight='normal' color='gray-500'>
            {data.resume.title}
          </Typography>
        </div>
      </div>

      <div className='flex min-h-[calc(100%-(64px+2rem)-(30px+1rem))] flex-col gap-4'>
        <div className='flex h-12 border-b'>
          <div
            className={clsx(
              'mx-4 cursor-pointer pb-3',
              activeTab === INTERVIEW_FEEDBACK && 'border-b-4 border-primary-orange-600'
            )}
            onClick={() => setActiveTab(INTERVIEW_FEEDBACK)}
          >
            <Typography
              size='xl'
              weight='bold'
              as='h4'
              color={activeTab === INTERVIEW_FEEDBACK ? 'primary-600' : 'gray-500'}
            >
              최종 평가
            </Typography>
          </div>
          <div
            className={clsx(
              'mx-4 cursor-pointer pb-3',
              activeTab === INTERVIEW_HISTORY && 'border-b-4 border-primary-orange-600'
            )}
            onClick={() => setActiveTab(INTERVIEW_HISTORY)}
          >
            <Typography
              size='xl'
              weight='bold'
              as='h4'
              color={activeTab === INTERVIEW_HISTORY ? 'primary-600' : 'gray-500'}
            >
              면접 기록
            </Typography>
          </div>
        </div>
        {activeTab === INTERVIEW_FEEDBACK && <InterviewDetailFeedback feedback={feedback} />}
        {activeTab === INTERVIEW_HISTORY && <InterviewDetailHistory data={data} />}
      </div>

      <div className='mt-auto pt-6'>
        <Button size='fixed' onClick={confirmDeleteHistory}>
          삭제하기
        </Button>
      </div>
    </div>
  );
};

export default InterviewDetailField;
