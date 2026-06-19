import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

import {locale} from '../constants';
import {colors, radius, spacing} from '../theme';
import {VisitorStatus} from '../types/visitor';

type Props = {
  status: VisitorStatus;
};

const STATUS_COLORS: Record<VisitorStatus, string> = {
  pending: colors.warning,
  approved: colors.success,
  rejected: colors.danger,
  checked_in: colors.primaryLight,
  checked_out: colors.textTertiary,
};

export function StatusBadge({status}: Props) {
  const color = STATUS_COLORS[status];

  return (
    <View style={[styles.badge, {backgroundColor: `${color}20`, borderColor: `${color}44`}]}>
      <View style={[styles.dot, {backgroundColor: color}]} />
      <Text style={[styles.text, {color}]}>{locale.visitors.status[status]}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  text: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
});
