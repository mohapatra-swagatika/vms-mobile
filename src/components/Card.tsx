import React from 'react';
import {StyleSheet, View, ViewProps} from 'react-native';

import {colors, radius} from '../theme';

type Props = ViewProps & {
  fullWidth?: boolean;
};

export function Card({style, fullWidth, ...props}: Props) {
  return (
    <View
      {...props}
      style={[styles.base, fullWidth ? styles.fullWidth : null, style]}
    />
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: 20,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  fullWidth: {
    width: '100%',
  },
});

