import React, {useState} from 'react';
import {StyleSheet, Text, TextInput, TextInputProps, View} from 'react-native';

import {colors, radius, typography} from '../theme';

type Props = {
  label: string;
  error?: string;
  hint?: string;
  containerStyle?: object;
  variant?: 'default' | 'onPrimary';
} & TextInputProps;

export function TextField({
  label,
  error,
  hint,
  containerStyle,
  variant = 'default',
  style,
  onFocus,
  onBlur,
  ...inputProps
}: Props) {
  const [focused, setFocused] = useState(false);
  const isPrimary = variant === 'onPrimary';

  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={[styles.label, isPrimary && styles.labelOnPrimary]}>
        {label}
      </Text>
      <TextInput
        {...inputProps}
        onFocus={event => {
          setFocused(true);
          onFocus?.(event);
        }}
        onBlur={event => {
          setFocused(false);
          onBlur?.(event);
        }}
        style={[
          styles.input,
          isPrimary && styles.inputOnPrimary,
          focused ? (isPrimary ? styles.inputFocusedOnPrimary : styles.inputFocused) : null,
          error ? styles.inputError : null,
          style,
        ]}
        placeholderTextColor={
          isPrimary ? 'rgba(255,255,255,0.45)' : colors.textTertiary
        }
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {!error && hint ? <Text style={styles.hint}>{hint}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 14,
  },
  label: {
    marginBottom: 8,
    color: colors.textSecondary,
    ...typography.caption,
    textTransform: 'none',
    letterSpacing: 0.2,
    fontWeight: '600',
  },
  input: {
    height: 52,
    borderRadius: radius.md,
    paddingHorizontal: 14,
    backgroundColor: colors.overlay,
    borderWidth: 1,
    borderColor: colors.border,
    color: colors.textPrimary,
    fontSize: 16,
  },
  inputFocused: {
    borderColor: colors.borderFocus,
    backgroundColor: colors.overlayStrong,
  },
  labelOnPrimary: {
    color: 'rgba(255,255,255,0.88)',
  },
  inputOnPrimary: {
    backgroundColor: colors.primaryLight,
    borderColor: 'rgba(255,255,255,0.2)',
    color: colors.textPrimary,
  },
  inputFocusedOnPrimary: {
    borderColor: 'rgba(255,255,255,0.55)',
    backgroundColor: '#4d8fff',
  },
  inputError: {
    borderColor: colors.danger,
  },
  error: {
    marginTop: 6,
    color: colors.danger,
    fontSize: 13,
    fontWeight: '500',
  },
  hint: {
    marginTop: 6,
    color: colors.textTertiary,
    fontSize: 12,
  },
});
