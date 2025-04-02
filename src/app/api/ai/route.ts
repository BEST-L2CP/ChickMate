import { ENV } from '@/constants/env-constants';
import { NextRequest, NextResponse } from 'next/server';

const url = 'https://api.openai.com/v1/audio/speech';

/**
 * POST 요청 함수
 */
export const POST = async (req: NextRequest) => {
  const { text, model, voice, speed, response_format } = await req.json();
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${ENV.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        input: text,
        voice,
        speed,
        response_format,
      }),
    });

    if (!res.ok) {
      const error_message = await res.text();
      return NextResponse.json({ message: error_message, status: res.status });
    }

    const arrayBuffer = await res.arrayBuffer();
    const base64Audio = Buffer.from(arrayBuffer).toString('base64');
    const audio_url = `data:audio/${response_format};base64,${base64Audio}`;

    return NextResponse.json({ status: 200, audio_url });
  } catch (error) {
    const error_message = (error as Error).message;
    return NextResponse.json({ message: error_message, status: 503 });
  }
};
