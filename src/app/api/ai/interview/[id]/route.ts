import { ENV } from '@/constants/env-constants';
import { AUTH_MESSAGE, DB_MESSAGE, INTERVIEW_MESSAGE } from '@/constants/message-constants';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/utils/auth-option';
import { getServerSession } from 'next-auth';
import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';
import type { RouteParams } from '@/types/route-params';
import type { InterviewQnAData } from '@/types/interview';
import type { JsonArray } from '@prisma/client/runtime/library';

const { NEXTAUTH_SECRET } = ENV;
const { EXPIRED_TOKEN } = AUTH_MESSAGE.ERROR;
const { AUTH_REQUIRED } = AUTH_MESSAGE.RESULT;
const { DB_SERVER_ERROR, DB_REQUEST_ERROR } = DB_MESSAGE.ERROR;
const { USER_ID_VALIDATION } = DB_MESSAGE.VALIDATION;
const { NOT_FOUND, FORBIDDEN, PATCH_SERVER_ERROR, GET_SERVER_ERROR } = INTERVIEW_MESSAGE;

export const POST = async (request: NextRequest, { params }: RouteParams) => {
  try {
    const { resumeId, interviewType } = await request.json();

    if (resumeId !== Number(params.id)) {
      return NextResponse.json({ message: DB_REQUEST_ERROR }, { status: 400 });
    }
    const token = await getToken({ req: request, secret: NEXTAUTH_SECRET });

    if (!token) return NextResponse.json({ message: EXPIRED_TOKEN }, { status: 401 });

    const session = await getServerSession(authOptions);
    const userId = session?.user.id;

    if (!session || !userId) return NextResponse.json({ message: USER_ID_VALIDATION }, { status: 401 });

    const response = await prisma.interviewHistory.create({
      data: {
        userId,
        resumeId,
        interviewType,
      },
    });

    return NextResponse.json({ response }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: DB_SERVER_ERROR }, { status: 500 });
  }
};

/**
 * 인터뷰 질문/답변 업데이트하는 요청
 * @param request 인터뷰 질문/답변 1쌍
 * @param params interviewId
 */
export const PATCH = async (request: NextRequest, { params }: RouteParams) => {
  try {
    const token = await getToken({ req: request, secret: NEXTAUTH_SECRET });
    if (!token) return NextResponse.json({ message: EXPIRED_TOKEN }, { status: 401 });

    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ message: AUTH_REQUIRED }, { status: 401 });
    }

    const id = Number(params.id);

    const body: InterviewQnAData = await request.json();

    const interviewHistory = await prisma.interviewHistory.findUnique({
      where: { id },
    });

    const prevContent = (interviewHistory?.content as JsonArray) || [];
    const updateContent = [...prevContent, body];

    if (!interviewHistory) {
      return NextResponse.json({ message: NOT_FOUND }, { status: 404 });
    }
    if (interviewHistory.userId && interviewHistory.userId !== session.user.id) {
      return NextResponse.json({ message: FORBIDDEN }, { status: 403 });
    }

    const response = await prisma.interviewHistory.update({
      where: { id },
      data: {
        userId: session.user.id,
        content: updateContent,
      },
    });

    return NextResponse.json({ response }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: PATCH_SERVER_ERROR }, { status: 500 });
  }
};

/**
 * 원하는 인터뷰 기록 조회 요청
 */
export const GET = async (request: NextRequest, { params }: RouteParams) => {
  const interviewId = Number(params.id);

  try {
    const token = await getToken({ req: request, secret: NEXTAUTH_SECRET });
    if (!token) return NextResponse.json({ message: EXPIRED_TOKEN }, { status: 401 });

    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ message: AUTH_REQUIRED }, { status: 401 });
    }

    const response = await prisma.interviewHistory.findUnique({
      where: {
        userId: session.user.id,
        id: interviewId,
      },
    });

    if (!response) {
      return NextResponse.json({ message: NOT_FOUND }, { status: 404 });
    }

    return NextResponse.json({ response });
  } catch (error) {
    return NextResponse.json({ message: GET_SERVER_ERROR }, { status: 500 });
  }
};
