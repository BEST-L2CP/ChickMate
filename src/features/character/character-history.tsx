'use client';

import Typography from '@/components/ui/typography';
import { formatDate } from '@/utils/format-date';
import { Character, CharacterHistory } from '@prisma/client';
import { useCharacterHistoryInfiniteQuery } from '@/features/character/hooks/use-character-history-infinite-query';
import { useInfiniteScroll } from '@/hooks/customs/use-infinite-scroll';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { blob } from 'stream/consumers';

type Props = {
  characterData: Character;
};

const CharacterHistoryList = ({ characterData }: Props) => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isPending, isError } = useCharacterHistoryInfiniteQuery(
    characterData.id
  );

  const targetRef = useInfiniteScroll({
    fetchNextPage,
    hasNextPage,
  });

  if (isPending)
    return (
      <div className='flex h-[297px] items-center justify-center'>
        <LoadingSpinner />
      </div>
    );
  if (isError) return <div>에러 발생</div>;

  const characterHistories = data.pages.flatMap((page) => page.histories);

  return (
    <div className='flex h-[297px] w-full flex-col gap-4'>
      <div className='flex h-full flex-col gap-4 overflow-y-auto scroll-smooth pr-2 scrollbar-hide'>
        {characterHistories.length === 0 ? (
          <div className='flex h-full flex-col items-center justify-center'>
            <Typography size='lg'>아직 기록이 없어요.</Typography>
            <Typography size='sm' color='gray-500'>
              활동을 시작해보아요!
            </Typography>
          </div>
        ) : (
          <>
            <ul className='flex flex-col gap-4'>
              {characterHistories.map((history: CharacterHistory) => (
                <li key={history.id} className='flex w-full items-end justify-between'>
                  <div className='flex flex-col justify-end'>
                    <Typography size='sm' color='gray-500'>
                      {formatDate({ input: history.createdAt })}
                    </Typography>
                    <Typography weight='bold'>{history.history}</Typography>
                  </div>
                  <Typography size='sm' weight='bold' color='primary-600'>
                    {history.experience} 경험치 획득!
                  </Typography>
                </li>
              ))}
            </ul>
            <div ref={targetRef} className='flex h-10 w-full items-center justify-center text-sm text-gray-400'>
              {isFetchingNextPage && <span>로딩 중...</span>}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CharacterHistoryList;
