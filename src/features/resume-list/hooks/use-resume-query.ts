import { useQuery } from '@tanstack/react-query';
import { getResume } from '@/features/resume/api/client-services';
import { QUERY_KEY } from '@/constants/query-key';
import { STALE_TIME } from '@/constants/time-constants';

const { RESUMES } = QUERY_KEY;
const { MIN } = STALE_TIME;

export const useResumeQuery = (resumeId: number) => {
  return useQuery({
    queryKey: [RESUMES, resumeId],
    queryFn: () => getResume(resumeId),
    staleTime: MIN,
    enabled: !!resumeId,
  });
};
