import { API_HEADER, API_METHOD } from '@/constants/api-method-constants';
import { ROUTE_HANDLER_PATH } from '@/constants/path-constant';
import { fetchWithSentry } from '@/utils/fetch-with-sentry';
import { JobPosting, UserSelectedJob } from '@prisma/client';

const { BOOKMARK } = ROUTE_HANDLER_PATH.JOB;
const { GET } = API_METHOD;
const { JSON_HEADER } = API_HEADER;

type Props = {
  pageParam: number;
  limit: number;
};

type Return = UserSelectedJob & { jobPosting: JobPosting };
export const getSelectedBookmark = async ({
  pageParam,
  limit,
}: Props): Promise<{ bookmarkList: Return[]; nextPage: number | null }> => {
  const queryParams = new URLSearchParams({
    page: String(pageParam),
    limit: String(limit),
  });

  const url = `${BOOKMARK}?${queryParams}`;
  const { response, nextPage } = await fetchWithSentry(url, {
    method: GET,
    headers: JSON_HEADER,
  });

  return {
    bookmarkList: response,
    nextPage,
  };
};
