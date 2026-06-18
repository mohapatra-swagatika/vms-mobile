import {Alert, Platform} from 'react-native';
import {
  CameraOptions,
  ImagePickerResponse,
  launchCamera,
} from 'react-native-image-picker';

export async function captureVisitorPhoto(): Promise<string | null> {
  const options: CameraOptions = {
    mediaType: 'photo',
    cameraType: 'front',
    saveToPhotos: false,
    quality: 0.8,
    maxWidth: 1280,
    maxHeight: 1280,
  };

  return new Promise(resolve => {
    launchCamera(options, (response: ImagePickerResponse) => {
      if (response.didCancel) {
        resolve(null);
        return;
      }
      if (response.errorCode) {
        Alert.alert(
          'Camera unavailable',
          response.errorMessage ||
            'Please allow camera access in Settings to capture a visitor photo.',
        );
        resolve(null);
        return;
      }
      resolve(response.assets?.[0]?.uri ?? null);
    });
  });
}

export function photoFileName(uri: string): string {
  const parts = uri.split('/');
  return parts[parts.length - 1] || `visitor-${Date.now()}.jpg`;
}

export function photoMimeType(): string {
  return 'image/jpeg';
}
