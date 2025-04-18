import { AI_MESSAGE } from '@/constants/message-constants';
import { openAi } from '@/lib/open-ai';
import { prisma } from '@/lib/prisma';
import { RouteParams } from '@/types/route-params';
import { NextRequest, NextResponse } from 'next/server';

const DEFAULT_COMPLETION_OPTIONS = {
  model: 'gpt-4o-mini',
  temperature: 1,
  max_completion_tokens: 2024,
  top_p: 1,
  store: false,
};

// 추후 변경 - 기능 구현 우선
export const GET = async (req: NextRequest, { params }: RouteParams) => {
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

export const POST = async (request: NextRequest) => {
  const { AI_REQUEST_FAILURE, AI_SERVER_ERROR } = AI_MESSAGE.AI;
  try {
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
