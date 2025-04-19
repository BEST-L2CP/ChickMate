import { Star } from '@/components/icons/star';
import Typography from '@/components/ui/typography';
import { JobPosting, UserSelectedJob } from '@prisma/client';
import { formatRemainDay } from '@/utils/format-remain-day';
import clsx from 'clsx';
import Button from '@/components/ui/button';
import { useBookmarkMutation } from '@/features/job/hooks/use-bookmark-mutation';
import { formatTimestamp } from '@/utils/format-timestamp';

const experienceType: Record<number, string> = {
  0: '경력무관',
  1: '신입',
  2: '경력',
  3: '신입/경력',
};

type Props = {
  bookmark: UserSelectedJob & { jobPosting: JobPosting };
  index: number;
  length: number;
  userId: string;
};
const BookmarkTab = ({ bookmark, index, length, userId }: Props) => {
  const { mutate: bookmarkMutate } = useBookmarkMutation({
    jobPostingId: bookmark.jobPostingId,
    userId,
  });

  const { jobPosting } = bookmark;
  const { companyName, positionTitle, experienceCode } = jobPosting;

  const postedAtDate = formatTimestamp({ input: jobPosting.openingTimestamp });
  const expiredAtDate = formatTimestamp({ input: jobPosting.expirationTimestamp });
  const remainDay = formatRemainDay(jobPosting.expirationTimestamp);

  const handleDeleteBookmark = async () => {
    /* TODO: alert 로직 구현 */
    bookmarkMutate(true);
  };

  return (
    <li className={clsx('flex flex-col items-center py-4', length !== index + 1 && 'border-b')}>
      <div className='flex w-full flex-row items-start justify-between'>
        <div>
          <Typography size='sm' color='gray-500' weight='bold'>
            {companyName}
          </Typography>
          <Typography weight='bold' size='lg' lineClamp='1'>
            {positionTitle}
          </Typography>
        </div>
        <button type='button' onClick={handleDeleteBookmark} aria-label='북마크 버튼'>
          <Star width='18' height='18' color='#FDE047' stroke='#FDE047' />
        </button>
      </div>
      <div className='flex w-full flex-row items-center justify-between'>
        <div className='flex flex-row gap-6'>
          <Typography size='xs' color='gray-500'>
            {experienceType[experienceCode]}
          </Typography>
          <Typography size='xs' color='gray-500'>
            {postedAtDate}~{expiredAtDate}
          </Typography>
        </div>
        <div className='flex flex-row items-center justify-between gap-3'>
          {remainDay ? (
            <Typography color='primary-600'>D-{remainDay}</Typography>
          ) : (
            <Typography color='primary-600'>날짜정보 오류</Typography>
          )}
          {bookmark.jobPosting.url ? (
            <Button
              target='_blank'
              size='small'
              link
              href={bookmark.jobPosting.url}
              variant='outline'
              color='dark'
              square
            >
              바로 가기
            </Button>
          ) : (
            <Button disabled variant='outline' size='small' color='dark' square>
              페이지 접근 불가
            </Button>
          )}
        </div>
      </div>
    </li>
  );
};

export default BookmarkTab;
