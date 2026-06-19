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
  visitors: {
    root: '/visitors',
    checkIn: (id: string) => `/visitors/${id}/checkin`,
    checkOut: (id: string) => `/visitors/${id}/checkout`,
  },
} as const;

export type ApiPath =
  | (typeof apiPaths.auth)[keyof typeof apiPaths.auth]
  | (typeof apiPaths.users)[keyof typeof apiPaths.users]
  | (typeof apiPaths.visitors)[keyof typeof apiPaths.visitors]
  | ReturnType<(typeof apiPaths.visitors)['checkIn']>;
