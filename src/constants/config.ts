import {Platform} from 'react-native';

function getDevApiHost() {
  return Platform.OS === 'android' ? '10.0.2.2' : 'localhost';
}

/**
 * App configuration.
 * Backend runs on port 4000 (vms-backend).
 * Android emulator uses 10.0.2.2 to reach host machine localhost.
 */
export const config = {
  apiBaseUrl: `http://${getDevApiHost()}:4000`,
  imageSliderAutoPlayMs: 5000,
} as const;
