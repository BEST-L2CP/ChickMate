import { AUTH_MESSAGE, CHARACTER_MESSAGE } from '@/constants/message-constants';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/utils/auth-option';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

const { PATCH_DATA_FAILED } = CHARACTER_MESSAGE.PATCH;
const { AUTH_REQUIRED } = AUTH_MESSAGE.RESULT;

export const PATCH = async (request: NextRequest): Promise<NextResponse> => {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ message: AUTH_REQUIRED }, { status: 401 });
    }
    const { characterId, amount } = await request.json();

    const updated = await prisma.character.update({
      where: { id: characterId },
      data: { experience: { increment: amount } },
    });
    return NextResponse.json({ updated }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: PATCH_DATA_FAILED }, { status: 500 });
  }
};
