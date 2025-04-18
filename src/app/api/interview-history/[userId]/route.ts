import type { User } from '@prisma/client';
import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ENV } from '@/constants/env-constants';
import { AUTH_MESSAGE, HISTORY_MESSAGE, INTERVIEW_HISTORY } from '@/constants/message-constants';
import { formatDate } from '@/utils/format-date';
import { sanitizeQueryParams } from '@/utils/sanitize-query-params';

type Props = {
  params: {
    userId: User['id'];
  };
};
const {
  ERROR: { EXPIRED_TOKEN },
} = AUTH_MESSAGE;
const { NEXTAUTH_SECRET } = ENV;
const {
  VALIDATION: { QUERY_PARAMS_TYPE },
} = HISTORY_MESSAGE;
const {
  API: { GET_ERROR },
} = INTERVIEW_HISTORY;

const COMPLETED_INTERVIEW_CODE = 1;

export const GET = async (request: NextRequest, { params }: Props) => {
  try {
    const token = await getToken({ req: request, secret: NEXTAUTH_SECRET });
    if (!token) return NextResponse.json({ message: EXPIRED_TOKEN }, { status: 401 });

    const { userId } = params;
    if (!userId) return NextResponse.json({ message: EXPIRED_TOKEN }, { status: 401 });

    const searchParams = request.nextUrl.searchParams;

    const { page, limit } = sanitizeQueryParams(searchParams);
    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    if (isNaN(pageNumber) || isNaN(limitNumber)) {
      return NextResponse.json({ message: QUERY_PARAMS_TYPE }, { status: 400 });
    }

    const histories = await prisma.interviewHistory.findMany({
      where: { userId: userId, status: COMPLETED_INTERVIEW_CODE },
      orderBy: { createdAt: 'desc' },
      include: {
        resume: true,
      },
      skip: (pageNumber - 1) * limitNumber,
      take: limitNumber,
    });

    const totalCount = await prisma.interviewHistory.count({
      where: { userId },
    });
    const nextPage = pageNumber * limitNumber < totalCount ? pageNumber + 1 : null;
    if (!histories) return NextResponse.json({ data: [], nextPage }, { status: 200 });
    const parsedHistories = histories.map((history) => {
      const resumeTitle = history.resume.title ?? null;
      return {
        id: history.id,
        title: resumeTitle,
        interviewer: history.interviewType,
        isFeedbackCompleted: !!history.feedback,
        createdAt: formatDate({ input: history.createdAt }),
      };
    });
    return NextResponse.json({ data: parsedHistories, nextPage }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: GET_ERROR }, { status: 500 });
  }
};
