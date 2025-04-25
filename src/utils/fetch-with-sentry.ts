import { API_HEADER } from '@/constants/api-method-constants';
import { captureException } from '@sentry/nextjs';
import { FetchError } from '@/utils/custom-fetch-error';

type FetchOptions = Omit<RequestInit, 'body'> & {
  body?: string | FormData | URLSearchParams | Blob | null;
  headers?: HeadersInit;
};
const { JSON_HEADER } = API_HEADER;
/**
 * 공통 fetch 요청 래퍼입니다. 에러 처리 및 Sentry 로깅을 포함합니다.
 *
 * @param {string} url - 요청을 보낼 URL
 * @param {FetchOptions} options - fetch 설정 객체
 * @returns {Promise<any>} JSON으로 파싱된 응답 데이터
 * @throws {Error} 요청이 실패하면 에러를 throw합니다.
 */
export const fetchWithSentry = async (url: string, options: FetchOptions = {}) => {
  const { method, body, headers, ...rest } = options;

  let resolvedHeaders = headers;

  if (!headers) {
    const isMultipart = body instanceof FormData || body instanceof URLSearchParams || body instanceof Blob;

    if (!isMultipart) {
      resolvedHeaders = JSON_HEADER;
    }
  }

  const res = await fetch(url, {
    ...rest,
    method: method,
    headers: resolvedHeaders,
    body: body,
  });

  const data = await res.json();
  if (!res.ok) {
    if (res.status >= 500) {
      const error = new Error(`message: ${data.message}, status: ${res.status}`);
      captureException(error, {
        extra: {
          url,
          status: res.status,
          response: data,
        },
      });
    }
    // status를 받아와 client에서 401일 시 로그인 페이지 redirect 처리하기 위해 custom error객체를 만듦
    // 이게 정답은 아님 -> 굉장히 비효율적인 처리. 하지만 추후 리팩토링으로 밀어놓고 임시로 우선 이렇게 처리하여 401 처리
    if (data.status) throw new FetchError(data.message, res.status);
    else throw new Error(data.message); // 서버에서 status를 정의하지 않은 곳을 위해 방어 코드
  }

  return data;
};
