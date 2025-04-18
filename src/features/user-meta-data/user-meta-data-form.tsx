'use client';
import { useSession } from 'next-auth/react';
import ErrorComponent from '@/components/common/error-component';
import Button from '@/components/ui/button';
import { academicData, jobData, typeData } from '@/features/user-meta-data/data/user-meta-data';
import useRegionsQuery from '@/features/user-meta-data/hooks/use-regions-query';
import SingleSelectField from '@/features/user-meta-data/single-select-field';
import { useMetaDataForm } from '@/features/user-meta-data/hooks/use-meta-data-form';
import { USER_META_DATA_KEY } from '@/constants/user-meta-data-constants';

const { TYPE, EDUCATION, JOB, MAIN_REGION, ETC } = USER_META_DATA_KEY;

const UserMetaDataForm = () => {
  const { data } = useSession();
  const userId = data?.user?.id;

  if (!userId) return <ErrorComponent />;

  const { watch, register, errors, handleSubmit, handleOnSubmit, handleSelect, isMetaDataPending, isFirstTime } =
    useMetaDataForm(userId);

  const { data: regions = [], isPending } = useRegionsQuery();

  if (isPending || isMetaDataPending) return <div>로딩 중..</div>;

  return (
    <div>
      {isFirstTime && (
        <span className='mb-4 block text-center font-bold text-primary-orange-600'>작성 완료 시 500 경험치 획득!</span>
      )}
      <form onSubmit={handleSubmit(handleOnSubmit)}>
        <SingleSelectField
          label='*경력'
          options={typeData}
          value={watch(TYPE)}
          fieldKey={TYPE}
          onSelect={handleSelect}
          error={errors[TYPE]?.message}
        />
        <SingleSelectField
          label='*학력'
          options={academicData}
          value={watch(EDUCATION)}
          fieldKey={EDUCATION}
          onSelect={handleSelect}
          error={errors[EDUCATION]?.message}
        />
        <SingleSelectField
          label='*직무'
          options={jobData}
          value={watch(JOB)}
          fieldKey={JOB}
          onSelect={handleSelect}
          error={errors[JOB]?.message}
        />
        <SingleSelectField
          label='*지역'
          options={regions}
          value={watch(MAIN_REGION)}
          fieldKey={MAIN_REGION}
          onSelect={handleSelect}
          error={errors[MAIN_REGION]?.message}
        />

        <div className='mb-4 flex min-h-14 flex-col justify-center'>
          <label className='mb-2 text-cool-gray-300'>ex. 수상이력, 자격증 등</label>
          <input
            className='rounded-[8px] border border-cool-gray-200 px-4 py-2'
            id={ETC}
            type='text'
            {...register(ETC)}
          />
        </div>
        <div className='text-center'>
          <Button variant='outline' color='dark' type='submit'>
            <span className='font-bold'>설정을 완료헀어요!</span>
          </Button>
        </div>
      </form>
    </div>
  );
};

export default UserMetaDataForm;
