/**
 *
 * @param {Date | string | number} - 날짜 데이터 | 스트링 날짜 데이터 | timestamp
 * @returns {number | null} - 현재 날짜와 비교하여 D-day를 표시 오류가 났을 때는 null return
 */
export const formatRemainDay = (date: Date | string | number): number | null => {
  const MILLISECONDS_IN_ONE_DAY = 1000 * 60 * 60 * 24;
  try {
    const currentDate = new Date();
    const targetDate =
      typeof date === 'string' ? new Date(date) : typeof date === 'number' ? new Date(date * 1000) : date;
    const daysRemaining = Math.ceil((targetDate.getTime() - currentDate.getTime()) / MILLISECONDS_IN_ONE_DAY);
    return daysRemaining;
  } catch (error) {
    return null;
  }
};
