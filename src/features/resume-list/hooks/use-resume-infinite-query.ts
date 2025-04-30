import { QUERY_KEY } from '@/constants/query-key';
import { RESUME_STATUS } from '@/constants/resume-constants';
import { useInfiniteQuery } from '@tanstack/react-query';
import { getResumeListByInfinite } from '@/features/resume/api/client-services';

const { RESUMES } = QUERY_KEY;

const ITEM_PER_PAGE = 8;
export const useResumeInfiniteQuery = (status: (typeof RESUME_STATUS)[keyof typeof RESUME_STATUS]) => {
  return useInfiniteQuery({
    queryKey: [RESUMES, 'infinity'],
    queryFn: async ({ pageParam = 1 }) => {
      const params = {
        status,
        pageParam,
        limit: ITEM_PER_PAGE,
        reqType: 'infinity',
      };

      const response = await getResumeListByInfinite(params);
      return response;
    },
    getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
    initialPageParam: 1,
    refetchIntervalInBackground: false,
  });
};
