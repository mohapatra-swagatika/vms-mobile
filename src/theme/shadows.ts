import {Platform, ViewStyle} from 'react-native';

export const shadows = {
  sm: Platform.select<ViewStyle>({
    ios: {
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 4},
      shadowOpacity: 0.18,
      shadowRadius: 8,
    },
    android: {elevation: 3},
    default: {},
  }),
  md: Platform.select<ViewStyle>({
    ios: {
      shadowColor: '#0057FF',
      shadowOffset: {width: 0, height: 10},
      shadowOpacity: 0.22,
      shadowRadius: 18,
    },
    android: {elevation: 8},
    default: {},
  }),
  lg: Platform.select<ViewStyle>({
    ios: {
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 16},
      shadowOpacity: 0.28,
      shadowRadius: 28,
    },
    android: {elevation: 12},
    default: {},
  }),
} as const;
