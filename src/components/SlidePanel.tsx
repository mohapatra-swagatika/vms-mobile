import React, {useEffect, useRef, useState} from 'react';
import {
  Animated,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {colors, shadows} from '../theme';

type Props = {
  visible: boolean;
  onDismiss: () => void;
  children: React.ReactNode;
  widthRatio?: number;
};

export function SlidePanel({
  visible,
  onDismiss,
  children,
  widthRatio = 0.38,
}: Props) {
  const {width} = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const panelWidth = Math.min(width * widthRatio, 520);
  const slideX = useRef(new Animated.Value(panelWidth)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const [mounted, setMounted] = useState(visible);

  useEffect(() => {
    if (visible) {
      setMounted(true);
    }

    Animated.parallel([
      Animated.timing(slideX, {
        toValue: visible ? 0 : panelWidth,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(backdropOpacity, {
        toValue: visible ? 1 : 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(({finished}) => {
      if (finished && !visible) {
        setMounted(false);
      }
    });
  }, [visible, panelWidth, slideX, backdropOpacity]);

  if (!mounted) {
    return null;
  }

  return (
    <>
      <Animated.View
        style={[
          styles.backdrop,
          {
            opacity: backdropOpacity,
          },
        ]}
      >
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={onDismiss}
          accessibilityRole="button"
          accessibilityLabel="Close check-in panel"
        />
      </Animated.View>
      <Animated.View
        style={[
          styles.panel,
          shadows.lg,
          {
            width: panelWidth,
            paddingTop: insets.top,
            paddingBottom: insets.bottom,
            transform: [{translateX: slideX}],
          },
        ]}
      >
        <View style={styles.panelInner}>{children}</View>
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.28)',
    zIndex: 20,
  },
  panel: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.primary,
    zIndex: 30,
  },
  panelInner: {
    flex: 1,
  },
});
