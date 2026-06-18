import React from 'react';
import {StyleSheet, View, ViewProps} from 'react-native';

import {colors} from '../theme';

export function ScreenBackground({style, children, ...props}: ViewProps) {
  return (
    <View style={[styles.root, style]} {...props}>
      <View style={styles.baseFill} />
      <View style={styles.glowTopRight} />
      <View style={styles.glowBottomLeft} />
      <View style={styles.gridLine} />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  baseFill: {
    ...StyleSheet.absoluteFill,
    backgroundColor: colors.background,
  },
  glowTopRight: {
    position: 'absolute',
    top: -120,
    right: -80,
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: colors.primary,
    opacity: 0.14,
  },
  glowBottomLeft: {
    position: 'absolute',
    bottom: -100,
    left: -60,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: colors.accent,
    opacity: 0.08,
  },
  gridLine: {
    position: 'absolute',
    top: 0,
    left: 24,
    right: 24,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
});
