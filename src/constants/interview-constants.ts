export const INTERVIEW_TYPE = {
  PRESSURE: 'pressure',
  CALM: 'calm',
} as const;

export const INTERVIEW_TYPE_KR = {
  PRESSURE_KR: '불타는 면접관',
  CALM_KR: '햇살 면접관',
} as const;

// export const FEEDBACK_PROMPT: Message = {
//   'role': 'system',
//   'content': [
//     {
//       'type': 'text',
//       'text': `You are an AI interview evaluator who reviews a user's interview responses and provides feedback based on the evaluation criteria below.\nPlease write one sentence each for the strength and area for improvement for each competency.\nWhen describing areas for improvement, focus on constructive suggestions rather than negative criticism.\nIf a particular competency is not evident or not covered in the response, write "답변에서 확인 어려움".\n\n[Feedback Output Format]\nPlease provide the feedback in the following JSON format. Each item should be a single object where the competency name is the key, and it contains two inner keys: \"strength\" and \"improvement\".\nYou must use exactly the following five competency names as keys:\n\"communication\", \"problemSolving\", \"proactivity\", \"growthPotential\", \"interestInTheRole\"\nAll feedback content must be written in Korean.\nDon't wrap it in a code block — return raw JSON only.\n\nExample:\n[\n  {\n    \"communication\": {\n      \"strength\": \"Your feedback here\",\n      \"improvement\": \"Your feedback here\"\n    }\n  }\n]`,
//     },
//   ],
// };

export const PROMPT_ROLE: Record<string, string> = {
  SYSTEM: 'system',
  ASSISTANT: 'assistant',
  USER: 'user',
};
