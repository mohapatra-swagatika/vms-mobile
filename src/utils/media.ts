import {config} from '../constants/config';

export function resolveMediaUrl(url: string | null | undefined): string | null {
  if (!url?.trim()) {
    return null;
  }
  if (/^https?:\/\//i.test(url)) {
    return url;
  }
  const path = url.startsWith('/') ? url : `/${url}`;
  return `${config.apiBaseUrl}${path}`;
}
