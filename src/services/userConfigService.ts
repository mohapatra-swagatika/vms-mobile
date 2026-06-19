import {apiPaths} from '../constants/apiPaths';
import {apiRequest} from './apiClient';
import {UserConfig} from '../types/config';

type UserConfigResponse = UserConfig & {
  scope?: {
    entity_type?: UserConfig['entity_type'];
    entity_id?: string | null;
    entity_name?: string | null;
    scope_type?: UserConfig['entity_type'];
    scope_id?: string | null;
  };
};

/**
 * Fetches entity notification config for the logged-in user's scoped entity.
 * Endpoint: GET /users/me/config (Bearer token required)
 */
export async function getUserConfig(): Promise<UserConfig> {
  const data = await apiRequest<UserConfigResponse>(apiPaths.users.meConfig, {
    method: 'GET',
  });

  if (data.entity_type !== undefined || !data.scope) {
    return data;
  }

  return {
    entity_type: data.scope.entity_type ?? data.scope.scope_type ?? null,
    entity_id: data.scope.entity_id ?? data.scope.scope_id ?? null,
    entity_name: data.scope.entity_name ?? null,
    source: data.source ?? null,
    config: data.config,
    recipients: data.recipients,
  };
}
