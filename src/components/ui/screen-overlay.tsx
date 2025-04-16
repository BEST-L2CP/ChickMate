type Props = {
  children: React.ReactNode;
};

// 상위 컴포넌트에 relative 적용 필수

const ScreenOverlay = ({ children }: Props) => {
  return (
    <div className='absolute inset-0 z-10 flex items-center justify-center bg-white/40 backdrop-blur-sm'>
      {children}
    </div>
  );
};

export default ScreenOverlay;
