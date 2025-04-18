import OpenAI from 'openai';
import { ENV } from '@/constants/env-constants';

export const openAi = new OpenAI({
  apiKey: ENV.OPENAI_API_KEY,
});
