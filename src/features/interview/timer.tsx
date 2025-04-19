'use client';

import { useRouter } from 'next/navigation';
import { useCharacterStore } from '@/store/use-character-store';
import { useInterviewStore } from '@/store/use-interview-store';
import Button from '@/components/ui/button';
import Typography from '@/components/ui/typography';
import { CHARACTER_HISTORY_KEY } from '@/constants/character-constants';
import { PATH } from '@/constants/path-constant';
import { useExperienceUp } from '@/features/character/hooks/use-experience-up';
import { INTERVIEW_LIMIT_COUNT } from '@/features/interview/hooks/use-audio-with-timer';
import { InterviewHistory } from '@prisma/client';
import { usePatchInterviewHistoryMutation } from './hooks/use-interview-history-mutation';

const { MY_PAGE } = PATH;
const { INTERVIEW_COMPLETION } = CHARACTER_HISTORY_KEY;

type Props = {
  interviewHistory: InterviewHistory;
  isRecording: boolean;
  isAIVoicePlaying: boolean;
  formattedTime: {
    minutes: string;
    seconds: string;
  };
  aiQuestion: string;
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
  const { mutate: patchInterviewHistoryMutate } = usePatchInterviewHistoryMutation();

  const characterId = useCharacterStore((state) => state.characterId);
  const { handleExperienceUp } = useExperienceUp();

  const questionIndex = useInterviewStore((state) => state.questionIndex);
  const isFinalQuestionAsked = questionIndex >= INTERVIEW_LIMIT_COUNT;

  const handleButtonClick = () => {
    if (isRecording) {
      stopRecordingWithTimer();
    } else {
      startRecordingWithTimer();
    }
  };

  const handleCompletedButtonClick = async () => {
    if (!characterId) {
      patchInterviewHistoryMutate(interviewHistory.id);
      router.push(MY_PAGE);
    }

    //@TODO: 캐릭터 아이디 있을 때만
    handleExperienceUp(INTERVIEW_COMPLETION);
    alert('경험치 획득 완료!'); //@TODO: 경험치 정의 완료된 후에 alert 리팩토링하면서 상수로 빼겠습니다.

    patchInterviewHistoryMutate(interviewHistory.id);
    router.push(MY_PAGE);
  };

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
          <Button variant='outline' color='dark' square onClick={handleCompletedButtonClick}>
            면접 완료하기
          </Button>
        ) : (
          <Button variant='outline' color='dark' disabled={isAIVoicePlaying} square onClick={handleButtonClick}>
            {isRecording ? '답변 완료하기' : isAIVoicePlaying ? '질문 생성 중...' : '말하기'}
          </Button>
        )}
      </div>
    </div>
  );
};

export default Timer;
