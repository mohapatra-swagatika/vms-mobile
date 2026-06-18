import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';

import {Icon} from './Icon';
import {colors, spacing, typography} from '../theme';

type Props = {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  backLabel?: string;
  rightSlot?: React.ReactNode;
};

export function ScreenHeader({
  title,
  subtitle,
  onBack,
  backLabel = 'Back',
  rightSlot,
}: Props) {
  return (
    <View style={styles.root}>
      {onBack ? (
        <Pressable
          onPress={onBack}
          accessibilityRole="button"
          accessibilityLabel={backLabel}
          style={({pressed}) => [styles.backButton, pressed && styles.pressed]}
        >
          <Icon name="arrowLeft" size={18} color={colors.primaryLight} />
          <Text style={styles.backText}>{backLabel}</Text>
        </Pressable>
      ) : (
        <View style={styles.backSpacer} />
      )}

      <View style={styles.titles}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>

      {rightSlot ? <View style={styles.right}>{rightSlot}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    marginBottom: spacing.lg,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
    marginBottom: spacing.md,
    paddingVertical: 4,
  },
  backSpacer: {
    height: 8,
  },
  pressed: {
    opacity: 0.8,
  },
  backText: {
    color: colors.primaryLight,
    fontWeight: '700',
    fontSize: 15,
  },
  titles: {
    gap: 4,
  },
  title: {
    ...typography.title,
    color: colors.textPrimary,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 15,
    lineHeight: 22,
  },
  right: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
});
