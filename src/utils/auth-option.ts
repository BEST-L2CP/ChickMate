import { PrismaAdapter } from '@auth/prisma-adapter';
import GoogleProvider from 'next-auth/providers/google';
import { prisma } from '@/lib/prisma';
import type { NextAuthOptions } from 'next-auth';
import NaverProvider from 'next-auth/providers/naver';
import CredentialsProvider from 'next-auth/providers/credentials';

// NextAuth 설정 옵션을 정의합니다.
export const authOptions: NextAuthOptions = {
  // PrismaAdapter를 사용하여 Prisma와의 연결을 설정합니다.
  adapter: PrismaAdapter(prisma),

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
    NaverProvider({
      clientId: process.env.NAVER_CLIENT_ID || '',
      clientSecret: process.env.NAVER_CLIENT_SECRET || '',
    }),
    CredentialsProvider({
      name: 'credentials',

      credentials: {
        email: { label: '이메일', type: 'text', placeholder: '이메일 입력' },
        password: { label: '비밀번호', type: 'password' },
      },

      // 이메일, 패스워드 부분을 체크해서 맞으면 user 객체 리턴 틀리면 null 리턴
      async authorize(credentials, req) {
        const res = await fetch(`http://localhost:3000/api/auth/sign-in`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: credentials?.email,
            password: credentials?.password,
          }),
        });
        const user = await res.json();

        if (res.ok && user) {
          return { ...user };
        } else {
          return null;
        }
      },
    }),
  ],

  // 인증 과정에서 사용할 콜백 함수를 정의합니다.
  callbacks: {
    async jwt({ token, user }) {
      if ((user as any)?.accessToken) {
        token.accessToken = (user as any).accessToken;
      }
      return token;
    },

    // 세션이 생성될 때 호출되는 콜백 함수입니다.
    async session({ session, token }) {
      if (token?.accessToken) {
        (session as any).accessToken = token.accessToken;
      }
      if (token?.sub) {
        session.user.id = token.sub; // 세션에 사용자 ID를 추가
      }
      return session;
    },
  },
  
  // 사용자 정의 로그인 페이지 경로를 설정합니다.
  // 원래의 경우라면, 로그인 페이지가 없어서 기본 로그인 페이지로 리디렉션됩니다.
  // 하지만, 우리는 사용자 정의 로그인 페이지를 사용하기 때문에 이 설정을 추가합니다.

  pages: {
    signIn: '/', // 사용자가 로그인하지 않았을 때 리디렉션될 페이지입니다.
  },
  session: {
    strategy: 'jwt',
  },
};
