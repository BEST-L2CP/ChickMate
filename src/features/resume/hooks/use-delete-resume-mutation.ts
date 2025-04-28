import { QUERY_KEY } from '@/constants/query-key';
import { deleteResume } from '@/features/resume/api/client-services';
import type { UserType } from '@/types/DTO/user-dto';
import { Resume } from '@prisma/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const { RESUMES, TABS_COUNT, HISTORY } = QUERY_KEY;

export const useDeleteResumeMutation = (queryKey: string, userId?: UserType['id']) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (resumeId: number) => deleteResume(resumeId),
    onMutate: async (resumeId) => {
      await queryClient.cancelQueries({ queryKey: [queryKey] });
      const previousResume = queryClient.getQueryData([queryKey]) as Resume[];

      queryClient.setQueryData([queryKey], (old: Resume[]) => old.filter((resume) => resume.id !== resumeId));

      return { previousResume };
    },
    onError: (error, resumeId, context) => {
      if (context) {
        queryClient.setQueryData([queryKey], context.previousResume);
      }
      if (error) {
        throw error;
      }
    },
    onSettled: () => {
      if (queryKey === RESUMES) {
        if (userId) queryClient.invalidateQueries({ queryKey: [HISTORY, userId] });
        queryClient.invalidateQueries({ queryKey: [TABS_COUNT] });
      }
      queryClient.invalidateQueries({ queryKey: [queryKey] });
    },
  });
};
