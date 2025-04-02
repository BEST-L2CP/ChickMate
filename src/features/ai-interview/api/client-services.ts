/**
 *
 * @param text - 서버로부터 받아온 텍스트 입력
 * @param model - 고정된 TTS 모델 ('gpt-4o-mini-tts')
 * @param voice - default = calm('ash'), pressure('sage')
 * @param speed - default = calm(1), pressure(2.5)
 * @param response_format  - format 형식 default = 'wav'
 * @param instruction  - 목소리 형식 default = calm
 * @returns {void}
 */

type Props = {
  text: string;
  type: 'PRESSURE' | 'CALM';
};

const DEFAULT_OPTIONS = {
  MODEL: 'gpt-4o-mini-tts',
  FORMAT: 'wav',
};

const CALM_OPTIONS = {
  VOICE: 'ash',
  SPEED: 1,
  INSTRUCTION: `Uses a friendly and gentle tone of voice.
  Rather than challenging the candidate's answers, frequently provides emotional empathy or positive reactions.`,
};

const PRESSURE_OPTIONS = {
  VOICE: 'sage',
  SPEED: 2.5,
  INSTRUCTION: `Uses a firm and dry tone of voice.
Avoids showing emotional empathy or positive reactions to the candidate's responses.`,
};

export const speakText = async ({ text, type }: Props) => {
  const options = type === 'PRESSURE' ? PRESSURE_OPTIONS : CALM_OPTIONS;
  const res = await fetch('/api/ai', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text,
      model: DEFAULT_OPTIONS.MODEL,
      response_format: DEFAULT_OPTIONS.FORMAT,
      voice: options.VOICE,
      speed: options.SPEED,
      instruction: options.INSTRUCTION,
    }),
  });

  const data = await res.json();

  if (res.status !== 200) {
    // TODO : ERROR 처리
    console.error('TTS 요청 실패', data.error || data.message);
    return;
  }

  const audio = new Audio(data.audio_url);
  audio.play();
};
