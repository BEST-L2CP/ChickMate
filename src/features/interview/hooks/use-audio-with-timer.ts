import { useEffect, useRef, useState } from 'react';
import { useInterviewStore } from '@/store/use-interview-store';
import { FEEDBACK_PROMPT, INTERVIEW_PROMPT, USER_PROMPT } from '@/constants/interview-constants';
import { useAudioRecorder } from '@/features/interview/hooks/use-audio-recorder';
import { useTimer } from '@/features/interview/hooks/use-timer';
import { usePreventPageUnload } from '@/features/resume/hooks/use-prevent-page-load';
import {
  getOpenAIResponse,
  patchInterviewHistory,
  postSpeechToText,
  postTextToSpeech,
} from '@/features/interview/api/client-services';
import type { Message } from '@/types/message';
import type { InterviewHistoryWithResume } from '@/types/interview';

const { CALM_PROMPT, PRESSURE_PROMPT } = INTERVIEW_PROMPT;
const INTERVIEW_LIMIT_COUNT = 7;

export const useAudioWithTimer = (duration: number, interviewHistory: InterviewHistoryWithResume) => {
  const { interviewType, resume, id } = interviewHistory;
  const type = interviewType === 'calm' ? CALM_PROMPT : PRESSURE_PROMPT;
  const init_state: Message[] = [
    {
      role: 'system',
      content: [...type.content, { type: 'text', text: `지원자의 자기소개서: ${resume}` }],
    },
  ];
  const audioRef = useRef<HTMLAudioElement | null>(null);

  /** state */
  const incrementQuestionIndex = useInterviewStore((state) => state.incrementQuestionIndex);
  const [isDirty, setIsDirty] = useState<boolean>(false);
  const [messageList, setMessageList] = useState<Message[]>(init_state);
  const [interviewQnA, setInterviewQnA] = useState({
    question: '간단한 자기소개 부탁드립니다',
    answer: '',
  });
  const [isAIVoicePlaying, setIsAIVoicePlaying] = useState(false);

  /** hook */
  const { isRecording, startRecording, stopRecording } = useAudioRecorder();

  /** function */
  const handleTimerComplete = async () => {
    stopRecording();
    await stopRecordingWithTimer();
  };

  const { startTimer, stopTimer, timeLeft, formatTime } = useTimer({
    duration,
    onTimerComplete: handleTimerComplete,
  });

  // 녹음 시작
  const startRecordingWithTimer = () => {
    startRecording();
    startTimer();
    setIsDirty(true);
  };

  // 녹음 중단 (사용자 음성 -> 텍스트 변환 + DB에 저장)
  const stopRecordingWithTimer = async () => {
    stopTimer();
    setIsAIVoicePlaying(true);
    setIsDirty(true);

    const blob = await stopRecording();

    // 사용자 음성을 텍스트로 변환해주는 로직
    try {
      const answerText = await postSpeechToText({ blob });
      await getOpenAIInterviewContent(answerText);

      const content = { question: interviewQnA.question, answer: answerText };
      await patchInterviewHistory({ interviewId: id, content });

      setInterviewQnA((prev) => ({ ...prev, answer: answerText }));
      incrementQuestionIndex();
    } catch (error) {
      setIsAIVoicePlaying(false);
      if (error instanceof Error) {
        alert(error.message);
      }
    }
  };

  // AI 면접관에게 답변 보내고 질문 받아오는 로직
  const getOpenAIInterviewContent = async (answerText: string) => {
    try {
      const updatedMessageList: Message[] =
        messageList.length < INTERVIEW_LIMIT_COUNT ? [...messageList, USER_PROMPT(answerText)] : [FEEDBACK_PROMPT];

      const { messageList: newMessageList, question } = await getOpenAIResponse({ messageList: updatedMessageList });
      setMessageList(newMessageList);
      setInterviewQnA((prev) => ({ ...prev, question }));

      if (messageList.length === INTERVIEW_LIMIT_COUNT) {
        await patchInterviewHistory({ interviewId: id, feedback: question });
      } else {
        // AI 면접관 텍스트를 audio url로 반환하는 로직
        const audioUrl = await postTextToSpeech({
          text: question,
          type: interviewType,
        });

        audioRef.current = new Audio(audioUrl);
        await audioRef.current.play();

        audioRef.current.addEventListener('ended', () => setIsAIVoicePlaying(false));
      }
    } catch (error) {
      if (error instanceof Error) {
        alert(error);
      }
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
    messageList,
    isRecording,
    isAIVoicePlaying,
    timeLeft,
    formattedTime: formatTime(),
    startRecordingWithTimer,
    stopRecordingWithTimer,
  };
};
