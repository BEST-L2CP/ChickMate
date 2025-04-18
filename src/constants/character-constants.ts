// ############## 캐릭터 경험치 획득 조건 ###############
// 캐릭터 생성 : +1,000
// 처음 내 정보 입력 : +500 (최초 1번)
// 면접 완료 : + 300 (여러번 가능)
// 자소서 완성 : + 300 (하루 최대 3개 작성 가능)
// 채용 공고 페이지 접속 : +100 (하루 최대 5번 가능)
// ############## 레벨업 기준 ###############
// Lv1 → Lv2	1,500	+1,500
// Lv2 → Lv3	3,000	+1,500
// Lv3 → Lv4	6,000	+2,500
// Lv4 → Lv5	10,000	+4,500
// Lv5 → Lv6	17,000	+7,000
// #################################################

type CharacterDescription = Record<number, { name: string }>;
type CharacterInfo = Record<string, CharacterDescription>;

export const LEVEL_EXP = [0, 1500, 3000, 6000, 10000, 17000] as const;

export const CHARACTER_INFORMATION: CharacterInfo = {
  clay: {
    1: { name: '칰칰이 알' },
    2: { name: '학생 칰칰' },
    3: { name: '백수 칰칰' },
    4: { name: '안경잽이 칰칰' },
    5: { name: '신입 칰칰' },
    6: { name: '회사원 칰칰' },
  },
  poly: {
    1: { name: '칰꿍이 알' },
    2: { name: '학생 칰꿍' },
    3: { name: '백수 칰꿍' },
    4: { name: '안경잽이 칰꿍' },
    5: { name: '신입 칰꿍' },
    6: { name: '회사원 칰꿍' },
  },
};

export const CHARACTER_HISTORY_KEY = {
  CREATE_CHARACTER: 'CREATE_CHARACTER', //캐릭터 생성
  RESUME_SUBMISSION: 'RESUME_SUBMISSION', // 이력서 제출
  INTERVIEW_COMPLETION: 'INTERVIEW_COMPLETION', // 면접 완료
  FILL_OUT_META_DATA: 'FILL_OUT_META_DATA', // 유저 정보 작성
  MOVE_TO_JOB_URL: 'MOVE_TO_JOB_URL', // 채용 공고 url로 이동
} as const;

export const CHARACTER_HISTORY_KOR = {
  LOGIN: '로그인',
  CREATE_CHARACTER: '캐릭터 생성',
  RESUME_SUBMISSION: '자소서 작성 완료',
  INTERVIEW_COMPLETION: '면접 완료',
  FILL_OUT_META_DATA: '유저 정보 최초 작성',
  MOVE_TO_JOB_URL: '채용 공고 페이지 이동',
};

const { CREATE_CHARACTER, RESUME_SUBMISSION, INTERVIEW_COMPLETION, FILL_OUT_META_DATA, MOVE_TO_JOB_URL } =
  CHARACTER_HISTORY_KEY;

export const CHARACTER_HISTORY = {
  [CREATE_CHARACTER]: { amount: 1000 },
  [RESUME_SUBMISSION]: { amount: 300 },
  [INTERVIEW_COMPLETION]: { amount: 300 },
  [FILL_OUT_META_DATA]: { amount: 500 },
  [MOVE_TO_JOB_URL]: { amount: 100 },
} as const;
