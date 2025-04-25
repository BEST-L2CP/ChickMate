'use client';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Notify } from 'notiflix';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { useExperienceUp } from '@/features/character/hooks/use-experience-up';
import { userMetaFormSchema, UserMetaSchema } from '@/features/user-meta-data/data/user-meta-form-schema';
import useMetaDataMutation from '@/features/user-meta-data/hooks/use-meta-data-mutation';
import { useMetaDataQuery } from '@/features/user-meta-data/hooks/use-meta-data-query';
import { FetchError } from '@/utils/custom-fetch-error';
import { useCharacterStore } from '@/store/use-character-store';
import { useModalStore } from '@/store/use-modal-store';
import type { UserType } from '@/types/DTO/user-dto';
import { CHARACTER_HISTORY_KEY } from '@/constants/character-constants';
import { USER_META_DATA_FORM_MESSAGE } from '@/constants/message-constants';
import { MODAL_ID } from '@/constants/modal-id-constants';
import { PATH } from '@/constants/path-constant';
import { QUERY_KEY } from '@/constants/query-key';
import { DEFAULT, USER_META_DATA_KEY } from '@/constants/user-meta-data-constants';
import type { SelectBoxType } from '@/types/select-box';
import type { UserMetaDataType } from '@/types/user-meta-data-type';

const { EXPERIENCE_NAME, REQUIRED_EDUCATION_NAME, JOB_MID_CODE_NAME, LOCATION_NAME, ETC } = USER_META_DATA_KEY;
const {
  AUTH: { SIGN_IN },
} = PATH;
const {
  API: { POST_DATA_SUCCESS, CHARACTER_POST_SUCCESS },
} = USER_META_DATA_FORM_MESSAGE;
const { USER_META_DATA } = MODAL_ID;
const { FILL_OUT_META_DATA } = CHARACTER_HISTORY_KEY;
const { JOB_POSTING } = QUERY_KEY;

export const useMetaDataForm = (userId: UserType['id']) => {
  const { data: metaData, isPending: isMetaDataPending } = useMetaDataQuery({ userId });
  const { mutateAsync, error } = useMetaDataMutation(userId);
  const toggleModal = useModalStore((state) => state.toggleModal);
  const { handleExperienceUp } = useExperienceUp();
  const characterId = useCharacterStore((state) => state.characterId);
  const queryClient = useQueryClient();
  const router = useRouter();

  const isFirstTime = metaData === null && characterId !== null;

  const {
    setValue,
    watch,
    trigger,
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<UserMetaSchema>({
    defaultValues: {
      [EXPERIENCE_NAME]: DEFAULT,
      [REQUIRED_EDUCATION_NAME]: DEFAULT,
      [JOB_MID_CODE_NAME]: DEFAULT,
      [LOCATION_NAME]: DEFAULT,
      [ETC]: null,
    },
    mode: 'onBlur',
    resolver: zodResolver(userMetaFormSchema),
  });

  useEffect(() => {
    if (metaData) {
      reset({
        [EXPERIENCE_NAME]: metaData?.[EXPERIENCE_NAME] ?? DEFAULT,
        [REQUIRED_EDUCATION_NAME]: metaData?.[REQUIRED_EDUCATION_NAME] ?? DEFAULT,
        [JOB_MID_CODE_NAME]: metaData?.[JOB_MID_CODE_NAME] ?? DEFAULT,
        [LOCATION_NAME]: metaData?.[LOCATION_NAME] ?? DEFAULT,
        [ETC]: metaData?.[ETC] ?? null,
      });
    }
  }, [metaData, reset]);

  const handleSelect = useCallback(
    (key: keyof UserMetaDataType, selected: SelectBoxType['value']) => {
      setValue(key, selected);
      trigger(key);
    },
    [setValue, trigger]
  );

  const handleOnSubmit = async (values: UserMetaDataType) => {
    try {
      await mutateAsync(values);
      if (isFirstTime) handleExperienceUp(FILL_OUT_META_DATA);
      alert(isFirstTime ? CHARACTER_POST_SUCCESS : POST_DATA_SUCCESS);
      toggleModal(USER_META_DATA);
      queryClient.invalidateQueries({
        queryKey: [JOB_POSTING, userId],
        exact: true,
      });
    } catch (error) {
      if (error instanceof FetchError) {
        // toast형식의 notify를 쓰고 있기 때문에 유저의 상호작용 없이 로그아웃 페이지로 이동하게 됨.
        // -> 유저가 에러 메세지를 보지도 못하고 로그인 페이지로 이동
        // -> 따라서 setTimeout을 설정해서 에러 메세지를 볼 수 있는 시간을 벌어둠
        if (error.status === 401) setTimeout(() => router.replace(SIGN_IN), 1500);
        Notify.failure(error.message);
      }
      if (error instanceof Error) Notify.failure(error.message); // 방어코드 + 추후 fetchError 삭제 시 이 친구만 사용
    }
  };

  return {
    userId,
    watch,
    register,
    errors,
    handleSubmit,
    handleOnSubmit,
    handleSelect,
    isMetaDataPending,
    isFirstTime,
  };
};
