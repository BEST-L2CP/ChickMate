/**
 *
 * @param {Date} - 날짜 데이터
 * @returns {number | null} - 현재 날짜와 비교하여 D-day를 표시 오류가 났을 때는 null return
 */
export const formatRemainDay = (date: Date | string): number | null => {
  const MILLISECONDS_IN_ONE_DAY = 1000 * 60 * 60 * 24;
  try {
    const currentDate = new Date();
    if (typeof date !== 'object') {
      const formatDate = new Date(date);
      const daysRemaining = Math.ceil((formatDate.getTime() - currentDate.getTime()) / MILLISECONDS_IN_ONE_DAY);
      return daysRemaining;
    } else {
      const daysRemaining = Math.ceil((date.getTime() - currentDate.getTime()) / MILLISECONDS_IN_ONE_DAY);
      return daysRemaining;
    }
  } catch (error) {
    return null;
  }
};
