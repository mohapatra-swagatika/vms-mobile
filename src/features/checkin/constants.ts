export type CheckInFormData = {
  phone: string;
  email: string;
  name: string;
  purpose: string;
  hostName: string;
  hostEmail: string;
  organization: string;
  department: string;
  photoUri: string | null;
};

export const INITIAL_CHECK_IN_FORM: CheckInFormData = {
  phone: '',
  email: '',
  name: '',
  purpose: '',
  hostName: '',
  hostEmail: '',
  organization: '',
  department: '',
  photoUri: null,
};

export const CHECK_IN_STEPS = [
  'contact',
  'personal',
  'host',
  'photo',
  'summary',
] as const;

export type CheckInStep = (typeof CHECK_IN_STEPS)[number];

export const PURPOSE_OPTIONS = [
  'Visitor',
  'Vendor',
  'Interview',
  'Customer',
  'Other',
] as const;
