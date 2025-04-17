'use client';

import BlockComponent from '@/components/common/block-component';
import JobPostingCard from '@/features/job/job-posting-card';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { QUERY_KEY } from '@/constants/query-key';
import { useJobPostingQuery } from '@/features/job/hooks/use-job-posting-query';
import { UserMetaDataType } from '@/types/user-meta-data-type';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

type Props = {
  userId: string;
};

const { META_DATA } = QUERY_KEY;

const JobPostingsBox = ({ userId }: Props) => {
  // TODO: 추후 변경 가능성 고려
  const queryClient = useQueryClient();
  const userMetaData = queryClient.getQueryData([META_DATA, userId]) as UserMetaDataType;
  const { data: jobPostingList, isError, isPending } = useJobPostingQuery({ userMetaData });

  if (isPending) {
    // TODO: 로딩스피너
    return (
      <section className='flex h-[400px] flex-col items-center justify-center self-stretch'>
        <LoadingSpinner size='lg' />
      </section>
    );
  }

  if (isError) {
    return (
      <section className='flex h-[400px] flex-col items-center justify-center self-stretch'>
        <BlockComponent
          firstLine='이런! 사용자 정보를 설정하지 않았네요!'
          secondLine='내 정보를 작성해볼까요?'
          thirdLine='맞춤형 채용공고는 내 정보를 기반으로 진행됩니다'
        />
      </section>
    );
  }

  const router = useRouter();
  if (!jobPostingList || jobPostingList.length === 0) {
    // TODO: 그 외에 아이콘 추가
    return (
      <section className='flex h-[400px] flex-col items-center justify-center self-stretch'>
        <BlockComponent
          firstLine='이런! 나에게 맞는 채용공고가 없어요!'
          secondLine='채용공고를 다시 요청할까요?'
          thirdLine='맞춤형 채용공고는 내 정보를 기반으로 진행됩니다'
          buttonName='채용공고 불러오기!'
          onClick={() => router.refresh()}
        />
      </section>
    );
  }

  return (
    // TODO: 무한 스크롤 구현
    <section className='flex flex-row flex-wrap gap-5 self-stretch scrollbar-hide'>
      {jobPostingList.map((jobPosting) => (
        <JobPostingCard key={jobPosting.id} jobPosting={jobPosting}></JobPostingCard>
      ))}
      <JobPostingCard jobPosting={mockJobPosting}></JobPostingCard>
      <JobPostingCard jobPosting={mockJobPosting}></JobPostingCard>
      <JobPostingCard jobPosting={mockJobPosting}></JobPostingCard>
      <JobPostingCard jobPosting={mockJobPosting}></JobPostingCard>
      <JobPostingCard jobPosting={mockJobPosting}></JobPostingCard>
      <JobPostingCard jobPosting={mockJobPosting}></JobPostingCard>
      <JobPostingCard jobPosting={mockJobPosting}></JobPostingCard>
      <JobPostingCard jobPosting={mockJobPosting}></JobPostingCard>
      <JobPostingCard jobPosting={mockJobPosting}></JobPostingCard>
      <JobPostingCard jobPosting={mockJobPosting}></JobPostingCard>
      <JobPostingCard jobPosting={mockJobPosting}></JobPostingCard>
      <JobPostingCard jobPosting={mockJobPosting}></JobPostingCard>
      <JobPostingCard jobPosting={mockJobPosting}></JobPostingCard>
      <JobPostingCard jobPosting={mockJobPosting}></JobPostingCard>
    </section>
  );
};

export default JobPostingsBox;

const mockJobPosting = {
  id: 10,
  company: '삼성전자',
  title: '삼성전자 신입사원 모집',
  experienceType: '신입',
  expiredAt: new Date('2025-04-21'),
  postedAt: new Date('2025-06-01'),
  jobType: '의료',
  location: {
    mainRegion: '서울',
    subRegion: '강남구',
  },
  educationLevel: '대졸(4년)',
  url: 'https://www.samsung.com/sec/careers/',
  employmentType: '정규직',
  createdAt: new Date(),
};
