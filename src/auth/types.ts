export type StoredUser = {
  id: string;
  email: string;
  name: string;
  phone?: string | null;
};

export type StoredSession = {
  refreshToken: string;
  user: StoredUser;
  permissions: string[];
};
