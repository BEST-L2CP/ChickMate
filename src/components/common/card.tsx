import clsx from 'clsx';

type Props = {
  children?: React.ReactNode;
  className?: string;
  onClick?: () => void;
};

const Card = ({ children, className, onClick }: Props) => {
  return (
    <section className={clsx(cardClassName, className)} onClick={onClick}>
      {/* content area */}
      <div className={contentClassName}>{children}</div>
    </section>
  );
};

export default Card;
//TODO: bg-emerald-900/0 -> color 수정, outline-gray-200 -> color 수정
const cardClassName = clsx(
  'relative items-start justify-between rounded-lg bg-emerald-900/0 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] outline outline-1 outline-offset-[-1px] outline-gray-200',
  'w-[307px] h-[173px] p-[24px]'
);

const contentClassName = clsx('flex h-full flex-col justify-between');
