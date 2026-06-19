import {Platform} from 'react-native';
import getDevServer from 'react-native/Libraries/Core/Devtools/getDevServer';

function getDevApiHost(): string {
  if (Platform.OS === 'android') {
    // Android emulator maps host machine localhost to 10.0.2.2
    return '10.0.2.2';
  }

  try {
    // Use the same host Metro is served from (works on simulator + physical device)
    const devServerUrl = getDevServer().url;
    const hostname = devServerUrl.replace(/^https?:\/\//, '').split(':')[0];
    if (hostname) {
      return hostname;
    }
  } catch {
    // Fall back to localhost when dev server host is unavailable
  }

  return 'localhost';
}

/**
 * App configuration.
 * Backend runs on port 4000 (vms-backend).
 * Android emulator uses 10.0.2.2 to reach host machine localhost.
 * iOS uses the Metro bundler host so physical devices can reach the API.
 */
export const config = {
  apiBaseUrl: `http://${getDevApiHost()}:4000`,
  imageSliderAutoPlayMs: 5000,
} as const;
