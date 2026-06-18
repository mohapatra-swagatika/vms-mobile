import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';

import {Icon} from './Icon';
import {colors, shadows, spacing} from '../theme';

type Props = {
  onPress: () => void;
  disabled?: boolean;
};

export function VisitorsFab({onPress, disabled}: Props) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      hitSlop={12}
      accessibilityRole="button"
      accessibilityLabel="View visitors list"
      style={({pressed}) => [
        styles.root,
        shadows.lg,
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed,
      ]}
    >
      <View style={styles.iconRing}>
        <Icon name="users" size={26} color={colors.primaryLight} />
      </View>
      <Text style={styles.caption}>Visitors</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    gap: 6,
  },
  pressed: {
    opacity: 0.9,
    transform: [{scale: 0.96}],
  },
  disabled: {
    opacity: 0.45,
  },
  iconRing: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.surfaceElevated,
    borderWidth: 2,
    borderColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
  },
  caption: {
    color: colors.textPrimary,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});
