'use client';

import Button from '@/components/ui/button';
import { postJobPostingDataToDatabase } from '@/features/admin/api/client-services';

const AdminButton = () => {
  const handleOnClick = async () => {
    await postJobPostingDataToDatabase();
  };
  return (
    <div>
      <Button onClick={handleOnClick}>DB PATCH</Button>
    </div>
  );
};

export default AdminButton;
