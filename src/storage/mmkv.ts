import {createMMKV} from 'react-native-mmkv';

import {locale} from '../constants';

export const mmkv = createMMKV({
  id: locale.storageKeys.mmkvInstanceId,
});
