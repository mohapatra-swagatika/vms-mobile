export const locale = {
  storageKeys: {
    authSession: 'auth_session',
    mmkvInstanceId: 'vms-mobile',
  },
  api: {
    clientId: 'mobile',
  },
  login: {
    screen: {
      title: 'Sign in',
      subtitle: 'Use your email and password to continue.',
    },
    form: {
      email: {
        label: 'Email',
        placeholder: 'name@company.com',
      },
      password: {
        label: 'Password',
        placeholder: 'Enter your password',
      },
    },
    actions: {
      signIn: 'Sign in',
    },
    validation: {
      emailRequired: 'Email is required.',
      passwordRequired: 'Password is required.',
      invalidEmail: 'Please enter a valid email address.',
      invalidPassword: 'Password must be at least 6 characters.',
    },
    errors: {
      loginFailed: 'Login failed.',
      loadConfigFailed: 'Could not load app configuration.',
    },
    boot: {
      restoringSession: 'Restoring session...',
    },
    accessibility: {
      showPassword: 'Show password',
      hidePassword: 'Hide password',
    },
  },
  home: {
    screen: {
      title: 'Welcome',
      signedInAs: (email: string) => `Signed in as ${email}.`,
    },
    gallery: {
      title: 'Gallery',
      subtitle: 'Swipe to view photos for your location.',
      loading: 'Loading images...',
      loadFailed: 'Could not load images from server.',
      empty: 'No images available',
      imageCounter: (current: number, total: number) => `${current} / ${total}`,
    },
    actions: {
      signOut: 'Sign out',
    },
  },
  errors: {
    sessionExpired: 'Session expired. Please sign in again.',
    requestFailed: (status: number | string) => `Request failed (${status})`,
    network: 'network',
    authProvider: 'useAuth must be used within AuthProvider',
    noRefreshToken: 'No refresh token',
    refreshMissingAccessToken: 'Refresh response missing access_token',
  },
  accessibility: {
    userImage: 'User image',
  },
} as const;
