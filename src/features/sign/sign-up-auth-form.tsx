'use client';

import { PATH } from '@/constants/path-constant';
import { useRouter } from 'next/navigation';
import { postSignUp } from '@/features/sign/api/client-services';
import { AUTH_MESSAGE } from '@/constants/message-constants';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import AuthInput from '@/features/sign/auth-input';
import { SignUpFormData, schema } from '@/features/sign/data/sign-up-schema';
import Typography from '@/components/ui/typography';

const SignUpAuthForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(schema),
    mode: 'onBlur',
    defaultValues: { name: '', email: '', password: '', passwordCheck: '' } as SignUpFormData,
  });
  const router = useRouter();

  const onSubmit = async (data: SignUpFormData) => {
    try {
      await postSignUp(data as Required<SignUpFormData>);
      router.push(PATH.AUTH.SIGN_IN);
      alert(AUTH_MESSAGE.RESULT.SIGN_UP_SUCCESS);
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      }
    }
  };

  return (
    <div className='mx-auto w-full max-w-md rounded-3xl bg-white p-6 shadow-md'>
      <div className='mb-8'>
        <Typography size='2xl' weight='normal' align='center'>
          만나서 반가워요.<span className='font-bold'>병아리</span>씨!
        </Typography>
        <Typography weight='normal' align='center'>
          우리 같이 취업을 향한 여정을 떠나볼까요?
        </Typography>
      </div>
      <div className='mb-8'>
        <Typography color='primary-600' weight='bold' align='center' as='h1'>
          원할한 서비스 이용을 위해 회원가입 해주세요.
        </Typography>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <AuthInput label='NAME' id='name' register={register} error={errors.name} type='text' />
        <AuthInput label='EMAIL' id='email' register={register} error={errors.email} type='email' />
        <AuthInput label='PASSWORD' id='password' register={register} error={errors.password} type='password' />
        <AuthInput
          label='PASSWORD CHECK'
          id='passwordCheck'
          register={register}
          error={errors.passwordCheck}
          type='password'
        />
        <button
          type='submit'
          className='bg-blue-white mt-2 w-full rounded-md border border-gray-400 px-4 py-2 text-sm font-medium text-black shadow-sm'
        >
          회원가입
        </button>
      </form>
    </div>
  );
};

export default SignUpAuthForm;
