import { API_HEADER, API_METHOD } from '@/constants/api-method-constants';
import { ROUTE_HANDLER_PATH } from '@/constants/path-constant';
import type { ResumeData } from '@/types/resume';
import { fetchWithSentry } from '@/utils/fetch-with-sentry';
import { ResumeType } from '@/types/DTO/resume-dto';

type Props = {
  data: ResumeData;
  resumeId: number | null;
};

const { ROOT, DETAIL, SUBMIT, SUBMIT_DETAIL, DRAFT, DRAFT_DETAIL } = ROUTE_HANDLER_PATH.RESUME;
const { GET, POST, PATCH, DELETE } = API_METHOD;
const { JSON_HEADER } = API_HEADER;

type SubmitParams = {
  resumeId: ResumeType['id'];
  type: typeof POST | typeof PATCH;
};
/**
 * DB에 자소서 등록 요청
 * @param {Object} data 자소서 제목, 자소서 질문/답변
 * @param {String} data.title 자소서 제목
 * @param {Array} data.fieldList 자소서 질문/답변
 * @returns resumeId 자소서 ID
 */
export const submitResume = async ({ resumeId, data }: Props): Promise<SubmitParams> => {
  const isNewResume = resumeId === null;

  const url = isNewResume ? SUBMIT : SUBMIT_DETAIL(resumeId);
  const method = isNewResume ? POST : PATCH;

  const { response: savedResume } = await fetchWithSentry(url, {
    method,
    headers: JSON_HEADER,
    body: JSON.stringify(data),
  });

  return { resumeId: isNewResume ? savedResume.id : resumeId, type: method };
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
 * DB에서 자소서 리스트 불러오는 요청
 * @param {Number} status 저장 상태(등록/임시 저장)
 * @returns resumes 상태에 따른 자소서 리스트
 */
export const getResumeList = async (status: number): Promise<ResumeType[]> => {
  const url = `${ROOT}?status=${status}`;

  const { response: resumeList } = await fetchWithSentry(url, {
    method: GET,
  });

  return resumeList;
};

type ResumeListProps = {
  status: number;
  pageParam: number;
  limit: number;
};

/**
 * 특정 개수 단위로 자소서 data를 서버에서 받아옴
 * @param params - { status : 받아올 자소서의 상태 , pageParams : 초기 page, limit : 받아올 데이터의 개수 }
 * @returns page,다음 page, 해당 page에 들어있는 data
 */
export const getResumeListByInfinite = async (params: ResumeListProps) => {
  const { pageParam, limit, status } = params;
  const queryParams = new URLSearchParams({
    page: pageParam.toString(),
    limit: limit.toString(),
    status: status.toString(),
  });

  const url = `${ROOT}?${queryParams}`;

  const data = await fetchWithSentry(url, {
    method: GET,
  });

  return data;
};

/**
 * DB에서 원하는 자소서를 불러오는 요청
 * @returns {Array} draftResumes 임시 저장된 자소서 리스트
 */
export const getResume = async (resumeId: number): Promise<ResumeType> => {
  const { response: resume } = await fetchWithSentry(DETAIL(resumeId), {
    method: GET,
  });

  return resume;
};

/**
 * DB에서 자소서 삭제하는 요청
 * @param {Number} resumeId 자소서 ID
 */
export const deleteResume = async (resumeId: number): Promise<void> => {
  await fetchWithSentry(DETAIL(resumeId), {
    method: DELETE,
  });
};

export const getCheckToGetEXP = async (): Promise<boolean> => {
  const { response } = await fetchWithSentry(`${ROOT}/count`, {
    method: GET,
  });
  return response.isAbleToGetEXP;
};
