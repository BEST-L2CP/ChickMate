import { ENV } from '@/constants/env-constants';
import { AUTH_MESSAGE, DB_MESSAGE } from '@/constants/message-constants';
import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';
import { eduMap, jobMidCdMap, locMcdMap } from '@/features/admin/data/saramin-constants';
import { prisma } from '@/lib/prisma';
import { JobPosting } from '@prisma/client';

const {
  ERROR: { DB_SERVER_ERROR },
  SUCCESS: { CREATE_SUCCESS },
} = DB_MESSAGE;
const {
  ERROR: { EXPIRED_TOKEN },
} = AUTH_MESSAGE;
const { NEXTAUTH_SECRET, SARAMIN_API_KEY } = ENV;

const URL = 'https://oapi.saramin.co.kr/job-search';
const COUNT = 100;
const PAGE = '0';
const DEFAULT_EDU_CODE = 6;
const LIMIT_EDU_LEVEL = 5;

type JobRecord = Omit<JobPosting, 'id' | 'createdAt'>;

/**
 * PATCH 요청 함수
 */

export const PATCH = async (request: NextRequest) => {
  try {
    const token = await getToken({ req: request, secret: NEXTAUTH_SECRET });
    if (!token) return NextResponse.json({ message: EXPIRED_TOKEN }, { status: 401 });

    const allRecords: JobRecord[] = [];

    for (const [jobCdStr, _] of Object.entries(jobMidCdMap)) {
      for (const [_n, locCodes] of Object.entries(locMcdMap)) {
        const params = new URLSearchParams({
          'access-key': SARAMIN_API_KEY as string,
          loc_mcd: locCodes,
          job_mid_cd: jobCdStr,
          start: PAGE,
          count: COUNT.toString(),
        });
        const res = await fetch(`${URL}?${params}`);
        const data = await res.json();
        const jobs = data.jobs.job;

        jobs.forEach((job: any) => {
          const pos = job.position || {};
          const rawEd = pos['required-education-level']?.code;
          let eduCode: number = DEFAULT_EDU_CODE;
          if (rawEd !== undefined) {
            const i = Number(rawEd);
            eduCode = i <= LIMIT_EDU_LEVEL ? i : eduMap[i];
          }

          allRecords.push({
            url: job.url as string,
            companyName: job.company?.detail?.name as string,
            positionTitle: pos.title as string,
            locationName: pos.location?.name as string,
            industryName: pos.industry?.name as string,
            keyword: job.keyword as string,
            jobMidCodeName: pos['job-mid-code']?.name as string,
            experienceCode: Number(pos['experience-level']?.code),
            experienceName: pos['experience-level']?.name as string,
            requiredEducationCode: eduCode,
            requiredEducationName: pos['required-education-level']?.name as string,
            openingTimestamp: Number(job['opening-timestamp']),
            expirationTimestamp: Number(job['expiration-timestamp']),
          });
        });

        await new Promise((_) => setTimeout(_, 300));
      }
    }

    // 기존 jobPosting 데이터 전부 삭제
    await prisma.jobPosting.deleteMany({});

    // 새 데이터 삽입
    await prisma.jobPosting.createMany({
      data: allRecords.map((record) => ({
        url: record.url,
        companyName: record.companyName,
        positionTitle: record.positionTitle,
        locationName: record.locationName,
        industryName: record.industryName,
        keyword: record.keyword,
        jobMidCodeName: record.jobMidCodeName,
        experienceCode: record.experienceCode,
        experienceName: record.experienceName,
        requiredEducationCode: record.requiredEducationCode,
        requiredEducationName: record.requiredEducationName,
        openingTimestamp: Number(record.openingTimestamp),
        expirationTimestamp: Number(record.expirationTimestamp),
      })),
      skipDuplicates: true,
    });

    const response = {
      message: CREATE_SUCCESS,
    };

    return NextResponse.json({ response }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: DB_SERVER_ERROR }, { status: 500 });
  }
};
