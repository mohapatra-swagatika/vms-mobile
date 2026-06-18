import React from 'react';
import {StyleSheet, View, ViewProps} from 'react-native';

import {colors} from '../theme';

type Props = ViewProps & {
  variant?: 'default' | 'elevated' | 'glass';
};

export function Card({style, variant = 'default', ...props}: Props) {
  return (
    <View
      {...props}
      style={[
        styles.base,
        variant === 'elevated' ? styles.elevated : null,
        variant === 'glass' ? styles.glass : null,
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 20,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  elevated: {
    backgroundColor: colors.surfaceElevated,
    borderColor: colors.borderStrong,
  },
  glass: {
    backgroundColor: colors.surfaceGlass,
    borderColor: 'rgba(255,255,255,0.12)',
  },
});
