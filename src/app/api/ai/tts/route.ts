import { NextRequest, NextResponse } from 'next/server';
import { openAi } from '@/lib/open-ai';
import { AI_MESSAGE } from '@/constants/message-constants';

const { REQUEST_FAILURE, SERVER_ERROR } = AI_MESSAGE.TTS;

const TTS_OPTIONS = {
  MODEL: 'gpt-4o-mini-tts',
  FORMAT: 'mp3',
} as const;

/**
 * Open AI TTS 통신
 * @param {NextRequest} request 사용자 답변, 음성 속도, 음성 설명
 * @returns
 */
export const POST = async (request: NextRequest) => {
  try {
    const { text, voice, speed, instructions } = await request.json();

    const mp3 = await openAi.audio.speech.create({
      input: text,
      model: TTS_OPTIONS.MODEL,
      response_format: TTS_OPTIONS.FORMAT,
      voice,
      speed,
      instructions,
    });

    if (!mp3) {
      return NextResponse.json({ message: REQUEST_FAILURE }, { status: 400 });
    }

    const arrayBuffer = await mp3.arrayBuffer();
    const base64Audio = Buffer.from(arrayBuffer).toString('base64');
    const response = `data:audio/${TTS_OPTIONS.FORMAT};base64,${base64Audio}`;

    return NextResponse.json({ response }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: SERVER_ERROR }, { status: 500 });
  }
};
