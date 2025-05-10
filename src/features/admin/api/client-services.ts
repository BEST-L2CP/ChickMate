import { API_METHOD } from '@/constants/api-method-constants';
import { ROUTE_HANDLER_PATH } from '@/constants/path-constant';
import { fetchWithSentry } from '@/utils/fetch-with-sentry';
import { Notify } from 'notiflix';

const { ROOT } = ROUTE_HANDLER_PATH.ADMIN;
const { PATCH } = API_METHOD;

/**
 *
 * @description 사람인 데이터를 정제하여 DB로 보내는 로직
 */
export const postJobPostingDataToDatabase = async (): Promise<void> => {
  const { response } = await fetchWithSentry(ROOT, {
    method: PATCH,
  });

  Notify.success(response.message);
};
