export type IconFamily =
  | 'ionicons'
  | 'feather'
  | 'material'
  | 'fontawesome6';

export type IconSpec = {
  family: IconFamily;
  name: string;
};

/**
 * Central icon registry.
 * Add icons here so screens can reference by key instead of hardcoding names.
 */
export const icons = {
  eye: {family: 'ionicons', name: 'eye-outline'},
  eyeOff: {family: 'ionicons', name: 'eye-off-outline'},
} satisfies Record<string, IconSpec>;

