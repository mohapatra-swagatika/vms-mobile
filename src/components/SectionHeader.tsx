import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

import {colors, typography} from '../theme';

type Props = {
  title: string;
};

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) {
    return '?';
  }
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}

function hashColor(name: string): string {
  const palette = ['#0057FF', '#3F80FF', '#22d3ee', '#8b5cf6', '#22c55e'];
  let hash = 0;
  for (let i = 0; i < name.length; i += 1) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return palette[Math.abs(hash) % palette.length];
}

export function AvatarInitials({name, size = 48}: {name: string; size?: number}) {
  const color = hashColor(name);
  const fontSize = Math.round(size * 0.36);

  return (
    <View
      style={[
        styles.root,
        {
          width: size,
          height: size,
          borderRadius: size * 0.32,
          backgroundColor: `${color}33`,
          borderColor: `${color}66`,
        },
      ]}
    >
      <Text style={[styles.text, {color, fontSize}]}>{getInitials(name)}</Text>
    </View>
  );
}

export function SectionHeader({title}: Props) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.line} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  text: {
    fontWeight: '800',
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 8,
    marginBottom: 4,
  },
  sectionTitle: {
    ...typography.overline,
    color: colors.primaryLight,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
});
