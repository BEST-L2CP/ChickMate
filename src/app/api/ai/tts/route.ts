import { NextRequest, NextResponse } from 'next/server';
import { openAi } from '@/lib/open-ai';
import { AI_MESSAGE } from '@/constants/message-constants';
import { INTERVIEW_TYPE } from '@/constants/interview-constants';

const { REQUEST_FAILURE, SERVER_ERROR } = AI_MESSAGE.TTS;
const { PRESSURE } = INTERVIEW_TYPE;

const TTS_OPTIONS = {
  MODEL: 'gpt-4o-mini-tts',
  FORMAT: 'mp3',
} as const;

const INTERVIEW_VOICE_OPTIONS = {
  CALM_OPTIONS: {
    VOICE: 'ash',
    SPEED: 1,
    INSTRUCTION: `Uses a friendly and gentle tone of voice.
    Rather than challenging the candidate's answers, frequently provides emotional empathy or positive reactions.`,
  },
  PRESSURE_OPTIONS: {
    VOICE: 'sage',
    SPEED: 2.5,
    INSTRUCTION: `Uses a firm and dry tone of voice.
    Avoids showing emotional empathy or positive reactions to the candidate's responses.`,
  },
};

/**
 * Open AI TTS 통신
 * @param {NextRequest} request 사용자 답변, 음성 속도, 음성 설명
 * @returns
 */
export const POST = async (request: NextRequest) => {
  try {
    const { text, type } = await request.json();
    const { VOICE, SPEED, INSTRUCTION } =
      type === PRESSURE ? INTERVIEW_VOICE_OPTIONS.PRESSURE_OPTIONS : INTERVIEW_VOICE_OPTIONS.CALM_OPTIONS;

    const mp3 = await openAi.audio.speech.create({
      input: text,
      model: TTS_OPTIONS.MODEL,
      response_format: TTS_OPTIONS.FORMAT,
      voice: VOICE,
      speed: SPEED,
      instructions: INSTRUCTION,
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
