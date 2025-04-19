import { API_HEADER, API_METHOD } from '@/constants/api-method-constants';
import { ROUTE_HANDLER_PATH } from '@/constants/path-constant';
import { UserMetaDataType } from '@/types/user-meta-data-type';
import { fetchWithSentry } from '@/utils/fetch-with-sentry';
import { JobPosting } from '@prisma/client';

const { POSTING, BOOKMARK_DETAIL } = ROUTE_HANDLER_PATH.JOB;
const { JSON_HEADER } = API_HEADER;
const { POST, DELETE, GET } = API_METHOD;
const EMPTY_LIST_NUMBER = 0;

type UserMetaDataProps = UserMetaDataType;

export const getJobByUserMetaData = async (userMetaData: UserMetaDataProps): Promise<JobPosting[]> => {
  const { requiredEducationName, locationName, experienceName, jobMidCodeName } = userMetaData;
  const queryParams = new URLSearchParams({
    requiredEducationName,
    locationName,
    experienceName,
    jobMidCodeName,
  });
  const url = `${POSTING}?${queryParams}`;

  const { response } = await fetchWithSentry(url, {
    method: GET,
    headers: JSON_HEADER,
  });

  const jobPostingList: JobPosting[] = response;

  return jobPostingList;
};

/**
 * @function postBookmarkWithUserId
 * @param jobPostingId - 채용 공고 id(string)
 * @param isBookmarked - 북마크 여부(boolean)
 * @returns {boolean} - 북마킹 여부
 */
type BookmarkPostProps = {
  jobPostingId: number;
  isBookmarked: boolean;
};
export const postBookmarkWithJobPostingId = async ({
  jobPostingId,
  isBookmarked,
}: BookmarkPostProps): Promise<boolean> => {
  // 북마킹 여부에 따라 요청 method 달라짐
  const method = isBookmarked ? DELETE : POST;
  const url = BOOKMARK_DETAIL(jobPostingId);
  const res = await fetchWithSentry(url, {
    method,
  });

  return res ? !isBookmarked : isBookmarked;
};

/**
 * @function getBookmarkByJobPostingId
 * @param jobPostingId - 채용 공고 id(string)
 * @returns {boolean} - 북마킹 여부
 */
type BookmarkDeleteProps = {
  jobPostingId: number;
};
export const getBookmarkByJobPostingId = async ({ jobPostingId }: BookmarkDeleteProps): Promise<boolean> => {
  const url = BOOKMARK_DETAIL(jobPostingId);
  const { data } = await fetchWithSentry(url, {
    method: GET,
  });

  return data.length !== EMPTY_LIST_NUMBER;
};
