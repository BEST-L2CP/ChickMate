import { API_HEADER, API_METHOD } from '@/constants/api-method-constants';
import { ROUTE_HANDLER_PATH } from '@/constants/path-constant';
import { INTERVIEW_TYPE, INTERVIEW_VOICE_OPTIONS } from '@/constants/interview-constants';
import { fetchWithSentry } from '@/utils/fetch-with-sentry';
import type { Message } from '@/types/message';
import type { InterviewQnAData } from '@/types/interview';
import type { InterviewHistory } from '@prisma/client';

const { TTS, STT, INTERVIEW, INTERVIEW_START, INTERVIEW_LIVE } = ROUTE_HANDLER_PATH.AI;
const { CALM_OPTIONS, PRESSURE_OPTIONS } = INTERVIEW_VOICE_OPTIONS;
const { POST, PATCH } = API_METHOD;
const { JSON_HEADER } = API_HEADER;

const { PRESSURE } = INTERVIEW_TYPE;

/**
 * @function textToSpeech
 * @param text - 서버로부터 받아온 텍스트 입력
 * @param model - 고정된 TTS 모델 ('gpt-4o-mini-tts')
 * @param voice - default = calm('ash'), pressure('sage')
 * @param speed - default = calm(1), pressure(2.5)
 * @param response_format  - format 형식 default = 'mp3'
 * @param instruction  - 목소리 형식 default = calm
 * @returns {void}
 */

type TtsProps = {
  text: string;
  type: string;
};

export const postTextToSpeech = async ({ text, type }: TtsProps): Promise<string> => {
  const { VOICE, SPEED, INSTRUCTION } = type === PRESSURE ? PRESSURE_OPTIONS : CALM_OPTIONS;

  const { response: audioUrl } = await fetchWithSentry(TTS, {
    method: POST,
    headers: JSON_HEADER,
    body: JSON.stringify({
      text,
      voice: VOICE,
      speed: SPEED,
      instruction: INSTRUCTION,
    }),
  });

  return audioUrl;
};

/**
 * @function speechToText
 * @param blob - 사용자 목소리 파일
 * @param model - default('whisper-1')
 * @param format - default('webm')
 * @param language - default('ko')
 * @returns {text}
 */
type SttProps = {
  blob: Blob;
};

export const postSpeechToText = async ({ blob }: SttProps): Promise<string> => {
  const FORMAT = 'webm';

  const formData = new FormData();

  const file = new File([blob], 'recording.webm', { type: `audio/${FORMAT}` });
  formData.append('file', file);
  formData.append('format', FORMAT);

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
