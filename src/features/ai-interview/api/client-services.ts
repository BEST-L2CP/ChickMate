/**
 *
 * @param text - 서버로부터 받아온 텍스트 입력
 * @param model - 고정된 TTS 모델 ('gpt-4o-mini-tts')
 * @param voice - default = calm('ash'), pressure('sage')
 * @param speed - default = calm(1), pressure(2.5)
 * @param response_format  - format 형식 default = 'wav'
 * @returns {void}
 */

type Props = {
  text: string;
  model?: string;
  voice?: string;
  speed?: number;
  response_format?: string;
};

const DEFAULT_OPTIONS = {
  MODEL: 'gpt-4o-mini-tts',
  VOICE: 'ash',
  SPEED: 1,
  FORMAT: 'wav',
};

export const speakText = async ({
  text,
  model = DEFAULT_OPTIONS.MODEL,
  voice = DEFAULT_OPTIONS.VOICE,
  speed = DEFAULT_OPTIONS.SPEED,
  response_format = DEFAULT_OPTIONS.FORMAT,
}: Props) => {
  const res = await fetch('/api/ai', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text,
      model,
      voice,
      speed,
      response_format,
    }),
  });

  const data = await res.json();
  console.log(data);

  if (res.status !== 200) {
    // TODO : ERROR 처리
    console.error('TTS 요청 실패', data.error || data.message);
    return;
  }

  const audio = new Audio(data.audio_url);
  audio.play();
};
