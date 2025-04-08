import { DB_MESSAGE } from '@/constants/message-constants';
import { prisma } from '@/lib/prisma';
import { JobPosting } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

/**
 * GET
 */
export const GET = async (req: NextRequest): Promise<NextResponse> => {
  const { NOT_FOUND_DATA, DB_SERVER_ERROR } = DB_MESSAGE.ERROR;
  try {
    // searchParams로 정보 가져오기
    const searchParams = req.nextUrl.searchParams;
    const educationLevel = searchParams.get('educationLevel');
    const location = JSON.parse(searchParams.get('location'));
    const mainRegion = location.mainRegion;
    const experienceType = searchParams.get('experienceType');
    const jobType = searchParams.get('jobType');

    const data: JobPosting[] = await prisma.jobPosting.findMany({
      where: {
        educationLevel,
        experienceType,
        jobType,
        location: {
          path: ['mainRegion'],
          equals: mainRegion,
        },
      },
    });

    if (!data) {
      return NextResponse.json({ message: NOT_FOUND_DATA }, { status: 400 });
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: DB_SERVER_ERROR }, { status: 500 });
  }
};
