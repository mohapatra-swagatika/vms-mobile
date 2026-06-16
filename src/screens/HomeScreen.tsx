import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {ImageSlider} from '../components';
import {strings} from '../constants';
import {getUserImages} from '../services/userImageService';
import {colors, radius, spacing} from '../theme';
import {UserImage} from '../types/user';
import {useAuth} from '../auth/AuthContext';

export function HomeScreen() {
  const {state, signOut} = useAuth();
  const insets = useSafeAreaInsets();
  const [images, setImages] = useState<UserImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadImages() {
      if (!state.accessToken) {
        setImages([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const userImages = await getUserImages(state.accessToken);
        if (mounted) {
          setImages(userImages);
        }
      } catch (e) {
        if (mounted) {
          const message =
            e instanceof Error ? e.message : strings.home.loadImagesFailed;
          setError(message);
          setImages([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadImages();

    return () => {
      mounted = false;
    };
  }, [state.accessToken]);

  return (
    <View style={styles.root}>
      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator color={colors.primary} size="large" />
          <Text style={styles.loadingText}>{strings.home.loadingImages}</Text>
        </View>
      ) : error ? (
        <View style={styles.centered}>
          <Text style={styles.errorText}>{error}</Text>
          <Pressable
            onPress={signOut}
            style={({pressed}) => [styles.signOutButton, pressed && {opacity: 0.9}]}
            accessibilityRole="button"
            accessibilityLabel={strings.home.signOut}
          >
            <Text style={styles.signOutText}>{strings.home.signOut}</Text>
          </Pressable>
        </View>
      ) : (
        <>
          <ImageSlider images={images} />
          <Pressable
            onPress={signOut}
            style={({pressed}) => [
              styles.signOutFloating,
              {top: insets.top + spacing.sm},
              pressed && {opacity: 0.9},
            ]}
            accessibilityRole="button"
            accessibilityLabel={strings.home.signOut}
          >
            <Text style={styles.signOutText}>{strings.home.signOut}</Text>
          </Pressable>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  loadingText: {
    marginTop: spacing.md,
    color: colors.textSecondary,
  },
  errorText: {
    color: colors.danger,
    textAlign: 'center',
    marginBottom: spacing.lg,
    fontWeight: '600',
  },
  signOutFloating: {
    position: 'absolute',
    right: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  signOutButton: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    backgroundColor: colors.border,
  },
  signOutText: {
    color: colors.textPrimary,
    fontWeight: '700',
  },
});
