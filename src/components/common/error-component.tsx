'use client';

import Typography from '@/components/ui/typography';
import Button from '@/components/ui/button';

const DEFAULT_ERROR_MESSAGE = '에러가 발생했습니다.🥲';
const ErrorComponent = () => {
  return (
    <section className='flex w-full flex-col items-center'>
      <Typography as='h2' size='xl'>
        {DEFAULT_ERROR_MESSAGE}
      </Typography>
      <div className='mt-4'>
        <Button size='large' onClick={() => window.location.reload()}>
          새로고침
        </Button>
      </div>
    </section>
  );
};

export default ErrorComponent;
