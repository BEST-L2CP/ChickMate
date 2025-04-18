import { API_HEADER, API_METHOD } from '@/constants/api-method-constants';
import { ROUTE_HANDLER_PATH } from '@/constants/path-constant';
import { fetchWithSentry } from '@/utils/fetch-with-sentry';
import type { Message } from '@/types/message';
import type { InterviewQnAData } from '@/types/interview';
import type { InterviewHistory } from '@prisma/client';

const { TTS, STT, INTERVIEW, INTERVIEW_START, INTERVIEW_LIVE } = ROUTE_HANDLER_PATH.AI;
const { POST, PATCH } = API_METHOD;
const { JSON_HEADER } = API_HEADER;

/**
 * Open AI TTS(Text to Speech) 통신
 * @param {String} text 서버로부터 받아온 텍스트 입력
 * @param {String} type 면접관 타입(햇살/불타는)
 * @returns
 */

type TtsProps = {
  text: string;
  type: string;
};

export const postTextToSpeech = async ({ text, type }: TtsProps): Promise<string> => {
  const { response: audioUrl } = await fetchWithSentry(TTS, {
    method: POST,
    headers: JSON_HEADER,
    body: JSON.stringify({
      text,
      type,
    }),
  });

  return audioUrl;
};

/**
 * Open AI STT(Speech to Text) 통신
 * @param blob 사용자 목소리 파일
 * @returns transcribedText 변환된 텍스트
 */

type SttProps = {
  blob: Blob;
};

export const postSpeechToText = async ({ blob }: SttProps): Promise<string> => {
  const formData = new FormData();

  const file = new File([blob], 'recording.webm', { type: `audio/webm` });
  formData.append('file', file);

  const { response: transcribedText } = await fetchWithSentry(STT, {
    method: POST,
    body: formData,
  });

  return transcribedText;
};

/**
 * @function getOpenAIResponse
 * @param messageList - 사용자와 모델간의 대화 리스트
 * @returns {Message[]}
 */
type MessageListProps = {
  messageList: Message[];
};

export const getOpenAIResponse = async ({
  messageList,
}: MessageListProps): Promise<{ messageList: Message[]; question: string }> => {
  const { response: question } = await fetchWithSentry(INTERVIEW, {
    method: POST,
    body: JSON.stringify({ messageList: messageList }),
  });

  messageList.push({
    role: 'assistant',
    content: [
      {
        type: 'text',
        text: question,
      },
    ],
  });
  return { messageList, question };
};

/**
 * DB에 인터뷰 기록 등록하는 요청
 * @param resumeId 자소서 ID
 * @param interviewType
 * @returns id 인터뷰 ID
 */
type InterviewProps = {
  resumeId: number;
  interviewType: string;
};

export const postInterview = async ({ resumeId, interviewType }: InterviewProps): Promise<number> => {
  const { response } = await fetchWithSentry(INTERVIEW_START(resumeId), {
    method: POST,
    headers: JSON_HEADER,
    body: JSON.stringify({
      resumeId,
      interviewType,
    }),
  });

  const { id } = response;

  return id;
};

/** DB에 인터뷰 기록 업데이트하는 요청
 * @param interviewId 인터뷰 기록 ID
 * @param data 면접 질문/답변 1쌍
 */
type interviewHistoryProps = {
  interviewId: number;
  content?: InterviewQnAData | {};
  feedback?: InterviewHistory['feedback'] | {};
};

export const patchInterviewHistory = async ({
  interviewId,
  content = undefined,
  feedback = undefined,
}: interviewHistoryProps) => {
  const { response: interview } = await fetchWithSentry(INTERVIEW_LIVE(interviewId), {
    method: PATCH,
    headers: JSON_HEADER,
    body: JSON.stringify({ content, feedback }),
  });

  return interview;
};
