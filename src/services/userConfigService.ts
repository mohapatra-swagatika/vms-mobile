import {apiPaths} from '../constants/apiPaths';
import {apiRequest} from './apiClient';
import {UserConfig} from '../types/config';

/**
 * Fetches entity notification config for the logged-in user's scoped entity.
 * Endpoint: GET /users/me/config (Bearer token required)
 */
export async function getUserConfig(): Promise<UserConfig> {
  return apiRequest<UserConfig>(apiPaths.users.meConfig, {
    method: 'GET',
  });
}
