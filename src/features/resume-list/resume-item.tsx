import { formatDate } from '@/utils/format-date';
import Typography from '@/components/ui/typography';
import type { ResumeType } from '@/types/DTO/resume-dto';
import clsx from 'clsx';

type Props = {
  resume: ResumeType;
  onClick: (resumeId: ResumeType['id']) => void;
  isLastChild?: boolean;
};

const ResumeItem = ({ resume, onClick, isLastChild = false }: Props) => {
  const { id, title, createdAt, tryCount } = resume;
  const hasNotInterviewed = tryCount === 0;

  return (
    <li onClick={() => onClick(id)} className={clsx('cursor-pointer py-2', isLastChild ? 'border-b-0' : 'border-b')}>
      <Typography size='sm' weight='normal' color='gray-500'>
        {formatDate({ input: createdAt })}
      </Typography>
      <div className='flex items-end justify-between'>
        <Typography weight='bold'>{title}</Typography>
        {hasNotInterviewed ? (
          <Typography size='sm' weight='bold' color='gray-500' as='span'>
            면접 보기 전
          </Typography>
        ) : (
          <Typography size='sm' weight='bold' color='primary-600' as='span'>
            {tryCount}회 면접 완료
          </Typography>
        )}
      </div>
    </li>
  );
};

export default ResumeItem;
