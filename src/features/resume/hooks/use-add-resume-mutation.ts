import { useMutation, useQueryClient } from '@tanstack/react-query';
import { submitResume } from '@/features/resume/api/client-services';
import { QUERY_KEY } from '@/constants/query-key';
import type { ResumeData } from '@/types/resume';
import type { Resume } from '@prisma/client';
import type { UserType } from '@/types/DTO/user-dto';

const { RESUMES, TABS_COUNT, HISTORY } = QUERY_KEY;

type Props = {
  resumeId: number | null;
  data: ResumeData;
};

export const useAddResumeMutation = (userId?: UserType['id']) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ resumeId, data }: Props) => submitResume({ resumeId, data }),

    onMutate: async ({ resumeId, data }) => {
      await queryClient.cancelQueries({ queryKey: [RESUMES] });
      const previousResume = queryClient.getQueryData([RESUMES]) as Resume[];
      queryClient.setQueryData([RESUMES], (old: Resume[] = []) => {
        if (resumeId !== null) {
          return old.map((resume) => (resume.id === resumeId ? { ...resume, ...data } : resume));
        }
        return [...old, data];
      });

      return { previousResume };
    },
    onError: (error) => {
      throw error;
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [HISTORY, userId] });
      queryClient.invalidateQueries({ queryKey: [RESUMES] });
      queryClient.invalidateQueries({ queryKey: [TABS_COUNT] });
    },
  });
};
