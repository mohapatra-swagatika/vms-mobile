export const strings = {
  auth: {
    title: 'Sign in',
    subtitle: 'Use your email and password to continue.',
    emailLabel: 'Email',
    emailPlaceholder: 'name@company.com',
    passwordLabel: 'Password',
    passwordPlaceholder: 'Enter your password',
    signInCta: 'Sign in',
    showPasswordA11y: 'Show password',
    hidePasswordA11y: 'Hide password',
    emailRequired: 'Email is required.',
    passwordRequired: 'Password is required.',
    invalidEmail: 'Please enter a valid email address.',
    invalidPassword: 'Password must be at least 6 characters.',
    loginFailed: 'Login failed.',
  },
  home: {
    title: 'Welcome',
    signedInAs: (email: string) => `Signed in as ${email}.`,
    galleryTitle: 'Gallery',
    gallerySubtitle: 'Swipe to view photos for your location.',
    signOut: 'Sign out',
    loadingImages: 'Loading images...',
    loadImagesFailed: 'Could not load images from server.',
    noImages: 'No images available',
  },
} as const;

