export const apiPaths = {
  auth: {
    login: '/auth/login',
    refresh: '/auth/refresh',
    permissions: '/auth/permissions',
  },
  users: {
    me: '/users/me',
    meImages: '/users/me/images',
    meConfig: '/users/me/config',
  },
} as const;

export type ApiPath =
  | (typeof apiPaths.auth)[keyof typeof apiPaths.auth]
  | (typeof apiPaths.users)[keyof typeof apiPaths.users];
