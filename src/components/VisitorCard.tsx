import React from 'react';
import {Image, Pressable, StyleSheet, Text, View} from 'react-native';

import {locale} from '../constants';
import {resolveMediaUrl} from '../utils/media';
import {colors, radius, shadows, spacing, typography} from '../theme';
import {Visitor} from '../types/visitor';
import {AvatarInitials} from './SectionHeader';
import {Button} from './Button';
import {Icon} from './Icon';
import {StatusBadge} from './StatusBadge';

type Props = {
  visitor: Visitor;
  busy?: boolean;
  showCheckIn?: boolean;
  showCheckOut?: boolean;
  onCheckIn?: () => void;
  onCheckOut?: () => void;
};

function formatWhen(value: string | null): string {
  if (!value) {
    return 'Not yet';
  }
  return new Date(value).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function VisitorCard({
  visitor,
  busy,
  showCheckIn,
  showCheckOut,
  onCheckIn,
  onCheckOut,
}: Props) {
  const photoUri = resolveMediaUrl(visitor.photo_url);

  return (
    <View style={[styles.card, shadows.sm]}>
      <View style={styles.header}>
        {photoUri ? (
          <Image source={{uri: photoUri}} style={styles.avatar} />
        ) : (
          <AvatarInitials name={visitor.name} size={52} />
        )}
        <View style={styles.headerCopy}>
          <Text style={styles.name}>{visitor.name}</Text>
          {visitor.purpose ? (
            <Text style={styles.purpose}>{visitor.purpose}</Text>
          ) : null}
        </View>
        <StatusBadge status={visitor.status} />
      </View>

      <View style={styles.metaGrid}>
        {visitor.host_name ? (
          <MetaRow icon="user" label="Host" value={visitor.host_name} />
        ) : null}
        {visitor.phone ? (
          <MetaRow icon="phone" label="Phone" value={visitor.phone} />
        ) : null}
        <MetaRow icon="clock" label="Check-in" value={formatWhen(visitor.check_in_at)} />
        <MetaRow icon="clock" label="Check-out" value={formatWhen(visitor.check_out_at)} />
      </View>

      {showCheckIn || showCheckOut ? (
        <View style={styles.actions}>
          {showCheckIn ? (
            <Button
              label={locale.visitors.checkIn}
              onPress={onCheckIn ?? (() => {})}
              loading={busy}
              disabled={busy}
              variant="primary"
              style={styles.actionBtn}
            />
          ) : null}
          {showCheckOut ? (
            <Button
              label={locale.visitors.checkOut}
              onPress={onCheckOut ?? (() => {})}
              loading={busy}
              disabled={busy}
              variant="danger"
              style={styles.actionBtn}
            />
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

function MetaRow({
  icon,
  label,
  value,
}: {
  icon: 'user' | 'phone' | 'clock';
  label: string;
  value: string;
}) {
  return (
    <View style={styles.metaRow}>
      <Icon name={icon} size={14} color={colors.textTertiary} />
      <Text style={styles.metaLabel}>{label}</Text>
      <Text style={styles.metaValue} numberOfLines={1}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: radius.xl,
    padding: spacing.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.borderStrong,
    marginBottom: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.overlay,
    borderWidth: 2,
    borderColor: colors.borderStrong,
  },
  headerCopy: {
    flex: 1,
    gap: 2,
  },
  name: {
    ...typography.headline,
    color: colors.textPrimary,
  },
  purpose: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  metaGrid: {
    gap: 10,
    paddingTop: 4,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  metaLabel: {
    width: 72,
    color: colors.textTertiary,
    fontSize: 12,
    fontWeight: '600',
  },
  metaValue: {
    flex: 1,
    color: colors.textSecondary,
    fontSize: 13,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  actionBtn: {
    flex: 1,
  },
});
