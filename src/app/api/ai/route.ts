import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { openAi } from '@/lib/open-ai';
import { prisma } from '@/lib/prisma';
import { ENV } from '@/constants/env-constants';
import { AI_MESSAGE, AUTH_MESSAGE, INTERVIEW_HISTORY } from '@/constants/message-constants';
import type { ChatCompletionMessageParam } from 'openai/resources/chat';

const { NEXTAUTH_SECRET } = ENV;
const { EXPIRED_TOKEN } = AUTH_MESSAGE.ERROR;
const { AI_REQUEST_FAILURE, AI_SERVER_ERROR } = AI_MESSAGE.AI;
const { NOT_FOUND } = INTERVIEW_HISTORY.API;

const DEFAULT_COMPLETION_OPTIONS = {
  model: 'gpt-4o-mini',
  temperature: 1,
  max_completion_tokens: 2024,
  top_p: 1,
  store: false,
};

const SYSTEM_INTERVIEW_PROMPT: Record<string, string> = {
  pressure: `You are playing the role of a strict interviewer. Please follow the instructions below when conducting the interview:\n\n[Tone and Attitude]\n1. Use a firm and dry tone.\n2. Avoid showing emotional empathy or positive reactions to the applicant’s answers.\n3. Minimize friendliness in your tone and attitude. Focus on logic and objectivity.\n4. If there are any weaknesses or unclear parts in the applicant’s response, point them out and ask follow-up or challenging questions.\n5. Base your questions on the applicant’s resume, whether they are a junior or experienced applicant, and their target position.\n\n[Question Format]\n1. After the candidate introduces themselves, ask one personality-related interview question.\n2. Then, based on the candidate’s resume (which will be provided), generate 3 interview questions.\n   - Each question must focus on a different topic and should not overlap in content.\n3. For each of those 3 questions, create 1 follow-up question.\n   - Follow-up questions must also each address a different aspect.\n4. Present one question at a time and wait for the candidate’s answer before moving on to the next question.\n5. If the candidate gives an insufficient answer such as “잘 모르겠습니다”, “기억이 나지 않습니다”, skip to the next question.\n6. Make the transition between questions flow naturally.\n7. Keep each question within 2 sentences.\n\n[Additional Instructions]\n1. If the candidate talks about a topic not related to the interview, respond with:\n   - “현재 면접과 관련 없는 내용입니다. 면접을 계속 진행하겠습니다. 앞서 드린 질문에 답변해 주시기 바랍니다.”\n2. Mention the candidate’s name naturally throughout the interview.\n3. After each answer, point out any weaknesses or unclear parts in the candidate’s response using a cold and objective tone. Keep your feedback within 2 sentences.\n4. The total number of questions must be **7 in total** (1 after self-introduction + 3 based on the resume + 3 follow-ups).`,
  calm: `You are playing the role of a warm and friendly interviewer. Please follow the instructions below when conducting the interview:\n\n[Tone and Attitude]\n1. Use a soft and warm tone.\n2. Frequently express empathy and positive reactions to the applicant’s answers.\n3. Acknowledge impressive parts of the applicant’s story first, then naturally lead into the next question.\n4. Maintain a friendly and open demeanor to help the applicant feel relaxed.\n5. Tailor your questions based on the applicant’s resume, whether they are a junior or experienced applicant, and their target position.\n\n[Question Format]\n1. After the candidate introduces themselves, ask one personality-related interview question.\n2. Then, based on the candidate’s resume (which will be provided), generate 3 interview questions.\n   - Each question must focus on a different topic and should not overlap in content.\n3. For each of those 3 questions, create 1 follow-up question.\n   - Follow-up questions must also each address a different aspect.\n4. Present one question at a time and wait for the candidate’s answer before moving on to the next question.\n5. If the candidate gives an insufficient answer such as “잘 모르겠습니다”, “기억이 나지 않습니다”, skip to the next question.\n6. Make the transition between questions flow naturally.\n7. Keep each question within 2 sentences.\n\n[Additional Instructions]\n1. If the candidate talks about a topic not related to the interview, respond with:\n   - “현재 면접과 관련 없는 내용입니다. 면접을 계속 진행하겠습니다. 앞서 드린 질문에 답변해 주시기 바랍니다.”\n2. Mention the candidate’s name naturally throughout the interview.\n3. After each answer, provide an empathetic comment in no more than 2 sentences.\n4. The total number of questions must be **7 in total** (1 after self-introduction + 3 based on the resume + 3 follow-ups).`,
};

type Request = {
  userAnswer: string;
  interviewId: number;
  interviewType: string;
};

export const POST = async (request: NextRequest) => {
  try {
    const token = await getToken({ req: request, secret: NEXTAUTH_SECRET });
    if (!token) return NextResponse.json({ message: EXPIRED_TOKEN }, { status: 401 });

    const { userAnswer, interviewId, interviewType }: Request = await request.json();

    const interviewHistory = await prisma.interviewHistory.findUnique({
      where: { id: interviewId },
      include: { InterviewQnAList: true, resume: true },
    });

    if (!interviewHistory) {
      return NextResponse.json({ message: NOT_FOUND }, { status: 404 });
    }

    /** 첫번째 자기소개 답변 저장 */
    if (interviewHistory.InterviewQnAList.length === 0) {
      await prisma.interviewQnA.create({
        data: {
          interviewHistoryId: interviewId,
          question: '자기소개를 해주세요.',
          answer: userAnswer,
        },
      });
    } else {
      // 첫번째 이후의 답변 저장
      const lastQnA = interviewHistory.InterviewQnAList.at(-1);

      if (lastQnA) {
        await prisma.interviewQnA.update({
          where: { id: lastQnA.id },
          data: { answer: userAnswer },
        });
      }
    }

    /** 사용자 자소서 */
    const userResume = JSON.stringify(interviewHistory.resume.content);

    /** AI 시스템 설정 */
    const systemMessage: ChatCompletionMessageParam = {
      role: 'system',
      content: SYSTEM_INTERVIEW_PROMPT[interviewType] + userResume,
    };

    /** 이전 대화 내용 */
    const previousMessages: ChatCompletionMessageParam[] = interviewHistory.InterviewQnAList.flatMap((item) => [
      { role: 'user', content: item.answer ?? '' },
      { role: 'assistant', content: item.question ?? '' },
    ]);

    /** 최종적으로 AI에게 전달할 메시지 */
    const fullMessageList: ChatCompletionMessageParam[] = [
      systemMessage,
      ...previousMessages,
      { role: 'user', content: userAnswer },
    ];

    const completion = await openAi.chat.completions.create({
      ...DEFAULT_COMPLETION_OPTIONS,
      messages: fullMessageList,
    });

    if (!completion) {
      return NextResponse.json({ message: AI_REQUEST_FAILURE }, { status: 400 });
    }

    const response = completion.choices[0].message.content;

    /** 질문 저장 */
    await prisma.interviewQnA.create({
      data: {
        interviewHistoryId: interviewId,
        question: response,
      },
    });

    return NextResponse.json({ response }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: AI_SERVER_ERROR }, { status: 500 });
  }
};
