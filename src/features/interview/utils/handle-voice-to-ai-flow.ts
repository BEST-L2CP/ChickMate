import { postOpenAIQuestion, postSpeechToText, postTextToSpeech } from '@/features/interview/api/client-services';

type Props = {
  blob: Blob;
  interviewId: number;
  interviewType: string;
};

export const handleVoiceToAIFlow = async ({ blob, interviewId, interviewType }: Props) => {
  try {
    const userAnswer = await postSpeechToText(blob);
    const aiQuestion = await postOpenAIQuestion({ userAnswer, interviewId, interviewType });
    const audioUrl = await postTextToSpeech({ aiQuestion, interviewType });

    const audio = new Audio(audioUrl);

    return { audio, aiQuestion };
  } catch (error) {
    if (error instanceof Error) {
    }
  }
};
