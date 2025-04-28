'use client';
import { CHARACTER_HISTORY_KEY } from '@/constants/character-constants';
import { RESUME_MESSAGE } from '@/constants/message-constants';
import { TABS } from '@/constants/my-page-constants';
import { AUTO_SAVE_STATUS } from '@/constants/resume-constants';
import { DELAY_TIME } from '@/constants/time-constants';
import { useExperienceUp } from '@/features/character/hooks/use-experience-up';
import { getMyPagePath } from '@/features/my-page/utils/get-my-page-path';
import { autoSaveResume, getCheckToGetEXP } from '@/features/resume/api/client-services';
import { defaultQuestionList } from '@/features/resume/data/default-question-list';
import { useAddResumeMutation } from '@/features/resume/hooks/use-add-resume-mutation';
import { usePreventPageUnload } from '@/features/resume/hooks/use-prevent-page-load';
import useDebounce from '@/hooks/customs/use-debounce';
import { useAsyncFuncDebounce } from '@/hooks/customs/use-async-func-debounce';
import { useCharacterStore } from '@/store/use-character-store';
import type { ResumeType } from '@/types/DTO/resume-dto';
import type { Field } from '@/types/resume';
import { getErrorMessage } from '@/utils/get-error-message';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Notify } from 'notiflix';
import { useEffect, useState } from 'react';

const { DEFAULT } = DELAY_TIME;
const { SAVING, SAVED } = AUTO_SAVE_STATUS;
const { RESUME_SUBMISSION } = CHARACTER_HISTORY_KEY;
const { RESUME_TAB } = TABS;

export const useResumeForm = (resume?: ResumeType) => {
  const session = useSession();
  const userId = session.data?.user?.id ?? null;
  const router = useRouter();
  const characterId = useCharacterStore((state) => state.characterId);

  const { handleExperienceUp } = useExperienceUp();

  const { mutate: addResumeMutateAsync } = useAddResumeMutation(userId!);

  /** state */
  const [isDirty, setIsDirty] = useState<boolean>(false);
  const [title, setTitle] = useState<string>(resume?.title || '');
  const [fieldList, setFieldList] = useState<Field[]>((resume?.content as Field[]) || defaultQuestionList);
  const [resumeId, setResumeId] = useState<number | null>(resume?.id || null);
  const [autoSaveStatus, setAutoSaveStatus] = useState<string>(SAVING);

  const {
    SUBMIT: { SUCCESS_WITH_EXP, SUCCESS },
  } = RESUME_MESSAGE;

  /** function */
  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLInputElement>) => {
    setTitle(event.target.value);
    setIsDirty(true);
    setAutoSaveStatus(SAVING);
  };

  const handleFieldChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const { id, name, value } = event.target;
    const [, ...realId] = id.split('-');

    setFieldList((prev) => prev.map((field) => (field.id === realId.join('-') ? { ...field, [name]: value } : field)));
    setIsDirty(true);
    setAutoSaveStatus(SAVING);
  };

  const handleAddField = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.currentTarget.blur();
    setFieldList((prev) => [...prev, { id: crypto.randomUUID(), question: '', answer: '' }]);
    setAutoSaveStatus(SAVING);
  };

  const handleDeleteField = (fieldId: string) => {
    setFieldList((prev) => prev.filter((field) => field.id !== fieldId));
    setAutoSaveStatus(SAVING);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const data = { title, fieldList };

      addResumeMutateAsync({ resumeId, data });

      const isAbleToGetEXP = await getCheckToGetEXP(); // 오늘 작성한 자소서 개수 체크 -> 3개 이하 -> 경험치 획득 가능
      const isReqExp = characterId;
      if (isReqExp) {
        if (isAbleToGetEXP) handleExperienceUp(RESUME_SUBMISSION);
      }

      Notify.success(isReqExp && isAbleToGetEXP ? SUCCESS_WITH_EXP : SUCCESS);
      router.push(getMyPagePath(RESUME_TAB));
    } catch (error) {
      Notify.warning(getErrorMessage(error));
    }
  };
  const debouncedSubmit = useAsyncFuncDebounce(handleSubmit);
  usePreventPageUnload(isDirty);

  /** 자동 저장 */
  const debouncedTitle = useDebounce(title, DEFAULT);
  const debouncedFieldList = useDebounce(fieldList, DEFAULT);

  useEffect(() => {
    if (!isDirty) return;
    setAutoSaveStatus(SAVING);

    const data = { title: debouncedTitle, fieldList: debouncedFieldList };
    autoSaveResume({ resumeId, data }).then((savedResumeId) => {
      setAutoSaveStatus(SAVED);

      if (resumeId === null) {
        setResumeId(savedResumeId);
      }
    });
  }, [debouncedTitle, debouncedFieldList]);

  const fieldListLen = fieldList.length;

  return {
    title,
    fieldList,
    fieldListLen,
    autoSaveStatus,
    resumeId,
    setTitle,
    setFieldList,
    setResumeId,
    handleTitleChange,
    handleFieldChange,
    handleAddField,
    handleDeleteField,
    handleSubmit: debouncedSubmit,
  };
};
