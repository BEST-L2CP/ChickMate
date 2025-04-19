'use client';

import Timer from '@/features/interview/timer';
import { useAudioWithTimer } from '@/features/interview/hooks/use-audio-with-timer';
import QuestionDisplay from './question-display';
import { InterviewHistory } from '@prisma/client';

const MINUTES_IN_MS = 1 * 60 * 1000;

type Props = {
  interviewHistory: InterviewHistory;
};

const QuestionDisplayWithTimer = ({ interviewHistory }: Props) => {
  const { isRecording, isAIVoicePlaying, formattedTime, aiQuestion, startRecordingWithTimer, stopRecordingWithTimer } =
    useAudioWithTimer({ duration: MINUTES_IN_MS, interviewHistory });

  return (
    <section className='flex gap-5'>
      <QuestionDisplay interviewHistory={interviewHistory} aiQuestion={aiQuestion} />
      <Timer
        isRecording={isRecording}
        isAIVoicePlaying={isAIVoicePlaying}
        formattedTime={formattedTime}
        startRecordingWithTimer={startRecordingWithTimer}
        stopRecordingWithTimer={stopRecordingWithTimer}
      />
    </section>
  );
};

export default QuestionDisplayWithTimer;
