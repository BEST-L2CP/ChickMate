import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/utils/auth-option';
import { prisma } from '@/lib/prisma';
import { AUTH_MESSAGE, RESUME_MESSAGE } from '@/constants/message-constants';
import { ENV } from '@/constants/env-constants';
import { getToken } from 'next-auth/jwt';
import { sanitizeQueryParams } from '@/utils/sanitize-query-params';

const { NEXTAUTH_SECRET } = ENV;
const { EXPIRED_TOKEN } = AUTH_MESSAGE.ERROR;
const { AUTH_REQUIRED } = AUTH_MESSAGE.RESULT;
const { GET_SERVER_ERROR } = RESUME_MESSAGE;

export const GET = async (request: NextRequest) => {
  try {
    const token = await getToken({ req: request, secret: NEXTAUTH_SECRET });
    if (!token) return NextResponse.json({ message: EXPIRED_TOKEN }, { status: 401 });
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ message: AUTH_REQUIRED }, { status: 401 });
    }
    const userId = session.user.id;
    const searchParams = request.nextUrl.searchParams;

    const {
      page = undefined,
      limit = undefined,
      status = undefined,
      reqType = undefined,
    } = sanitizeQueryParams(searchParams);

    if (reqType === 'infinity') {
      const pageNumber = Number(page);
      const limitNumber = Number(limit);

      if (isNaN(pageNumber) || isNaN(limitNumber)) {
        return NextResponse.json({ message: '유효하지 않은 파라미터입니다.' }, { status: 400 });
      }
      const response = await prisma.resume.findMany({
        where: {
          userId: userId,
          status: Number(status),
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip: (pageNumber - 1) * limitNumber,
        take: limitNumber,
      });

      const totalCount = await prisma.resume.count({
        where: { userId, status: Number(status) },
      });
      const nextPage = pageNumber * limitNumber < totalCount ? pageNumber + 1 : null;
      return NextResponse.json({ response, nextPage }, { status: 200 });
    }

    const response = await prisma.resume.findMany({
      where: {
        userId: userId,
        status: Number(status),
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ response }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: GET_SERVER_ERROR }, { status: 500 });
  }
};
