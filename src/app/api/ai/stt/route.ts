import { NextRequest, NextResponse } from 'next/server';
import { openAi } from '@/lib/open-ai';
import { AI_MESSAGE } from '@/constants/message-constants';

const { NOT_FILE, SERVER_ERROR } = AI_MESSAGE.STT;

const STT_OPTIONS = {
  MODEL: 'gpt-4o-transcribe',
  LANGUAGE: 'ko',
} as const;

/**
 * POST 요청 함수
 */
export const POST = async (request: NextRequest) => {
  try {
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
