'use client';

import Button from '@/components/ui/button';
import Typography from '@/components/ui/typography';
import { CHARACTER_HISTORY_KEY } from '@/constants/character-constants';
import { INTERVIEW_HISTORY_STATUS, INTERVIEW_LIMIT_COUNT } from '@/constants/interview-constants';
import { PATH } from '@/constants/path-constant';
import { QUERY_KEY } from '@/constants/query-key';
import { useExperienceUp } from '@/features/character/hooks/use-experience-up';
import { usePostAIFeedbackMutation } from '@/features/interview/hooks/use-ai-feedback-mutation';
import { usePatchInterviewHistoryMutation } from '@/features/interview/hooks/use-interview-history-mutation';
import { useCharacterStore } from '@/store/use-character-store';
import { useInterviewStore } from '@/store/use-interview-store';
import type { InterviewHistory } from '@prisma/client';
import { useQueryClient } from '@tanstack/react-query';
import { Notify } from 'notiflix';
import { useRouter } from 'next/navigation';
import { useFuncDebounce } from '@/hooks/customs/use-func-debounce';

const { MY_PAGE } = PATH;
const { INTERVIEW_COMPLETION } = CHARACTER_HISTORY_KEY;
const { TABS_COUNT, HISTORY, IN_PROGRESS } = QUERY_KEY;
const { COMPLETED } = INTERVIEW_HISTORY_STATUS;
type Props = {
  interviewHistory: InterviewHistory;
  isRecording: boolean;
  isAIVoicePlaying: boolean;
  formattedTime: {
    minutes: string;
    seconds: string;
  };
  startRecordingWithTimer: () => void;
  stopRecordingWithTimer: () => void;
};

const Timer = ({
  interviewHistory,
  isRecording,
  isAIVoicePlaying,
  formattedTime,
  startRecordingWithTimer,
  stopRecordingWithTimer,
}: Props) => {
  const router = useRouter();
  const { mutateAsync: patchInterviewHistoryMutate, error: InterviewHistoryError } = usePatchInterviewHistoryMutation();
  const { mutate: postAIFeedbackMutate, error: aiFeedbackError } = usePostAIFeedbackMutation();
  const queryClient = useQueryClient();
  const characterId = useCharacterStore((state) => state.characterId);
  const setCompleted = useInterviewStore((state) => state.setCompleted);
  const { handleExperienceUp } = useExperienceUp();

  const handleButtonClick = () => {
    setTimeout(() => {
      if (isRecording) {
        stopRecordingWithTimer();
      } else {
        startRecordingWithTimer();
      }
    }, 1000); // 바로 대답하기 클릭 시 stt오류 발생하여 delay를 걸어둠 -> 최소 1초는 지나야 대답하기 버튼 클릭할 수 있음
  };

  const handleCompletedButtonClick = async () => {
    try {
      if (characterId) {
        //@TODO: 캐릭터 아이디 있을 때만
        handleExperienceUp(INTERVIEW_COMPLETION);
        alert('경험치 획득 완료!'); //@TODO: 경험치 정의 완료된 후에 alert 리팩토링하면서 상수로 빼겠습니다.
      }

      setCompleted(true);

      await patchInterviewHistoryMutate({ interviewId: interviewHistory.id, status: COMPLETED });
      queryClient.invalidateQueries({ queryKey: [HISTORY] });
      queryClient.removeQueries({ queryKey: [IN_PROGRESS] });

      postAIFeedbackMutate(interviewHistory.id);
      queryClient.invalidateQueries({
        queryKey: [TABS_COUNT],
      });
      router.push(MY_PAGE);
    } catch (error) {
      Notify.failure((error as Error).message);
    }
  };

  const questionIndex = useInterviewStore((state) => state.questionIndex);
  const isFinalQuestionAsked = questionIndex >= INTERVIEW_LIMIT_COUNT;

  const debouncedCompleteInterview = useFuncDebounce(handleCompletedButtonClick, 1500);
  if (InterviewHistoryError) {
    alert(InterviewHistoryError.message);
  }
  if (aiFeedbackError) {
    alert(aiFeedbackError.message);
  }

  return (
    <div className='flex h-[220px] w-[526px] flex-shrink-0 flex-col items-center justify-center gap-4 rounded-lg border border-cool-gray-200 bg-cool-gray-10 p-8'>
      <div className='flex flex-col items-center'>
        <Typography size='2xl' weight='bold'>
          {isFinalQuestionAsked ? '완료 버튼을 누르고 피드백을 확인해보세요' : '제한시간 안에 답변을 완료하세요'}
        </Typography>
        <Typography size='sm' weight='medium' color='gray-500'>
          {!isFinalQuestionAsked && '타이머가 종료되면 자동으로 답변이 종료됩니다'}
        </Typography>
      </div>
      <div>
        {!isFinalQuestionAsked && (
          <Typography color='primary-600' size='6xl' weight='black'>
            {formattedTime.minutes} : {formattedTime.seconds}
          </Typography>
        )}
      </div>
      <div>
        {isFinalQuestionAsked ? (
          <Button square onClick={debouncedCompleteInterview}>
            면접 완료하기
          </Button>
        ) : (
          <Button disabled={isAIVoicePlaying} square onClick={handleButtonClick}>
            {isRecording ? '답변 완료하기' : isAIVoicePlaying ? '질문 생성 중...' : '말하기'}
          </Button>
        )}
      </div>
    </div>
  );
};

export default Timer;
