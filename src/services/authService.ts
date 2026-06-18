import {StoredUser} from '../auth/types';
import {apiPaths} from '../constants/apiPaths';
import {locale} from '../constants';
import {http} from './httpClient';

export type RefreshTokenResponse = {
  access_token: string;
  refresh_token: string;
  user: StoredUser;
};

type LoginResponse = {
  access_token: string;
  refresh_token: string;
  user: StoredUser;
};

/**
 * Step 1: POST /auth/refresh with the stored refresh token.
 * Returns new access_token (+ rotated refresh_token) for the caller to save.
 */
export async function refreshAccessTokenWithApi(
  refreshToken: string,
): Promise<RefreshTokenResponse> {
  const {data} = await http.post<RefreshTokenResponse>(
    apiPaths.auth.refresh,
    {refresh_token: refreshToken, client: locale.api.clientId},
    {skipAuthRefresh: true},
  );

  if (!data?.access_token) {
    throw new Error(locale.errors.refreshMissingAccessToken);
  }

  return data;
}

export async function loginWithEmail(
  email: string,
  password: string,
): Promise<LoginResponse> {
  const {data} = await http.post<LoginResponse>(
    apiPaths.auth.login,
    {email, password, client: locale.api.clientId},
    {skipAuthRefresh: true},
  );

  return data;
}
