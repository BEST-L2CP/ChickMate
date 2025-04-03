'use client';

import { PATH } from '@/constants/path-constant';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const callback_url = `${process.env.NEXT_PUBLIC_BASE_URL}/${PATH.ON_BOARDING}`;

const SignInAuthForm = () => {
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.target as HTMLFormElement);

    const sign_in_data = {
      email: String(formData.get('email')),
      password: String(formData.get('password')),
    };
    try {
      const res = await signIn('credentials', {
        ...sign_in_data,
        redirect: false,
      });
      if (!res.ok) {
        throw new Error('로그인에 실패했습니다.');
      } else {
        alert('로그인에 성공했습니다.');
        router.replace(PATH.ON_BOARDING);
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className='mx-auto w-full max-w-md rounded-lg bg-white p-6 shadow-md'>
      <h2 className='mb-6 text-center text-2xl font-bold'>로그인</h2>
      <form className='space-y-4' onSubmit={handleSubmit}>
        <div>
          <label htmlFor='email' className='mb-1 block text-sm font-medium text-gray-700'>
            이메일
          </label>
          <input
            id='email'
            name='email'
            type='email'
            className='w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
            required
          />
        </div>
        <div>
          <label htmlFor='password' className='mb-1 block text-sm font-medium text-gray-700'>
            비밀번호
          </label>
          <input
            id='password'
            name='password'
            type='password'
            className='w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
            required
          />
        </div>
        <button
          type='submit'
          className='w-full rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-300'
        >
          로그인
        </button>
      </form>
      <div className='mt-4 flex flex-col gap-2 text-center'>
        <Link href={PATH.AUTH.SIGN_UP}>계정이 없으신가요?</Link>
        <>
          <button
            onClick={() => signIn('google', { callbackUrl: callback_url })}
            className='w-full rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-300'
          >
            구글 로그인
          </button>
          <button
            onClick={() => signIn('naver', { callbackUrl: callback_url })}
            className='w-full rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-300'
          >
            네이버
          </button>
        </>
      </div>
    </div>
  );
};

export default SignInAuthForm;
