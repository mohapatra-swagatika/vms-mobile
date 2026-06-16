import {apiRequest} from './apiClient';

type LoginResponse = {
  access_token: string;
  refresh_token: string;
  user: {
    id: string;
    email: string;
    name: string;
    phone?: string | null;
  };
};

export async function loginWithEmail(
  email: string,
  password: string,
): Promise<LoginResponse> {
  return apiRequest<LoginResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({email, password, client: 'mobile'}),
  });
}
