import { Resume } from '@prisma/client';
import { API_HEADER, API_METHOD } from '@/constants/api-method-constants';
import { ROUTE_HANDLER_PATH } from '@/constants/path-constant';
import { fetchWithSentry } from '@/utils/fetch-with-sentry';
import type { ResumeData } from '@/types/resume';

type Props = {
  data: ResumeData;
  resumeId: number | null;
};

const { ROOT, SUBMIT, SUBMIT_DETAIL, DRAFT, DRAFT_DETAIL } = ROUTE_HANDLER_PATH.RESUME;
const { GET, POST, PATCH } = API_METHOD;
const { JSON_HEADER } = API_HEADER;

/**
 * DB에 자소서 등록 요청
 * @param {Object} data 자소서 제목, 자소서 질문/답변
 * @param {String} data.title 자소서 제목
 * @param {Array} data.fieldList 자소서 질문/답변
 * @returns resumeId 자소서 ID
 */
export const submitResume = async ({ resumeId, data }: Props): Promise<number> => {
  const isNewResume = resumeId === null;

  const url = isNewResume ? SUBMIT : SUBMIT_DETAIL(resumeId);
  const method = isNewResume ? POST : PATCH;

  const { response: savedResume } = await fetchWithSentry(url, {
    method,
    headers: JSON_HEADER,
    body: JSON.stringify(data),
  });

  return isNewResume ? savedResume.id : resumeId;
};

/**
 * DB에 자소서 임시 저장 요청
 * @param {Object} data 수정된 자소서 제목, 자소서 질문/답변
 * @returns resumeId 자소서 ID
 */
export const autoSaveResume = async ({ resumeId, data }: Props) => {
  const isNewResume = resumeId === null;

  const url = isNewResume ? DRAFT : DRAFT_DETAIL(resumeId);
  const method = isNewResume ? POST : PATCH;

  const { response: savedResume } = await fetchWithSentry(url, {
    method,
    headers: JSON_HEADER,
    body: JSON.stringify(data),
  });

  return isNewResume ? savedResume.id : resumeId;
};

/**
 * DB에서 임시 저장된 자소서 불러오는 요청
 * @returns draftResumes 임시 저장된 자소서 리스트
 */
export const getDraftResumeList = async (): Promise<Resume[]> => {
  const { response: draftResumes } = await fetchWithSentry(ROOT, {
    method: GET,
  });

  return draftResumes;
};
