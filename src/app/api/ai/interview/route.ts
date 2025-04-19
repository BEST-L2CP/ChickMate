import { prisma } from '@/lib/prisma';
import { RouteParams } from '@/types/route-params';
import { NextResponse, type NextRequest } from 'next/server';

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
