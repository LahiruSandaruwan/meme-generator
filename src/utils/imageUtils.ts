import * as ImageManipulator from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import { APP_CONFIG } from '../constants/config';

export interface ResizeImageOptions {
  uri: string;
  maxWidth?: number;
  maxHeight?: number;
}

export const resizeImage = async ({
  uri,
  maxWidth = APP_CONFIG.maxMemeWidth,
  maxHeight = APP_CONFIG.maxMemeHeight,
}: ResizeImageOptions): Promise<string> => {
  try {
    const manipResult = await ImageManipulator.manipulateAsync(
      uri,
      [
        {
          resize: {
            width: maxWidth,
            height: maxHeight,
          },
        },
      ],
      {
        compress: APP_CONFIG.imageQuality,
        format: ImageManipulator.SaveFormat.JPEG,
      }
    );
    return manipResult.uri;
  } catch (error) {
    console.error('Error resizing image:', error);
    throw error;
  }
};

export const saveImageToGallery = async (uri: string): Promise<string> => {
  try {
    const { status } = await MediaLibrary.requestPermissionsAsync();

    if (status !== 'granted') {
      throw new Error('Permission to access media library denied');
    }

    const asset = await MediaLibrary.createAssetAsync(uri);
    return asset.uri;
  } catch (error) {
    console.error('Error saving image to gallery:', error);
    throw error;
  }
};

export const generateUniqueId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const getImageDimensions = async (
  uri: string
): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      resolve({ width: image.width, height: image.height });
    };
    image.onerror = reject;
    image.src = uri;
  });
};

export const base64ToUri = async (base64: string): Promise<string> => {
  try {
    const filename = `${FileSystem.cacheDirectory}${generateUniqueId()}.jpg`;
    await FileSystem.writeAsStringAsync(filename, base64, {
      encoding: FileSystem.EncodingType.Base64,
    });
    return filename;
  } catch (error) {
    console.error('Error converting base64 to URI:', error);
    throw error;
  }
};
