import type { User } from '@prisma/client';

export const PATH = {
  MAIN: '/',
  AUTH: {
    SIGN_IN: '/auth/sign-in',
    SIGN_UP: '/auth/sign-up',
    SIGN_IN_WITH_PREV_URL: (prevPath: string) => `/auth/sign-in?prevUrl=${prevPath}`,
    CHARACTER: '/auth/character',
  },
  ON_BOARDING: '/on-boarding',
  MY_PAGE: '/my-page',
  RESUME: {
    ROOT: '/resume',
    DETAIL: (id: number) => `/resume/${id}`,
  },
  INTERVIEW: {
    ROOT: '/interview',
    START: '/interview/start',
    LIVE_ROOT: '/interview/live',
    LIVE: (id: number) => `/interview/live/${id}`,
  },
  JOB: '/job',
};

export const ROUTE_HANDLER_PATH = {
  AUTH: {
    SIGN_UP: '/api/sign-up',
    SIGN_IN: '/api/auth/sign-in',
  },
  AI: {
    ROOT: '/api/ai',
    STT: '/api/ai/stt',
    TTS: '/api/ai/tts',
    INTERVIEW: '/api/ai/interview',
    INTERVIEW_START: (id: number) => `/api/ai/interview/${id}`,
    INTERVIEW_LIVE: (id: number) => `/api/ai/interview/${id}`,
    FEEDBACK: '/api/ai/feedback',
  },
  RESUME: {
    ROOT: '/api/resume',
    DETAIL: (id: number) => `/api/resume/${id}`,
    SUBMIT: `/api/resume/submit`,
    SUBMIT_DETAIL: (id: number) => `/api/resume/submit/${id}`,
    DRAFT: `/api/resume/draft`,
    DRAFT_DETAIL: (id: number) => `/api/resume/draft/${id}`,
  },
  USER: {
    META_DATA: '/api/user-meta-data',
    LIST_COUNT: (userId: User['id']) => `/api/my-page/tab-counts/${userId}`,
    INTERVIEW_HISTORY: '/api/interview-history',
    INTERVIEW_DETAIL: (id: number) => `/api/ai/interview/${id}`,
  },
  REGIONS: '/api/regions',
  JOB: {
    POSTING: '/api/job/posting',
    BOOKMARK: '/api/job/bookmark',
    BOOKMARK_DETAIL: (id: number) => `/api/job/bookmark/${id}`,
  },
  CHARACTER: {
    INFO: '/api/character',
    EXPERIENCE: '/api/character/experience',
    HISTORY: (id: number) => `/api/character/history/${id}`,
  },
  ADMIN: {
    ROOT: '/api/admin',
  },
};

export const QUERY_PARAMS = {
  ERROR: 'error',
  UNAUTH: 'unauthorized',
};

const {
  RESUME: { ROOT },
  INTERVIEW: { START },
  JOB,
} = PATH;
export const PUBLIC_PAGE = [ROOT, START, JOB]; //비회원도 접근할 수 있는 페이지
