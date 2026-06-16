import React from 'react';
import {StyleSheet, Text, TextInput, TextInputProps, View} from 'react-native';

import {colors, radius} from '../theme';

type Props = {
  label: string;
  error?: string;
  containerStyle?: object;
} & TextInputProps;

export function TextField({
  label,
  error,
  containerStyle,
  style,
  ...inputProps
}: Props) {
  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        {...inputProps}
        style={[styles.input, error ? styles.inputError : null, style]}
        placeholderTextColor={colors.textTertiary}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
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
  error: {
    marginTop: 6,
    color: colors.danger,
    fontSize: 13,
    fontWeight: '500',
  },
});

