import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { openAi } from '@/lib/open-ai';
import { AI_MESSAGE, AUTH_MESSAGE } from '@/constants/message-constants';
import { ENV } from '@/constants/env-constants';

const { NEXTAUTH_SECRET } = ENV;
const { EXPIRED_TOKEN } = AUTH_MESSAGE.ERROR;
const { NOT_FILE, SERVER_ERROR } = AI_MESSAGE.STT;

const STT_OPTIONS = {
  MODEL: 'gpt-4o-transcribe',
  LANGUAGE: 'ko',
} as const;

/**
 * Open AI STT(Speech to Text) 통신
 * @param {NextRequest} request formdata = 파일, 텍스트 데이터를 함께 보내기 위해 사용하는 포맷
 * @returns
 */
export const POST = async (request: NextRequest) => {
  try {
    const token = await getToken({ req: request, secret: NEXTAUTH_SECRET });
    if (!token) return NextResponse.json({ message: EXPIRED_TOKEN }, { status: 401 });

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ message: NOT_FILE }, { status: 400 });
    }

    const { text: response } = await openAi.audio.transcriptions.create({
      file,
      model: STT_OPTIONS.MODEL,
      language: STT_OPTIONS.LANGUAGE,
    });

    return NextResponse.json({ response }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: SERVER_ERROR }, { status: 500 });
  }
};
