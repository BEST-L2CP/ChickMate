'use server';

import { ENV } from '@/constants/env-constants';
import OpenAI from 'openai';

export const openAi = new OpenAI({
  apiKey: ENV.OPENAI_API_KEY,
});

console.log(ENV.OPENAI_API_KEY);
