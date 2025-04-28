'use client';
import { useRef } from 'react';

/**
 * 지정한 시간(`delay`) 동안 중복 실행을 방지하는 디바운싱 훅
 * @param cbFunc - 디바운싱 적용할 콜백 함수
 * @param delay - 디바운스 지연 시간
 * @returns 디바운싱이 적용된 콜백 함수
 */
export const useFuncDebounce = <T extends (...args: any[]) => unknown>(cbFunc: T, delay: number = 1500) => {
  const timerRef = useRef(true);
  return (...args: Parameters<T>) => {
    if (timerRef.current) {
      timerRef.current = false;
      cbFunc(...args);
      setTimeout(() => {
        timerRef.current = true;
      }, delay);
    }
  };
};
