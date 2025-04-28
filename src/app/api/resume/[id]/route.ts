import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { getToken } from 'next-auth/jwt';
import { authOptions } from '@/utils/auth-option';
import { prisma } from '@/lib/prisma';
import { AUTH_MESSAGE, RESUME_MESSAGE } from '@/constants/message-constants';
import { ENV } from '@/constants/env-constants';
import type { RouteParams } from '@/types/route-params';

const { NEXTAUTH_SECRET } = ENV;
const { EXPIRED_TOKEN } = AUTH_MESSAGE.ERROR;
const { AUTH_REQUIRED } = AUTH_MESSAGE.RESULT;
const { NOT_FOUND, GET_SERVER_ERROR, DELETE_REQUEST_SUCCESS, DELETE_FORBIDDEN, DELETE_SERVER_ERROR } = RESUME_MESSAGE;

/**
 * 자소서 조회 요청
 */
export const GET = async (request: NextRequest, { params }: RouteParams) => {
  const resumeId = Number(params.id);

  try {
    const token = await getToken({ req: request, secret: NEXTAUTH_SECRET });
    if (!token) return NextResponse.json({ message: EXPIRED_TOKEN }, { status: 401 });

    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ message: AUTH_REQUIRED }, { status: 401 });
    }

    const response = await prisma.resume.findUnique({
      where: {
        userId: session.user.id,
        id: resumeId,
      },
    });

    if (!response) {
      return NextResponse.json({ message: NOT_FOUND }, { status: 200 });
    }

    return NextResponse.json({ response }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: GET_SERVER_ERROR }, { status: 500 });
  }
};

/**
 * 자소서 삭제 요청
 */
export const DELETE = async (request: NextRequest, { params }: RouteParams) => {
  try {
    const token = await getToken({ req: request, secret: NEXTAUTH_SECRET });
    if (!token) return NextResponse.json({ message: EXPIRED_TOKEN }, { status: 401 });

    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ message: AUTH_REQUIRED }, { status: 401 });
    }

    const { id } = params;
    const resumeId = Number(id);

    const resume = await prisma.resume.findUnique({
      where: { id: resumeId },
    });

    if (!resume) {
      return NextResponse.json({ message: NOT_FOUND }, { status: 404 });
    }

    if (resume.userId && resume.userId !== session.user.id) {
      return NextResponse.json({ message: DELETE_FORBIDDEN }, { status: 403 });
    }

    await prisma.resume.delete({
      where: { id: resumeId },
    });

    return NextResponse.json({ message: DELETE_REQUEST_SUCCESS });
  } catch (error) {
    return NextResponse.json({ message: DELETE_SERVER_ERROR }, { status: 500 });
  }
};
