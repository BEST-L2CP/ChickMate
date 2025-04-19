/**
 *
 * @param input Unix timestamp (초 단위)
 * @returns "yyyy.mm.dd" 형식의 날짜 문자열
 */
type Props = {
  input: number;
};
export const formatTimestamp = ({ input }: Props): string => {
  const date = new Date(input * 1000);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');

  return `${year}.${month}.${day}`;
};
