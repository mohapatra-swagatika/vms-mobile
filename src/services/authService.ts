import {LoginResponse} from '../types/auth';
import {apiRequest} from './apiClient';

export async function loginWithEmail(
  email: string,
  password: string,
): Promise<LoginResponse> {
  return apiRequest<LoginResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({email, password, client: 'mobile'}),
  });
}
