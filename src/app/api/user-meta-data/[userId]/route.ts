import { prisma } from '@/lib/prisma';
import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';
import { AUTH_MESSAGE, USER_META_DATA_FORM_MESSAGE } from '@/constants/message-constants';
import { ENV } from '@/constants/env-constants';
import type { UserType } from '@/types/DTO/user-dto';
type Props = {
  params: {
    userId: UserType['id'];
  };
};

const { NEXTAUTH_SECRET } = ENV;
const {
  API: { POST_DATA_ERROR, GET_DATA_ERROR },
} = USER_META_DATA_FORM_MESSAGE;

const {
  ERROR: { EXPIRED_TOKEN },
} = AUTH_MESSAGE;

export const GET = async (request: NextRequest, { params }: Props): Promise<NextResponse> => {
  try {
    const { userId } = params;
    if (!userId) return NextResponse.json({ message: EXPIRED_TOKEN, status: 401 }, { status: 401 });

    const userData = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!userData) return NextResponse.json({ data: {}, status: 200 }, { status: 200 });
    return NextResponse.json({ data: userData.userMetaData, status: 200 }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        message: GET_DATA_ERROR,
        status: 500,
      },
      {
        status: 500,
      }
    );
  }
};

export const POST = async (request: NextRequest, { params }: Props): Promise<NextResponse> => {
  try {
    const token = await getToken({ req: request, secret: NEXTAUTH_SECRET });
    if (!token) return NextResponse.json({ message: EXPIRED_TOKEN, status: 401 }, { status: 401 });
    const { userId } = params;
    const payload = await request.json();
    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        userMetaData: payload,
      },
    });
    return NextResponse.json({ status: 200 }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        message: POST_DATA_ERROR,
        status: 500,
      },
      {
        status: 500,
      }
    );
  }
};
