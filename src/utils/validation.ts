import {strings} from '../constants';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type LoginFormErrors = {
  email?: string;
  password?: string;
};

export function validateEmail(value: string): string | undefined {
  const trimmed = value.trim();
  if (!trimmed) {
    return strings.auth.emailRequired;
  }
  if (!EMAIL_PATTERN.test(trimmed)) {
    return strings.auth.invalidEmail;
  }
  return undefined;
}

export function validatePassword(value: string): string | undefined {
  if (!value) {
    return strings.auth.passwordRequired;
  }
  if (value.length < 6) {
    return strings.auth.invalidPassword;
  }
  return undefined;
}

export function validateLoginForm(
  email: string,
  password: string,
): LoginFormErrors {
  const errors: LoginFormErrors = {};
  const emailError = validateEmail(email);
  const passwordError = validatePassword(password);

  if (emailError) {
    errors.email = emailError;
  }
  if (passwordError) {
    errors.password = passwordError;
  }

  return errors;
}
