import { useQuery } from '@tanstack/react-query';
import { getResumeList } from '@/features/resume/api/client-services';
import { QUERY_KEY } from '@/constants/query-key';
import { STALE_TIME } from '@/constants/time-constants';
import { RESUME_STATUS } from '@/constants/resume-constants';

const { RESUMES } = QUERY_KEY;
const { MIN } = STALE_TIME;
const { SUBMIT } = RESUME_STATUS;

export const useResumeListQuery = () => {
  return useQuery({
    queryKey: [RESUMES],
    queryFn: () => getResumeList(SUBMIT),
    staleTime: MIN,
  });
};
