import Typography from '@/components/ui/typography';
import UserMetaDataForm from '@/features/user-meta-data/user-meta-data-form';

const UserMetaDataModal = () => {
  return (
    <section>
      <Typography as='h1' size='lg' align='center'>
        주요 이력 작성하기
      </Typography>
      <UserMetaDataForm />
    </section>
  );
};

export default UserMetaDataModal;
