import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  FlatList,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';

import {config} from '../constants/config';
import {locale} from '../constants';
import {colors, spacing, typography} from '../theme';
import {UserImage} from '../types/user';

type LoopSlide = UserImage & {loopKey: string};

const LOOP_COPIES = 3;

function buildLoopSlides(images: UserImage[]): LoopSlide[] {
  if (images.length <= 1) {
    return images.map(image => ({...image, loopKey: image.id}));
  }

  return Array.from({length: LOOP_COPIES}, (_, copy) =>
    images.map((image, index) => ({
      ...image,
      loopKey: `${image.id}-${copy}-${index}`,
    })),
  ).flat();
}

type Props = {
  images: UserImage[];
  autoPlayMs?: number;
  height?: number;
  overlayBottomInset?: number;
};

export function ImageSlider({
  images,
  autoPlayMs = config.imageSliderAutoPlayMs,
  height: heightProp,
  overlayBottomInset = spacing.lg,
}: Props) {
  const {width, height: windowHeight} = useWindowDimensions();
  const listRef = useRef<FlatList<LoopSlide>>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const isUserScrolling = useRef(false);
  const virtualIndexRef = useRef(0);

  const slideWidth = width;
  const slideHeight = heightProp ?? windowHeight;
  const loopSlides = useMemo(() => buildLoopSlides(images), [images]);
  const isLooping = images.length > 1;
  const middleStart = images.length;

  const normalizeVirtualIndex = useCallback(
    (index: number): number => {
      if (!isLooping) {
        return index;
      }

      if (index >= images.length * 2) {
        return index - images.length;
      }

      if (index < images.length) {
        return index + images.length;
      }

      return index;
    },
    [images.length, isLooping],
  );

  const scrollToVirtualIndex = useCallback(
    (index: number, animated: boolean) => {
      listRef.current?.scrollToOffset({
        offset: index * slideWidth,
        animated,
      });
    },
    [slideWidth],
  );

  const syncLoopPosition = useCallback(
    (index: number) => {
      const normalized = normalizeVirtualIndex(index);
      if (normalized !== index) {
        scrollToVirtualIndex(normalized, false);
      }
      virtualIndexRef.current = normalized;
      setActiveIndex(normalized % images.length);
      return normalized;
    },
    [images.length, normalizeVirtualIndex, scrollToVirtualIndex],
  );

  useEffect(() => {
    if (!isLooping) {
      virtualIndexRef.current = 0;
      setActiveIndex(0);
      return;
    }

    virtualIndexRef.current = middleStart;
    setActiveIndex(0);
    requestAnimationFrame(() => {
      scrollToVirtualIndex(middleStart, false);
    });
  }, [isLooping, middleStart, scrollToVirtualIndex, loopSlides]);

  useEffect(() => {
    if (!isLooping) {
      return;
    }

    const timer = setInterval(() => {
      if (isUserScrolling.current) {
        return;
      }

      const nextIndex = virtualIndexRef.current + 1;
      virtualIndexRef.current = nextIndex;
      scrollToVirtualIndex(nextIndex, true);
      setActiveIndex(nextIndex % images.length);
    }, autoPlayMs);

    return () => clearInterval(timer);
  }, [autoPlayMs, images.length, isLooping, scrollToVirtualIndex]);

  const onScrollEnd = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      isUserScrolling.current = false;
      const index = Math.round(event.nativeEvent.contentOffset.x / slideWidth);
      syncLoopPosition(index);
    },
    [slideWidth, syncLoopPosition],
  );

  const onScrollBeginDrag = useCallback(() => {
    isUserScrolling.current = true;
  }, []);

  if (images.length === 0) {
    return (
      <View style={[styles.empty, {width: slideWidth, height: slideHeight}]}>
        <View style={styles.emptyBadge}>
          <Text style={styles.emptyBadgeText}>VMS</Text>
        </View>
        <Text style={styles.emptyText}>{locale.home.gallery.empty}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.wrapper, {width: slideWidth, height: slideHeight}]}>
      <FlatList
        ref={listRef}
        data={loopSlides}
        keyExtractor={item => item.loopKey}
        horizontal
        pagingEnabled
        bounces={false}
        decelerationRate="fast"
        showsHorizontalScrollIndicator={false}
        onScrollBeginDrag={onScrollBeginDrag}
        onScrollEndDrag={onScrollEnd}
        onMomentumScrollEnd={onScrollEnd}
        getItemLayout={(_, index) => ({
          length: slideWidth,
          offset: slideWidth * index,
          index,
        })}
        renderItem={({item}) => (
          <View style={{width: slideWidth, height: slideHeight}}>
            <Image
              source={{uri: item.uri}}
              style={styles.image}
              resizeMode="cover"
              accessibilityLabel={item.label ?? locale.accessibility.userImage}
            />
            <View style={styles.imageScrim} />
            {item.label ? (
              <View style={styles.captionBar}>
                <Text style={styles.caption} numberOfLines={1}>
                  {item.label}
                </Text>
              </View>
            ) : null}
          </View>
        )}
      />

      <View style={[styles.overlay, {bottom: overlayBottomInset}]}>
        <View style={styles.dots}>
          {images.map((image, index) => (
            <View
              key={image.id}
              style={[styles.dot, index === activeIndex ? styles.dotActive : null]}
            />
          ))}
        </View>
        <Text style={styles.counter}>
          {locale.home.gallery.imageCounter(activeIndex + 1, images.length)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.background,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageScrim: {
    ...StyleSheet.absoluteFill,
    backgroundColor: colors.heroScrim,
  },
  captionBar: {
    position: 'absolute',
    left: spacing.md,
    right: spacing.md,
    bottom: 64,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.42)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  caption: {
    color: colors.textPrimary,
    fontWeight: '600',
  },
  overlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.35)',
  },
  dotActive: {
    backgroundColor: colors.primaryLight,
    width: 22,
  },
  counter: {
    marginTop: spacing.sm,
    color: colors.textPrimary,
    ...typography.caption,
    textTransform: 'none',
    letterSpacing: 0.3,
  },
  empty: {
    backgroundColor: colors.backgroundElevated,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.md,
  },
  emptyBadge: {
    width: 72,
    height: 72,
    borderRadius: 22,
    backgroundColor: colors.primaryGlow,
    borderWidth: 1,
    borderColor: colors.borderFocus,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyBadgeText: {
    color: colors.primaryLight,
    fontWeight: '800',
    fontSize: 22,
    letterSpacing: 2,
  },
  emptyText: {
    color: colors.textSecondary,
    fontSize: 15,
  },
});
