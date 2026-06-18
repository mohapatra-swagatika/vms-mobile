import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  ViewStyle,
} from 'react-native';

import {colors, radius, shadows, typography} from '../theme';

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';

type Props = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: Variant;
  size?: 'md' | 'lg';
  style?: ViewStyle;
  accessibilityLabel?: string;
};

export function Button({
  label,
  onPress,
  disabled,
  loading,
  variant = 'primary',
  size = 'md',
  style,
  accessibilityLabel,
}: Props) {
  const isDisabled = Boolean(disabled || loading);

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      style={({pressed}) => [
        styles.base,
        size === 'lg' ? styles.lg : styles.md,
        variantStyles[variant],
        isDisabled ? styles.disabled : null,
        pressed && !isDisabled ? styles.pressed : null,
        variant === 'primary' && !isDisabled ? shadows.md : null,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'outline' || variant === 'ghost' ? colors.primary : colors.textPrimary}
        />
      ) : (
        <Text style={[styles.label, labelStyles[variant]]}>{label}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'transparent',
  },
  md: {
    height: 50,
    paddingHorizontal: 18,
  },
  lg: {
    height: 56,
    paddingHorizontal: 22,
  },
  pressed: {
    opacity: 0.92,
    transform: [{scale: 0.985}],
  },
  disabled: {
    opacity: 0.55,
  },
  label: {
    ...typography.bodyStrong,
    color: colors.textPrimary,
  },
});

const variantStyles = StyleSheet.create({
  primary: {
    backgroundColor: colors.primary,
    borderColor: colors.primaryLight,
  },
  secondary: {
    backgroundColor: colors.surfaceElevated,
    borderColor: colors.borderStrong,
  },
  outline: {
    backgroundColor: 'transparent',
    borderColor: colors.borderStrong,
  },
  ghost: {
    backgroundColor: colors.overlay,
    borderColor: 'transparent',
  },
  danger: {
    backgroundColor: colors.dangerSoft,
    borderColor: 'rgba(255,107,107,0.35)',
  },
});

const labelStyles = StyleSheet.create({
  primary: {color: colors.textPrimary},
  secondary: {color: colors.textPrimary},
  outline: {color: colors.primaryLight},
  ghost: {color: colors.textSecondary},
  danger: {color: colors.danger},
});
