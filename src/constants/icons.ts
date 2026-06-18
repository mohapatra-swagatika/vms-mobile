export type IconFamily =
  | 'ionicons'
  | 'feather'
  | 'material'
  | 'fontawesome6';

export type IconSpec = {
  family: IconFamily;
  name: string;
};

export const icons = {
  eye: {family: 'ionicons', name: 'eye-outline'},
  eyeOff: {family: 'ionicons', name: 'eye-off-outline'},
  arrowLeft: {family: 'feather', name: 'chevron-left'},
  logOut: {family: 'feather', name: 'log-out'},
  userPlus: {family: 'feather', name: 'user-plus'},
  users: {family: 'feather', name: 'users'},
  search: {family: 'feather', name: 'search'},
  mail: {family: 'feather', name: 'mail'},
  phone: {family: 'feather', name: 'phone'},
  building: {family: 'feather', name: 'briefcase'},
  user: {family: 'feather', name: 'user'},
  checkIn: {family: 'ionicons', name: 'log-in-outline'},
  checkOut: {family: 'ionicons', name: 'log-out-outline'},
  shield: {family: 'feather', name: 'shield'},
  clock: {family: 'feather', name: 'clock'},
  camera: {family: 'feather', name: 'camera'},
} satisfies Record<string, IconSpec>;
