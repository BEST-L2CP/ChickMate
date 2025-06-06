import Typography from '@/components/ui/typography';
import clsx from 'clsx';
import React from 'react';

type Props = {
  type: 'main' | 'header';
  percent: number;
};

const CharacterExpBar = ({ percent, type }: Props) => {
  const size = type === 'main' ? 'sm' : 'xs';
  const width = `w-[${percent}%]`;

  return (
    <div className='flex w-full items-center gap-2'>
      <Typography size={size} color='gray-500' weight='bold'>
        EXP
      </Typography>
      <div className={clsx('h-1 flex-1 overflow-hidden rounded-2xl bg-gray-300')}>
        <div className={clsx('h-1 bg-green-500 transition-all duration-300', width)} />
      </div>
    </div>
  );
};

export default CharacterExpBar;
