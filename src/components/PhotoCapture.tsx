import React from 'react';
import {Image, Pressable, StyleSheet, Text, View} from 'react-native';

import {Icon} from './Icon';
import {colors, radius, spacing, typography} from '../theme';

type Props = {
  photoUri: string | null;
  error?: string;
  onCapture: () => void;
  onRetake: () => void;
};

export function PhotoCapture({photoUri, error, onCapture, onRetake}: Props) {
  return (
    <View style={styles.root}>
      <View style={[styles.frame, error ? styles.frameError : null]}>
        {photoUri ? (
          <Image source={{uri: photoUri}} style={styles.image} resizeMode="cover" />
        ) : (
          <View style={styles.placeholder}>
            <View style={styles.iconCircle}>
              <Icon name="camera" size={32} color={colors.textPrimary} />
            </View>
            <Text style={styles.placeholderTitle}>Visitor photo</Text>
            <Text style={styles.placeholderCopy}>
              Position face in the frame and tap capture
            </Text>
          </View>
        )}
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Pressable
        onPress={photoUri ? onRetake : onCapture}
        style={({pressed}) => [styles.button, pressed && {opacity: 0.9}]}
      >
        <Icon name="camera" size={18} color={colors.primary} />
        <Text style={styles.buttonText}>
          {photoUri ? 'Retake photo' : 'Capture photo'}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    gap: spacing.md,
    marginTop: spacing.sm,
  },
  frame: {
    height: 220,
    borderRadius: radius.xl,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.25)',
    backgroundColor: 'rgba(0,0,0,0.15)',
  },
  frameError: {
    borderColor: colors.danger,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255,255,255,0.14)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  placeholderTitle: {
    ...typography.headline,
    color: colors.textPrimary,
    fontSize: 18,
  },
  placeholderCopy: {
    color: 'rgba(255,255,255,0.75)',
    textAlign: 'center',
    fontSize: 13,
    lineHeight: 18,
  },
  error: {
    color: '#ffd0d0',
    fontWeight: '600',
    textAlign: 'center',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 50,
    borderRadius: radius.lg,
    backgroundColor: colors.textPrimary,
  },
  buttonText: {
    color: colors.primary,
    fontWeight: '800',
    fontSize: 15,
  },
});
