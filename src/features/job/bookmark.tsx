'use client';

import { useEffect, useState } from 'react';
import { useBookmarkQuery } from '@/features/job/hooks/use-bookmark-query';
import { useBookmarkMutation } from '@/features/job/hooks/use-bookmark-mutation';
import Button from '@/components/ui/button';
import { Star } from '@/components/icons/star';

type Props = {
  jobPostingId: number;
};

const Bookmark = ({ jobPostingId }: Props) => {
  const { data: isBookmarked } = useBookmarkQuery({ jobPostingId });
  const { mutate: bookmarkMutate } = useBookmarkMutation({ jobPostingId });
  const [isMarked, setIsMarked] = useState<boolean | undefined>(isBookmarked);

  useEffect(() => {
    setIsMarked(isBookmarked);
  }, [isBookmarked]);

  const handleClick = () => {
    bookmarkMutate(isMarked!);
    // TODO: alert 구현
  };

  return isMarked ? (
    <button type='button' onClick={handleClick} aria-label='북마크 버튼'>
      <Star width='20' height='20' color='#FDE047' stroke='#FDE047' />
    </button>
  ) : (
    <button type='button' onClick={handleClick} aria-label='북마크 버튼'>
      <Star width='20' height='20' />
    </button>
  );
};

export default Bookmark;
