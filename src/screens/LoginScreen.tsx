import React, {useMemo, useState} from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {locale} from '../constants';
import {Button, Card, Icon, TextField} from '../components';
import {colors, radius, spacing} from '../theme';
import {useAuth} from '../auth/AuthContext';
import {
  LoginFormErrors,
  validateEmail,
  validateLoginForm,
  validatePassword,
} from '../utils/validation';

export function LoginScreen() {
  const {signIn} = useAuth();
  const insets = useSafeAreaInsets();
  const {width} = useWindowDimensions();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<LoginFormErrors>({});
  const [touched, setTouched] = useState({email: false, password: false});

  const isTabletLike = width >= 768;
  const maxCardWidth = isTabletLike ? 520 : 440;

  const canSubmit = useMemo(() => {
    return email.trim().length > 0 && password.length > 0 && !submitting;
  }, [email, password, submitting]);

  const onEmailChange = (value: string) => {
    setEmail(value);
    setFormError(null);
    if (touched.email) {
      setFieldErrors(prev => ({...prev, email: validateEmail(value)}));
    }
  };

  const onPasswordChange = (value: string) => {
    setPassword(value);
    setFormError(null);
    if (touched.password) {
      setFieldErrors(prev => ({...prev, password: validatePassword(value)}));
    }
  };

  const onSubmit = async () => {
    const errors = validateLoginForm(email, password);
    setTouched({email: true, password: true});
    setFieldErrors(errors);
    setFormError(null);

    if (errors.email || errors.password) {
      return;
    }

    if (!canSubmit) {
      return;
    }

    setSubmitting(true);
    try {
      await signIn(email, password);
    } catch (e) {
      const message =
        e instanceof Error ? e.message : locale.login.errors.loginFailed;
      setFormError(message);
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[
        styles.root,
        {paddingTop: insets.top + 16, paddingBottom: insets.bottom + 16},
      ]}
      behavior={Platform.select({ios: 'padding', android: undefined})}
    >
      <View style={styles.center}>
        <Card
          fullWidth
          style={[styles.card, {maxWidth: maxCardWidth}]}
        >
          <Text style={styles.title}>{locale.login.screen.title}</Text>
          <Text style={styles.subtitle}>{locale.login.screen.subtitle}</Text>

          <TextField
            label={locale.login.form.email.label}
            value={email}
            onChangeText={onEmailChange}
            onBlur={() => {
              setTouched(prev => ({...prev, email: true}));
              setFieldErrors(prev => ({...prev, email: validateEmail(email)}));
            }}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            textContentType="username"
            placeholder={locale.login.form.email.placeholder}
            returnKeyType="next"
            editable={!submitting}
            accessibilityLabel={locale.login.form.email.label}
            error={touched.email ? fieldErrors.email : undefined}
            containerStyle={styles.field}
          />

          <View style={styles.field}>
            <Text style={styles.label}>{locale.login.form.password.label}</Text>
            <View style={styles.passwordField}>
              <TextInput
                value={password}
                onChangeText={onPasswordChange}
                onBlur={() => {
                  setTouched(prev => ({...prev, password: true}));
                  setFieldErrors(prev => ({
                    ...prev,
                    password: validatePassword(password),
                  }));
                }}
                secureTextEntry={!passwordVisible}
                textContentType="password"
                placeholder={locale.login.form.password.placeholder}
                placeholderTextColor={colors.textTertiary}
                returnKeyType="done"
                style={[
                  styles.input,
                  styles.passwordInput,
                  touched.password && fieldErrors.password
                    ? styles.inputError
                    : null,
                ]}
                editable={!submitting}
                onSubmitEditing={onSubmit}
                accessibilityLabel={locale.login.form.password.label}
              />
              <Pressable
                onPress={() => setPasswordVisible(v => !v)}
                disabled={submitting}
                accessibilityRole="button"
                accessibilityLabel={
                  passwordVisible
                    ? locale.login.accessibility.hidePassword
                    : locale.login.accessibility.showPassword
                }
                hitSlop={10}
                style={({pressed}) => [
                  styles.passwordEyeButton,
                  pressed && !submitting ? styles.passwordEyeButtonPressed : null,
                  submitting ? styles.passwordEyeButtonDisabled : null,
                ]}
              >
                <Icon
                  name={passwordVisible ? 'eyeOff' : 'eye'}
                  size={20}
                  color={colors.white90}
                />
              </Pressable>
            </View>
            {touched.password && fieldErrors.password ? (
              <Text style={styles.fieldError}>{fieldErrors.password}</Text>
            ) : null}
          </View>

          {formError ? <Text style={styles.formError}>{formError}</Text> : null}

          <Button
            label={locale.login.actions.signIn}
            onPress={onSubmit}
            disabled={!canSubmit}
            loading={submitting}
            style={styles.primaryButton}
            accessibilityLabel={locale.login.actions.signIn}
          />
        </Card>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.md,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {},
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  subtitle: {
    marginTop: spacing.xs,
    color: colors.textSecondary,
  },
  field: {
    marginTop: 0,
  },
  label: {
    marginBottom: 8,
    color: colors.white82,
    fontWeight: '600',
  },
  input: {
    height: 48,
    borderRadius: radius.md,
    paddingHorizontal: 12,
    backgroundColor: colors.overlay,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.borderStrong,
    color: colors.textPrimary,
  },
  inputError: {
    borderColor: colors.danger,
  },
  passwordField: {
    position: 'relative',
    justifyContent: 'center',
  },
  passwordInput: {
    paddingRight: 44,
  },
  passwordEyeButton: {
    position: 'absolute',
    right: 8,
    height: 36,
    width: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.overlay,
  },
  passwordEyeButtonPressed: {
    opacity: 0.85,
  },
  passwordEyeButtonDisabled: {
    opacity: 0.6,
  },
  fieldError: {
    marginTop: 6,
    color: colors.danger,
    fontSize: 13,
    fontWeight: '500',
  },
  formError: {
    marginTop: 12,
    color: colors.danger,
    fontWeight: '600',
  },
  primaryButton: {
    marginTop: spacing.md,
  },
});
