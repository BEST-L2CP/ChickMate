import { API_METHOD } from '@/constants/api-method-constants';
import { ROUTE_HANDLER_PATH } from '@/constants/path-constant';
import { fetchWithSentry } from '@/utils/fetch-with-sentry';

const { ROOT } = ROUTE_HANDLER_PATH.ADMIN;
const { POST } = API_METHOD;

/**
 *
 * @description 사람인 데이터를 정제하여 DB로 보내는 로직
 */
export const postJobPostingDataToDatabase = async (): Promise<void> => {
  const { response } = await fetchWithSentry(ROOT, {
    method: POST,
  });

  // TODO: 관리자에게 알리는 alert로 변경
  alert(response.message);
};
