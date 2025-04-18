'use client';
import clsx from 'clsx';
import { useEffect } from 'react';
import { useTabStore } from '@/store/use-tab-store';
import Badge from '@/components/ui/badge';
import { TABS } from '@/constants/my-page-constants';
import type { Tabs } from '@/types/tab-type';

const { BOOKMARK, RESUME, HISTORY } = TABS;

const tabs = [
  {
    id: HISTORY,
    title: '면접기록',
  },
  {
    id: BOOKMARK,
    title: '북마크한 채용공고',
  },
  {
    id: RESUME, //@TODO:  zustand 타입에도 추가 부탁드립니다.
    title: '내가 작성한 자소서',
  },
];

type Props = {
  tabCounts: {
    resumes: number;
    interviewHistories: number;
    userSelectedJobs: number;
  };
};

const TabButtons = ({ tabCounts }: Props) => {
  const { setTab, tab: targetTab, resetTab } = useTabStore();
  const handleChangeTab = (newTab: Tabs) => {
    if (newTab === RESUME) return; //@TODO: 아직 자소서쪽이 미완이라 일단 tab change는 막아두겠습니다.
    setTab(newTab);
  };
  useEffect(() => {
    return () => resetTab();
  }, []);
  return (
    <ul className='flex h-12 items-center justify-evenly bg-cool-gray-100'>
      {tabs.map((tab) => (
        <li
          key={`tab_${tab.id}`}
          className={clsx(
            'text-md w-1/3 px-4 py-[14px] text-center font-bold text-cool-gray-900',
            targetTab === tab.id && 'border-b-2 border-b-cool-gray-900'
          )}
        >
          <button
            className={clsx('w-full', tab.id === RESUME && 'cursor-not-allowed')}
            onClick={() => handleChangeTab(tab.id)}
          >
            {tab.title}
            {tabCounts[tab.id] !== 0 && (
              <Badge mx={1} size='small' color='dark'>
                {tabCounts[tab.id]}
              </Badge>
              // <span className='mx-1 rounded-xl bg-cool-gray-900 px-[10px] py-[2px] text-xs text-cool-gray-50'>
              //   {tabCounts[tab.id]}개
              // </span>
            )}
          </button>
        </li>
      ))}
    </ul>
  );
};

export default TabButtons;
