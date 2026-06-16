import React from 'react';

import Feather from '@react-native-vector-icons/feather/static';
import FontAwesome6 from '@react-native-vector-icons/fontawesome6/static';
import Ionicons from '@react-native-vector-icons/ionicons/static';
import MaterialIcons from '@react-native-vector-icons/material-icons/static';

import {icons, IconSpec} from '../constants/icons';

type BaseProps = {
  size?: number;
  color?: string;
  accessibilityLabel?: string;
};

type Props =
  | (BaseProps & {icon: IconSpec})
  | (BaseProps & {name: keyof typeof icons});

/**
 * Global icon component (single import point across the app).
 *
 * Usage:
 * - `<Icon name="eye" />` (preferred: centralized registry)
 * - `<Icon icon={{ family: 'feather', name: 'user' }} />` (escape hatch)
 */
export function Icon(props: Props) {
  const {size = 20, color, accessibilityLabel} = props;
  const spec: IconSpec = 'name' in props ? icons[props.name] : props.icon;

  const common = {
    size,
    color,
    accessibilityLabel,
  };

  switch (spec.family) {
    case 'ionicons':
      return <Ionicons name={spec.name as never} {...common} />;
    case 'feather':
      return <Feather name={spec.name as never} {...common} />;
    case 'material':
      return <MaterialIcons name={spec.name as never} {...common} />;
    case 'fontawesome6':
      return <FontAwesome6 name={spec.name as never} {...common} />;
    default:
      // Exhaustive guard (keeps runtime safe if someone casts).
      return <Ionicons name={'help-circle-outline' as never} {...common} />;
  }
}

