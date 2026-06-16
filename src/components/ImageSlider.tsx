import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  FlatList,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
  ViewToken,
} from 'react-native';

import {config} from '../constants/config';
import {strings} from '../constants';
import {colors, spacing} from '../theme';
import {UserImage} from '../types/user';

type Props = {
  images: UserImage[];
  autoPlayMs?: number;
};

export function ImageSlider({
  images,
  autoPlayMs = config.imageSliderAutoPlayMs,
}: Props) {
  const {width, height} = useWindowDimensions();
  const listRef = useRef<FlatList<UserImage>>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const isUserScrolling = useRef(false);

  const slideWidth = width;
  const slideHeight = height;

  useEffect(() => {
    if (images.length <= 1) {
      return;
    }

    const timer = setInterval(() => {
      if (isUserScrolling.current) {
        return;
      }

      setActiveIndex(current => {
        const nextIndex = (current + 1) % images.length;
        listRef.current?.scrollToOffset({
          offset: nextIndex * slideWidth,
          animated: true,
        });
        return nextIndex;
      });
    }, autoPlayMs);

    return () => clearInterval(timer);
  }, [autoPlayMs, images.length, slideWidth]);

  const onViewableItemsChanged = useRef(
    ({viewableItems}: {viewableItems: ViewToken[]}) => {
      const index = viewableItems[0]?.index;
      if (typeof index === 'number') {
        setActiveIndex(index);
      }
    },
  ).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 60,
  }).current;

  const onMomentumScrollEnd = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      isUserScrolling.current = false;
      const index = Math.round(event.nativeEvent.contentOffset.x / slideWidth);
      setActiveIndex(index);
    },
    [slideWidth],
  );

  const onScrollBeginDrag = useCallback(() => {
    isUserScrolling.current = true;
  }, []);

  if (images.length === 0) {
    return (
      <View style={[styles.empty, {width: slideWidth, height: slideHeight}]}>
        <Text style={styles.emptyText}>{strings.home.noImages}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.wrapper, {width: slideWidth, height: slideHeight}]}>
      <FlatList
        ref={listRef}
        data={images}
        keyExtractor={item => item.id}
        horizontal
        pagingEnabled
        bounces={false}
        decelerationRate="fast"
        showsHorizontalScrollIndicator={false}
        onScrollBeginDrag={onScrollBeginDrag}
        onMomentumScrollEnd={onMomentumScrollEnd}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
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
              accessibilityLabel={item.label ?? 'User image'}
            />
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

      <View style={styles.overlay}>
        <View style={styles.dots}>
          {images.map((image, index) => (
            <View
              key={image.id}
              style={[styles.dot, index === activeIndex ? styles.dotActive : null]}
            />
          ))}
        </View>
        <Text style={styles.counter}>
          {activeIndex + 1} / {images.length}
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
  captionBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 72,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  caption: {
    color: colors.textPrimary,
    fontWeight: '600',
  },
  overlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: spacing.xl,
    alignItems: 'center',
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  dotActive: {
    backgroundColor: colors.primary,
    width: 20,
  },
  counter: {
    marginTop: spacing.sm,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  empty: {
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: colors.textSecondary,
  },
});
