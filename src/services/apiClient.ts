import {config} from '../constants/config';

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

export async function apiRequest<T>(
  path: string,
  options: RequestInit & {accessToken?: string} = {},
): Promise<T> {
  const {accessToken, headers, ...rest} = options;

  const response = await fetch(`${config.apiBaseUrl}${path}`, {
    ...rest,
    headers: {
      Accept: 'application/json',
      ...(rest.body ? {'Content-Type': 'application/json'} : null),
      ...(accessToken ? {Authorization: `Bearer ${accessToken}`} : null),
      ...headers,
    },
  });

  const text = await response.text();
  const data = text ? (JSON.parse(text) as T | ApiErrorBody) : ({} as T);

  if (!response.ok) {
    const message =
      typeof data === 'object' && data && 'error' in data && data.error
        ? String(data.error)
        : `Request failed (${response.status})`;
    throw new ApiError(message, response.status);
  }

  return data as T;
}
