'use client';

import { PATH } from '@/constants/path-constant';
import { postSignUp } from '@/features/sign-up/api/client-services';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const callback_url = `${process.env.NEXT_PUBLIC_BASE_URL}/${PATH.ON_BOARDING}`;

const AuthForm = () => {
  const path_name = usePathname();
  const router = useRouter();

  const is_sign_up = path_name === PATH.SIGN_UP;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.target as HTMLFormElement);

    if (path_name === PATH.SIGN_UP) {
      const sign_up_data = {
        email: String(formData.get('email')),
        password: String(formData.get('password')),
        name: String(formData.get('name')),
      };
      try {
        await postSignUp(sign_up_data);
        router.push(PATH.SIGN_IN);
        alert('회원 가입에 성공하셨습니다.');
      } catch (error) {
        alert(error);
      }
    } else if (path_name === PATH.SIGN_IN) {
      const sign_in_data = {
        email: String(formData.get('email')),
        password: String(formData.get('password')),
      };
      try {
        await signIn('credentials', {
          ...sign_in_data,
          callbackUrl: callback_url,
        });
        alert('로그인에 성공하셨습니다.');
      } catch (error) {
        alert(error);
      }
    }
  };

  return (
    <div className='mx-auto w-full max-w-md rounded-lg bg-white p-6 shadow-md'>
      <h2 className='mb-6 text-center text-2xl font-bold'>{is_sign_up ? '회원가입' : '로그인'}</h2>
      <form className='space-y-4' onSubmit={handleSubmit}>
        {is_sign_up && (
          <div>
            <label htmlFor='username' className='mb-1 block text-sm font-medium text-gray-700'>
              사용자 이름
            </label>
            <input
              id='name'
              name='name'
              type='text'
              className='w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
              required
            />
          </div>
        )}
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
          {is_sign_up ? '가입하기' : '로그인'}
        </button>
      </form>
      <div className='mt-4 flex flex-col gap-2 text-center'>
        <Link href={is_sign_up ? PATH.SIGN_IN : PATH.SIGN_UP}>
          {is_sign_up ? '이미 계정이 있으신가요? ' : '계정이 없으신가요? '}
        </Link>
        {!is_sign_up && (
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
        )}
      </div>
    </div>
  );
};

export default AuthForm;
