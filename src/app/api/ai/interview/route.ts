import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { openAi } from '@/lib/open-ai';
import { prisma } from '@/lib/prisma';
import { ENV } from '@/constants/env-constants';
import { AI_MESSAGE, AUTH_MESSAGE } from '@/constants/message-constants';
import type { RouteParams } from '@/types/route-params';

const { NEXTAUTH_SECRET } = ENV;
const { EXPIRED_TOKEN } = AUTH_MESSAGE.ERROR;

const DEFAULT_COMPLETION_OPTIONS = {
  model: 'gpt-4o-mini',
  temperature: 1,
  max_completion_tokens: 2024,
  top_p: 1,
  store: false,
};

export const POST = async (request: NextRequest) => {
  const { AI_REQUEST_FAILURE, AI_SERVER_ERROR } = AI_MESSAGE.AI;
  try {
    const token = await getToken({ req: request, secret: NEXTAUTH_SECRET });
    if (!token) return NextResponse.json({ message: EXPIRED_TOKEN }, { status: 401 });

    const { messageList } = await request.json();
    const res = await openAi.chat.completions.create({
      ...DEFAULT_COMPLETION_OPTIONS,
      messages: messageList,
    });

    if (!res) {
      return NextResponse.json({ message: AI_REQUEST_FAILURE }, { status: 400 });
    }

    const response = res.choices[0].message.content;

    return NextResponse.json({ response }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: AI_SERVER_ERROR }, { status: 500 });
  }
};

// 추후 변경 - 기능 구현 우선
export const GET = async (request: NextRequest, { params }: RouteParams) => {
  const interviewHistoryId = Number(params.id);

  const data = await prisma.interviewHistory.findUnique({
    where: {
      id: interviewHistoryId,
    },
  });

  if (!data) {
    return NextResponse.json({ error: 'Not Found' }, { status: 404 });
  }

  return NextResponse.json(data);
};
