'use client';

import Image from 'next/image';
import { Session } from 'next-auth';
import Typography from '@/components/ui/typography';
import ScreenOverlay from '@/components/ui/screen-overlay';
import BlockComponent from '@/components/common/block-component';
import { defaultCharacter } from '@/features/character/data/character-data';
import { useCharacterCard } from '@/features/character/hooks/use-character-card';
import type { CharacterType } from '@/types/DTO/character-dto';

type Props = {
  characterData?: CharacterType;
  requiredModal?: boolean;
  overlayText?: string;
  session?: Session;
};

const MyPageCharacterCard = ({
  characterData = defaultCharacter,
  requiredModal = false,
  overlayText,
  session,
}: Props) => {
  const { isDefault, type, level, characterName, handleClickCard } = useCharacterCard({
    characterData,
    overlayText,
    requiredModal,
    session,
  });

  return (
    <>
      <div
        onClick={handleClickCard}
        className='relative flex h-full w-[524px] cursor-pointer flex-col justify-between overflow-hidden rounded-3xl border-2 shadow-lg'
      >
        {isDefault && (
          <ScreenOverlay>
            <BlockComponent
              firstLine={session ? '이런! 내 캐릭터가 없어요!' : '이런! 로그인을 하지 않았어요!'}
              secondLine={session ? '캐릭터를 설정해볼까요?' : '로그인이 필요합니다!'}
              thirdLine={session ? 'ChickNate를 설정하고 함께 성장해요' : ''}
              buttonName={session ? '캐릭터 선택하기' : '로그인하러 가기'}
              href={session ? undefined : '/sign-in'}
            />
          </ScreenOverlay>
        )}
        <div className={`flex h-full justify-between ${isDefault && 'opacity-60'}`}>
          <div className='mobile:w-[25vh] flex items-center justify-center'>
            <Image
              src={`/assets/character/card/${type}-level${level}.png`}
              width={242}
              height={242}
              alt='character-img'
              priority
            />
          </div>
          <div className='flex flex-1 flex-col justify-between py-6 pr-9'>
            <Typography size='sm' align='right' as='span'>
              ChickMate
            </Typography>
            <div className='flex flex-col gap-1'>
              <Typography className='mobile:text-lg mobile:whitespace-nowrap mobile:max-w-[150px] mobile:truncate text-3xl font-bold'>
                {session && session.user.name}님
              </Typography>
              <Typography size='xs' color='gray-500'>
                {characterName}
              </Typography>
            </div>
            <div className='flex justify-end'>
              <img
                src='/assets/character/card/card_assets.svg'
                alt='card-assets'
                className='mobile:w-[120px] w-[175px]'
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MyPageCharacterCard;
