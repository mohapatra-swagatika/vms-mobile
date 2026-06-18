import React from 'react';
import {StyleSheet, View} from 'react-native';

import {colors, spacing} from '../theme';

type Props = {
  total: number;
  activeIndex: number;
};

export function WizardDots({total, activeIndex}: Props) {
  return (
    <View style={styles.row}>
      {Array.from({length: total}).map((_, index) => (
        <View
          key={index}
          style={[
            styles.dot,
            index === activeIndex ? styles.dotActive : null,
            index < activeIndex ? styles.dotDone : null,
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(255,255,255,0.28)',
  },
  dotActive: {
    width: 24,
    backgroundColor: colors.textPrimary,
  },
  dotDone: {
    backgroundColor: 'rgba(255,255,255,0.72)',
  },
});
