import { DEFAULT } from '@/constants/user-meta-data-constants';
import type { SelectBoxType } from '@/types/select-box';

//@TODO:
// 사람인 api 연결 시 현재 select box의 선택값이 name으로 되어있지만 value로 수정할 것
type Props = {
  options: SelectBoxType[];
  selected: string;
  onSelect: (value: SelectBoxType['name']) => void; //@TODO: 추후 type 'value'로 수정
};

const SelectBox = ({ options, selected = DEFAULT, onSelect }: Props) => {
  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onSelect(e.target.value);
  };

  return (
    <select
      value={selected}
      onChange={handleSelect}
      className='my-1 rounded-[8px] border border-cool-gray-200 px-4 py-2'
    >
      <option value={DEFAULT}>선택</option>
      {options.map((option) => (
        <option key={`option_${option.name}`} value={option.value}>
          {option.name}
        </option>
      ))}
    </select>
  );
};

export default SelectBox;
