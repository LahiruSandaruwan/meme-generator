import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';
import { Alert } from 'react-native';
import { SavedMeme } from '../types';

export interface BatchExportOptions {
  format?: 'jpeg' | 'png';
  quality?: number;
  createAlbum?: boolean;
  albumName?: string;
}

export interface BatchExportProgress {
  current: number;
  total: number;
  percentage: number;
}

/**
 * Export multiple memes to camera roll
 */
export const batchExportToLibrary = async (
  memes: SavedMeme[],
  options: BatchExportOptions = {},
  onProgress?: (progress: BatchExportProgress) => void
): Promise<{ success: number; failed: number }> => {
  try {
    const { status } = await MediaLibrary.requestPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'We need access to your photos to save memes.',
        [{ text: 'OK' }]
      );
      return { success: 0, failed: memes.length };
    }

    let success = 0;
    let failed = 0;
    const total = memes.length;

    // Create album if requested
    let album: MediaLibrary.Album | null = null;
    if (options.createAlbum && options.albumName) {
      try {
        album = await MediaLibrary.getAlbumAsync(options.albumName);
        if (!album) {
          const asset = await MediaLibrary.createAssetAsync(memes[0].uri);
          album = await MediaLibrary.createAlbumAsync(options.albumName, asset, false);
        }
      } catch (error) {
        if (__DEV__) {
          console.error('Error creating album:', error);
        }
      }
    }

    // Export each meme
    for (let i = 0; i < memes.length; i++) {
      const meme = memes[i];

      try {
        const asset = await MediaLibrary.createAssetAsync(meme.uri);

        if (album) {
          await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
        }

        success++;
      } catch (error) {
        if (__DEV__) {
          console.error(`Error exporting meme ${meme.id}:`, error);
        }
        failed++;
      }

      // Update progress
      if (onProgress) {
        onProgress({
          current: i + 1,
          total,
          percentage: ((i + 1) / total) * 100,
        });
      }
    }

    return { success, failed };
  } catch (error) {
    if (__DEV__) {
      console.error('Error in batch export:', error);
    }
    return { success: 0, failed: memes.length };
  }
};

/**
 * Share multiple memes
 */
export const batchShare = async (
  memes: SavedMeme[],
  options: { message?: string; title?: string } = {}
): Promise<boolean> => {
  try {
    const isAvailable = await Sharing.isAvailableAsync();
    if (!isAvailable) {
      Alert.alert('Error', 'Sharing is not available on this device');
      return false;
    }

    if (memes.length === 0) {
      Alert.alert('Error', 'No memes selected');
      return false;
    }

    // For single meme, use regular sharing
    if (memes.length === 1) {
      await Sharing.shareAsync(memes[0].uri, {
        mimeType: 'image/jpeg',
        dialogTitle: options.title || 'Share your meme',
      });
      return true;
    }

    // For multiple memes, share first one with message about batch
    const message = options.message || `Sharing ${memes.length} memes`;
    await Sharing.shareAsync(memes[0].uri, {
      mimeType: 'image/jpeg',
      dialogTitle: message,
    });

    return true;
  } catch (error) {
    if (__DEV__) {
      console.error('Error in batch share:', error);
    }
    return false;
  }
};

/**
 * Get estimated time for batch operation
 */
export const getEstimatedTime = (count: number): string => {
  const secondsPerMeme = 0.5;
  const totalSeconds = count * secondsPerMeme;

  if (totalSeconds < 60) {
    return `~${Math.ceil(totalSeconds)} seconds`;
  }

  const minutes = Math.ceil(totalSeconds / 60);
  return `~${minutes} minute${minutes > 1 ? 's' : ''}`;
};

/**
 * Validate memes for batch operation
 */
export const validateMemesForBatch = (memes: SavedMeme[]): {
  valid: boolean;
  message?: string;
} => {
  if (memes.length === 0) {
    return {
      valid: false,
      message: 'No memes selected',
    };
  }

  if (memes.length > 100) {
    return {
      valid: false,
      message: 'Maximum 100 memes can be exported at once',
    };
  }

  return {
    valid: true,
  };
};

/**
 * Calculate total size (approximate)
 */
export const getApproximateSize = (count: number): string => {
  const avgSizeKB = 500; // Average meme size
  const totalKB = count * avgSizeKB;

  if (totalKB < 1024) {
    return `~${totalKB}KB`;
  }

  const totalMB = (totalKB / 1024).toFixed(1);
  return `~${totalMB}MB`;
};
