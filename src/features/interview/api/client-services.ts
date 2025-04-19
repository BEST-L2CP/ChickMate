import { API_HEADER, API_METHOD } from '@/constants/api-method-constants';
import { ROUTE_HANDLER_PATH } from '@/constants/path-constant';
import { fetchWithSentry } from '@/utils/fetch-with-sentry';

const { TTS, STT, ROOT, INTERVIEW_START, INTERVIEW_LIVE } = ROUTE_HANDLER_PATH.AI;
const { POST, PATCH } = API_METHOD;
const { JSON_HEADER } = API_HEADER;

/**
 * Open AI TTS(Text to Speech) 통신
 * @param {String} aiQuestion AI가 제공한 질문
 * @param {String} interviewType 인터뷰 타입(calm / pressure)
 * @returns
 */

type TtsProps = {
  aiQuestion: string;
  interviewType: string;
};

export const postTextToSpeech = async ({ aiQuestion, interviewType }: TtsProps): Promise<string> => {
  const { response: audioUrl } = await fetchWithSentry(TTS, {
    method: POST,
    headers: JSON_HEADER,
    body: JSON.stringify({
      aiQuestion,
      interviewType,
    }),
  });

  return audioUrl;
};

/**
 * Open AI STT(Speech to Text) 통신
 * @param blob 사용자 목소리 파일
 * @returns transcribedText 변환된 텍스트
 */
type STTProps = {
  blob: Blob;
  interviewId: number;
};

export const postSpeechToText = async ({ blob, interviewId }: STTProps): Promise<string> => {
  const formData = new FormData();

  const file = new File([blob], 'recording.webm', { type: `audio/webm` });
  formData.append('file', file);
  formData.append('interviewHistoryId', String(interviewId));

  const { response: transcribedText } = await fetchWithSentry(STT, {
    method: POST,
    body: formData,
  });

  return transcribedText;
};

/**
 * Open AI API 통신
 * @param {String} userAnswer  사용자 답변
 * @param {Number} interviewId 인텨뷰 히스토리 ID
 * @param {String} interviewType 인터뷰 타입(calm / pressure)
 * @returns
 */

type OpenAIProps = {
  userAnswer: string;
  interviewId: number;
  interviewType: string;
};

export const postOpenAIQuestion = async ({ userAnswer, interviewId, interviewType }: OpenAIProps): Promise<string> => {
  const { response: question } = await fetchWithSentry(ROOT, {
    method: POST,
    body: JSON.stringify({ userAnswer, interviewId, interviewType }),
  });

  return question;
};

/**
 * DB에 인터뷰 기록 등록하는 요청
 * @param resumeId 자소서 ID
 * @param interviewType 인터뷰 타입(calm / pressure)
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
 */

export const patchInterviewHistoryStatus = async (interviewId: number) => {
  await fetchWithSentry(INTERVIEW_LIVE(interviewId), {
    method: PATCH,
    headers: JSON_HEADER,
  });
};
