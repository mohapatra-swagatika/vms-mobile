export type UserAssignment = {
  id: string;
  scope_type: 'company' | 'tower' | 'organization' | 'location' | 'global';
  scope_id: string | null;
  expires_at: string | null;
  role_name: string;
  display_name: string;
  level: number;
};

export type LoginResponse = {
  access_token: string;
  refresh_token: string;
  user: {
    id: string;
    email: string;
    name: string;
    phone?: string | null;
  };
  permissions: string[];
  assignments: UserAssignment[];
};
