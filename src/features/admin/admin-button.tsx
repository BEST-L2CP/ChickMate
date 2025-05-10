'use client';

import Button from '@/components/ui/button';
import { postJobPostingDataToDatabase } from '@/features/admin/api/client-services';
import { showNotiflixConfirm } from '@/utils/show-notiflix-confirm';

const AdminButton = () => {
  const handleOnClick = () => {
    showNotiflixConfirm({
      message: '이번 업데이트 차례가 당신이 맞습니까? 진짜로??',
      okFunction: async () => {
        await postJobPostingDataToDatabase();
      },
    });
  };
  return (
    <div>
      <Button onClick={handleOnClick}>DB PATCH</Button>
    </div>
  );
};

export default AdminButton;
