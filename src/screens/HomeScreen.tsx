import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {
  useAuth,
  useCanCreateVisitor,
  useCanReadVisitors,
} from '../auth/AuthContext';
import {
  CheckInButton,
  Icon,
  ImageSlider,
  SlidePanel,
  VisitorsFab,
} from '../components';
import {locale} from '../constants';
import {getUserImages} from '../services/userImageService';
import {colors, radius, spacing, typography} from '../theme';
import {UserImage} from '../types/user';
import {AddVisitorScreen} from './AddVisitorScreen';
import {VisitorsListScreen} from './VisitorsListScreen';

export function HomeScreen() {
  const {state, signOut} = useAuth();
  const canCreateVisitor = useCanCreateVisitor();
  const canReadVisitors = useCanReadVisitors();
  const insets = useSafeAreaInsets();
  const {width, height} = useWindowDimensions();

  const [showList, setShowList] = useState(false);
  const [addVisitorOpen, setAddVisitorOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [images, setImages] = useState<UserImage[]>([]);
  const [imagesLoading, setImagesLoading] = useState(true);
  const [imagesError, setImagesError] = useState<string | null>(null);

  const isLandscape = width > height;
  const panelWidthRatio = isLandscape ? 0.38 : 0.94;
  const checkInBottom = insets.bottom + (isLandscape ? 72 : 96);
  const sliderOverlayBottom = checkInBottom + (canCreateVisitor ? 88 : 0);

  useEffect(() => {
    let mounted = true;

    async function loadImages() {
      setImagesLoading(true);
      setImagesError(null);

      try {
        const galleryImages = await getUserImages();
        if (mounted) {
          setImages(galleryImages);
        }
      } catch (error) {
        if (mounted) {
          setImages([]);
          setImagesError(
            error instanceof Error
              ? error.message
              : locale.home.gallery.loadFailed,
          );
        }
      } finally {
        if (mounted) {
          setImagesLoading(false);
        }
      }
    }

    loadImages();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!toast) {
      return;
    }
    const timer = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(timer);
  }, [toast]);

  if (showList) {
    return <VisitorsListScreen onBack={() => setShowList(false)} />;
  }

  const displayName = state.userName ?? state.userEmail ?? 'User';

  const reloadImages = () => {
    setImagesLoading(true);
    setImagesError(null);
    getUserImages()
      .then(setImages)
      .catch(error =>
        setImagesError(
          error instanceof Error ? error.message : locale.home.gallery.loadFailed,
        ),
      )
      .finally(() => setImagesLoading(false));
  };

  return (
    <View style={styles.root} pointerEvents="box-none">
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        {imagesLoading ? (
          <View style={styles.loadingState}>
            <ActivityIndicator color={colors.primaryLight} size="large" />
            <Text style={styles.loadingText}>{locale.home.gallery.loading}</Text>
          </View>
        ) : imagesError ? (
          <View style={styles.loadingState}>
            <Text style={styles.errorText}>{imagesError}</Text>
            <Pressable onPress={reloadImages} style={styles.retry}>
              <Text style={styles.retryText}>Retry</Text>
            </Pressable>
          </View>
        ) : (
          <ImageSlider
            images={images}
            overlayBottomInset={sliderOverlayBottom}
          />
        )}
      </View>

      <View
        style={[styles.topBar, {paddingTop: insets.top + spacing.sm}]}
        pointerEvents="box-none"
      >
        <View style={styles.welcomeBlock}>
          <Text style={styles.welcomeEyebrow}>Welcome</Text>
          <Text style={styles.welcomeName} numberOfLines={1}>
            {displayName}
          </Text>
        </View>
        <Pressable
          onPress={signOut}
          style={({pressed}) => [styles.signOut, pressed && {opacity: 0.88}]}
          accessibilityRole="button"
          accessibilityLabel={locale.home.actions.signOut}
        >
          <Icon name="logOut" size={16} color={colors.textPrimary} />
          <Text style={styles.signOutText}>{locale.home.actions.signOut}</Text>
        </Pressable>
      </View>

      {toast ? (
        <View style={[styles.toast, {top: insets.top + 64}]}>
          <Text style={styles.toastText}>{toast}</Text>
        </View>
      ) : null}

      {canReadVisitors ? (
        <View
          style={[styles.fab, {bottom: checkInBottom, left: spacing.lg}]}
          pointerEvents="box-none"
        >
          <VisitorsFab onPress={() => setShowList(true)} />
        </View>
      ) : null}

      {canCreateVisitor ? (
        <View
          style={[
            styles.checkInWrap,
            {
              bottom: checkInBottom,
              opacity: addVisitorOpen ? 0 : 1,
            },
          ]}
          pointerEvents={addVisitorOpen ? 'none' : 'auto'}
        >
          <CheckInButton
            label={locale.home.actions.checkIn}
            onPress={() => setAddVisitorOpen(true)}
          />
        </View>
      ) : null}

      <SlidePanel
        visible={addVisitorOpen}
        onDismiss={() => setAddVisitorOpen(false)}
        widthRatio={panelWidthRatio}
      >
        <AddVisitorScreen
          variant="panel"
          onBack={() => setAddVisitorOpen(false)}
          onSuccess={() => {
            setAddVisitorOpen(false);
            setToast(locale.home.addVisitor.success);
          }}
        />
      </SlidePanel>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.backgroundElevated,
  },
  loadingText: {
    color: colors.textSecondary,
  },
  errorText: {
    color: colors.danger,
    textAlign: 'center',
    fontWeight: '600',
    paddingHorizontal: spacing.xl,
  },
  retry: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.lg,
    backgroundColor: colors.primary,
  },
  retryText: {
    color: colors.textPrimary,
    fontWeight: '700',
  },
  topBar: {
    position: 'absolute',
    left: spacing.lg,
    right: spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: spacing.md,
    zIndex: 10,
  },
  welcomeBlock: {
    flex: 1,
    gap: 2,
    paddingTop: 4,
  },
  welcomeEyebrow: {
    ...typography.overline,
    color: colors.primaryLight,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: {width: 0, height: 1},
    textShadowRadius: 4,
  },
  welcomeName: {
    ...typography.headline,
    color: colors.textPrimary,
    fontSize: 24,
    textShadowColor: 'rgba(0,0,0,0.55)',
    textShadowOffset: {width: 0, height: 1},
    textShadowRadius: 6,
  },
  signOut: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    backgroundColor: colors.scrim,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
  },
  signOutText: {
    color: colors.textPrimary,
    fontWeight: '700',
    fontSize: 13,
  },
  toast: {
    position: 'absolute',
    alignSelf: 'center',
    zIndex: 40,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    backgroundColor: colors.successSoft,
    borderWidth: 1,
    borderColor: 'rgba(34,197,94,0.35)',
  },
  toastText: {
    color: '#bbf7d0',
    fontWeight: '600',
  },
  fab: {
    position: 'absolute',
    zIndex: 35,
    elevation: 35,
  },
  checkInWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 25,
  },
});
