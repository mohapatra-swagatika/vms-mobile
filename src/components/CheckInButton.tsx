import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';

import {colors, shadows, spacing} from '../theme';

type Props = {
  onPress: () => void;
  visible?: boolean;
  label?: string;
};

export function CheckInButton({
  onPress,
  visible = true,
  label = 'CHECK-IN',
}: Props) {
  if (!visible) {
    return null;
  }

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({pressed}) => [styles.wrap, pressed && styles.pressed]}
    >
      <View style={styles.gradientLayerLeft} />
      <View style={styles.gradientLayerCenter} />
      <View style={styles.gradientLayerRight} />
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    minWidth: 220,
    height: 60,
    borderRadius: 4,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.lg,
  },
  pressed: {
    opacity: 0.92,
    transform: [{scale: 0.98}],
  },
  gradientLayerLeft: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  gradientLayerCenter: {
    position: 'absolute',
    left: '20%',
    right: '20%',
    top: 0,
    bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.82)',
  },
  gradientLayerRight: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  label: {
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: 2,
    color: '#4a6278',
    zIndex: 1,
  },
});
