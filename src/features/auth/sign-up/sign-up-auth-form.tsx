'use client';

import { PATH } from '@/constants/path-constant';
import { useRouter } from 'next/navigation';
import { postSignUp } from './api/client-services';
import { AUTH_MESSAGE } from '@/constants/message-constants';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import AuthInput from '@/components/common/auth-input';

export const schema = z.object({
  name: z
    .string()
    .trim()
    .min(2, AUTH_MESSAGE.VALIDATION.NAME_LENGTH)
    .max(8, AUTH_MESSAGE.VALIDATION.NAME_LENGTH)
    .regex(/^[a-zA-Z0-9가-힣]+$/, AUTH_MESSAGE.VALIDATION.NAME_SPECIAL_CHAR),
  email: z.string().trim().email(AUTH_MESSAGE.VALIDATION.EMAIL_INVALID),
  password: z
    .string()
    .trim()
    .min(6, AUTH_MESSAGE.VALIDATION.PASSWORD_LENGTH)
    .regex(/[^a-zA-Z0-9]/, AUTH_MESSAGE.VALIDATION.PASSWORD_SPECIAL_CHAR),
});

export type FormData = z.infer<typeof schema>;

const SignUpAuthForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: 'onBlur',
    defaultValues: { name: '', email: '', password: '' } as FormData,
  });
  const router = useRouter();

  const onSubmit = async (data: FormData) => {
    try {
      await postSignUp(data as Required<FormData>);
      router.push(PATH.AUTH.SIGN_IN);
      alert(AUTH_MESSAGE.RESULT.SIGN_UP_SUCCESS);
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className='mx-auto w-full max-w-md rounded-lg bg-white p-6 shadow-md'>
      <h1 className='mb-1 text-center text-2xl font-light'>
        만나서 반가워요.<span className='font-normal'>병아리</span>씨!
      </h1>
      <h2 className='mb-4 text-center font-extralight'>우리 같이 취업을 향한 여정을 떠나볼까요?</h2>
      <h3 className='mb-10 text-center font-extralight text-black/30'>원할한 서비스 이용을 위해 회원가입 해주세요.</h3>
      <form onSubmit={handleSubmit(onSubmit)}>
        <AuthInput label='NAME' id='name' register={register} error={errors.name} type='text' />
        <AuthInput label='EMAIL' id='email' register={register} error={errors.email} type='email' />
        <AuthInput label='PASSWORD' id='password' register={register} error={errors.password} type='password' />
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
