import {AxiosError, AxiosRequestConfig} from 'axios';

import {clearSession, getAccessToken, refreshAccessToken} from '../auth/authSession';
import {apiPaths} from '../constants/apiPaths';
import {locale} from '../constants';
import {http} from './httpClient';

type ApiErrorBody = {
  error?: string;
};

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

function isAuthPath(url?: string): boolean {
  return (
    url?.includes(apiPaths.auth.login) === true ||
    url?.includes(apiPaths.auth.refresh) === true
  );
}

function toApiError(error: AxiosError<ApiErrorBody>): ApiError {
  const status = error.response?.status ?? 0;
  const message =
    error.response?.data?.error ??
    error.message ??
    locale.errors.requestFailed(status || locale.errors.network);
  return new ApiError(message, status);
}

/** Attach current access token to outgoing requests. */
http.interceptors.request.use(requestConfig => {
  if (!requestConfig.headers.Authorization) {
    const token = getAccessToken();
    if (token) {
      requestConfig.headers.Authorization = `Bearer ${token}`;
    }
  }
  return requestConfig;
});

/**
 * On 401: call POST /auth/refresh with stored refresh token,
 * save the new access token, then retry the original request.
 */
http.interceptors.response.use(
  response => response,
  async (error: AxiosError<ApiErrorBody>) => {
    const original = error.config;

    if (
      !original ||
      original._retry ||
      original.skipAuthRefresh ||
      error.response?.status !== 401 ||
      isAuthPath(original.url)
    ) {
      throw toApiError(error);
    }

    try {
      const nextToken = await refreshAccessToken();
      original._retry = true;
      original.headers.Authorization = `Bearer ${nextToken}`;
      return http(original);
    } catch {
      await clearSession();
      throw new ApiError(locale.errors.sessionExpired, 401);
    }
  },
);

export type ApiRequestOptions = AxiosRequestConfig & {
  accessToken?: string;
};

export async function apiRequest<T>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<T> {
  const {accessToken, skipAuthRefresh, ...axiosConfig} = options;

  const response = await http.request<T>({
    url: path,
    ...axiosConfig,
    headers: {
      ...axiosConfig.headers,
      ...(accessToken ? {Authorization: `Bearer ${accessToken}`} : null),
    },
    skipAuthRefresh,
  });

  return response.data;
}

export async function apiFormRequest<T>(
  path: string,
  formData: FormData,
  accessToken?: string,
): Promise<T> {
  const response = await http.request<T>({
    url: path,
    method: 'POST',
    data: formData,
    headers: {
      Accept: 'application/json',
      ...(accessToken ? {Authorization: `Bearer ${accessToken}`} : null),
    },
  });

  return response.data;
}
