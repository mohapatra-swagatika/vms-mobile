import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';

import {Icon} from './Icon';
import {IconSpec, icons} from '../constants/icons';
import {colors, radius, shadows, spacing, typography} from '../theme';

type Props = {
  title: string;
  subtitle: string;
  icon: keyof typeof icons;
  accentColor?: string;
  onPress: () => void;
};

export function ActionTile({
  title,
  subtitle,
  icon,
  accentColor = colors.primary,
  onPress,
}: Props) {
  const spec: IconSpec = icons[icon];

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={title}
      style={({pressed}) => [styles.root, shadows.md, pressed && styles.pressed]}
    >
      <View style={[styles.accentBar, {backgroundColor: accentColor}]} />
      <View style={[styles.iconWrap, {backgroundColor: `${accentColor}22`}]}>
        <Icon icon={spec} size={22} color={accentColor} />
      </View>
      <View style={styles.copy}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
      <Text style={[styles.chevron, {color: accentColor}]}>›</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceElevated,
    borderRadius: radius.xl,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.borderStrong,
    padding: spacing.md,
    gap: spacing.md,
    overflow: 'hidden',
  },
  pressed: {
    opacity: 0.94,
    transform: [{scale: 0.99}],
  },
  accentBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 4,
  },
  copy: {
    flex: 1,
    gap: 4,
  },
  title: {
    ...typography.headline,
    color: colors.textPrimary,
    fontSize: 18,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 18,
  },
  chevron: {
    fontSize: 28,
    fontWeight: '300',
    marginRight: 4,
  },
});
