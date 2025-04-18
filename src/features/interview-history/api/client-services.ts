import { API_HEADER, API_METHOD } from '@/constants/api-method-constants';
import { ROUTE_HANDLER_PATH } from '@/constants/path-constant';
import { fetchWithSentry } from '@/utils/fetch-with-sentry';
import type { User, InterviewHistory, Resume } from '@prisma/client';
const {
  USER: { INTERVIEW_HISTORY },
} = ROUTE_HANDLER_PATH;
const { GET } = API_METHOD;
const { JSON_HEADER } = API_HEADER;

type Params = {
  userId: User['id'];
  pageParam: number;
  limit: number;
};

type Return = {
  id: InterviewHistory['id'];
  interviewer: InterviewHistory['interviewType'];
  title: Resume['title'];
  isFeedbackCompleted: boolean;
  createdAt: string;
};

export const getInterviewHistories = async ({
  userId,
  pageParam,
  limit,
}: Params): Promise<{ histories: Return[]; nextPage: number | null }> => {
  const queryParams = new URLSearchParams({
    page: String(pageParam),
    limit: String(limit),
  });

  const url = `${INTERVIEW_HISTORY}/${userId}?${queryParams}`;

  const response = await fetchWithSentry(url, {
    method: GET,
    headers: JSON_HEADER,
  });

  return {
    histories: response.data,
    nextPage: response.nextPage,
  };
};
