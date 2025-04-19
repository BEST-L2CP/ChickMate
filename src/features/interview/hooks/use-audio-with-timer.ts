import { useEffect, useRef, useState } from 'react';
import { useInterviewStore } from '@/store/use-interview-store';
import { useAudioRecorder } from '@/features/interview/hooks/use-audio-recorder';
import { useTimer } from '@/features/interview/hooks/use-timer';
import { usePreventPageUnload } from '@/features/resume/hooks/use-prevent-page-load';
import { handleVoiceToAIFlow } from '../utils/handle-voice-to-ai-flow';
import type { InterviewHistory } from '@prisma/client';

export const INTERVIEW_LIMIT_COUNT = 3;

type Props = {
  duration: number;
  interviewHistory: InterviewHistory;
};

export const useAudioWithTimer = ({ duration, interviewHistory }: Props) => {
  const { interviewType, id: interviewId } = interviewHistory;

  const audioRef = useRef<HTMLAudioElement | null>(null);

  /** state */
  const questionIndex = useInterviewStore((state) => state.questionIndex);
  const incrementQuestionIndex = useInterviewStore((state) => state.incrementQuestionIndex);
  const [isDirty, setIsDirty] = useState<boolean>(false);
  const [isAIVoicePlaying, setIsAIVoicePlaying] = useState(false);
  const [aiQuestion, setAiQuestion] = useState<string | null>(null);

  /** hook */
  const { isRecording, startRecording, stopRecording } = useAudioRecorder();

  const handleTimerComplete = async () => {
    await stopRecordingWithTimer();
  };

  const { startTimer, stopTimer, timeLeft, formatTime } = useTimer({
    duration,
    onTimerComplete: handleTimerComplete,
  });

  /** function */

  // 녹음 시작
  const startRecordingWithTimer = () => {
    startRecording();
    startTimer();
    setIsDirty(true);
  };

  // 녹음 중단 (사용자 음성 -> 텍스트 변환 + DB에 저장)
  const stopRecordingWithTimer = async () => {
    const blob = await stopRecording();

    stopTimer();
    setIsDirty(true);
    incrementQuestionIndex();

    setIsAIVoicePlaying(true);
    const { audio, aiQuestion } = await handleVoiceToAIFlow({ blob, interviewType, interviewId });

    if (questionIndex < INTERVIEW_LIMIT_COUNT - 1) {
      setAiQuestion(aiQuestion);
      audioRef.current = audio;

      audio.play();
      audio.addEventListener('ended', () => setIsAIVoicePlaying(false));
    }
  };

  usePreventPageUnload(isDirty);

  // 페이지 벗어날 때 음성 중단
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current = null;
      }
    };
  }, []);

  return {
    isRecording,
    isAIVoicePlaying,
    timeLeft,
    formattedTime: formatTime(),
    aiQuestion,
    startRecordingWithTimer,
    stopRecordingWithTimer,
  };
};
