import * as ImageManipulator from 'expo-image-manipulator';
import { Alert } from 'react-native';

export type ImageFormat = 'jpeg' | 'png' | 'webp';
export type QualityPreset = 'low' | 'medium' | 'high' | 'maximum';

export interface OptimizationOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number; // 0-1
  format?: ImageFormat;
  preset?: QualityPreset;
}

export interface OptimizationResult {
  uri: string;
  width: number;
  height: number;
  originalSize?: number;
  optimizedSize?: number;
  compressionRatio?: number;
}

// Quality presets for different use cases
const QUALITY_PRESETS: Record<QualityPreset, {
  quality: number;
  maxWidth: number;
  description: string;
}> = {
  low: {
    quality: 0.5,
    maxWidth: 800,
    description: 'Smallest file size, suitable for WhatsApp',
  },
  medium: {
    quality: 0.7,
    maxWidth: 1080,
    description: 'Balanced, good for most social media',
  },
  high: {
    quality: 0.85,
    maxWidth: 1920,
    description: 'High quality for Instagram/Facebook',
  },
  maximum: {
    quality: 1.0,
    maxWidth: 4000,
    description: 'Maximum quality, larger file size',
  },
};

/**
 * Optimize image with smart compression
 */
export const optimizeImage = async (
  uri: string,
  options: OptimizationOptions = {}
): Promise<OptimizationResult> => {
  try {
    // Apply preset if specified
    const preset = options.preset ? QUALITY_PRESETS[options.preset] : null;

    const maxWidth = options.maxWidth || preset?.maxWidth || 1920;
    const maxHeight = options.maxHeight || maxWidth;
    const quality = options.quality ?? preset?.quality ?? 0.85;
    const format = options.format || 'jpeg';

    // Get expo-image-manipulator format
    let saveFormat: ImageManipulator.SaveFormat;
    switch (format) {
      case 'png':
        saveFormat = ImageManipulator.SaveFormat.PNG;
        break;
      case 'webp':
        saveFormat = ImageManipulator.SaveFormat.WEBP;
        break;
      default:
        saveFormat = ImageManipulator.SaveFormat.JPEG;
    }

    // Perform optimization
    const result = await ImageManipulator.manipulateAsync(
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
        compress: quality,
        format: saveFormat,
      }
    );

    return {
      uri: result.uri,
      width: result.width,
      height: result.height,
    };
  } catch (error) {
    if (__DEV__) {
      console.error('Error optimizing image:', error);
    }
    throw error;
  }
};

/**
 * Batch optimize multiple images
 */
export const batchOptimizeImages = async (
  uris: string[],
  options: OptimizationOptions = {},
  onProgress?: (current: number, total: number) => void
): Promise<OptimizationResult[]> => {
  const results: OptimizationResult[] = [];

  for (let i = 0; i < uris.length; i++) {
    try {
      const result = await optimizeImage(uris[i], options);
      results.push(result);

      if (onProgress) {
        onProgress(i + 1, uris.length);
      }
    } catch (error) {
      if (__DEV__) {
        console.error(`Error optimizing image ${i}:`, error);
      }
      // Continue with other images even if one fails
    }
  }

  return results;
};

/**
 * Auto-select best quality based on dimensions
 */
export const getRecommendedPreset = (width: number, height: number): QualityPreset => {
  const pixels = width * height;

  if (pixels < 500000) {
    // < 0.5MP - already small
    return 'maximum';
  } else if (pixels < 2000000) {
    // < 2MP
    return 'high';
  } else if (pixels < 5000000) {
    // < 5MP
    return 'medium';
  } else {
    // > 5MP - needs compression
    return 'low';
  }
};

/**
 * Get preset info
 */
export const getPresetInfo = (preset: QualityPreset) => {
  return QUALITY_PRESETS[preset];
};

/**
 * Calculate estimated file size
 */
export const estimateFileSize = (
  width: number,
  height: number,
  quality: number,
  format: ImageFormat
): string => {
  const pixels = width * height;
  let bytesPerPixel: number;

  switch (format) {
    case 'png':
      bytesPerPixel = 3; // PNG is larger
      break;
    case 'webp':
      bytesPerPixel = 0.8 * quality; // WebP is efficient
      break;
    default:
      bytesPerPixel = 1 * quality; // JPEG
  }

  const estimatedBytes = pixels * bytesPerPixel;

  if (estimatedBytes < 1024) {
    return `${Math.round(estimatedBytes)} bytes`;
  } else if (estimatedBytes < 1024 * 1024) {
    return `${Math.round(estimatedBytes / 1024)} KB`;
  } else {
    return `${(estimatedBytes / (1024 * 1024)).toFixed(1)} MB`;
  }
};

/**
 * Optimize for specific platform
 */
export const optimizeForPlatform = async (
  uri: string,
  platform: 'instagram' | 'facebook' | 'twitter' | 'whatsapp' | 'tiktok'
): Promise<OptimizationResult> => {
  const platformSettings: Record<string, OptimizationOptions> = {
    instagram: {
      maxWidth: 1080,
      maxHeight: 1080,
      quality: 0.85,
      format: 'jpeg',
    },
    facebook: {
      maxWidth: 2048,
      maxHeight: 2048,
      quality: 0.85,
      format: 'jpeg',
    },
    twitter: {
      maxWidth: 1200,
      maxHeight: 675,
      quality: 0.85,
      format: 'jpeg',
    },
    whatsapp: {
      maxWidth: 800,
      maxHeight: 800,
      quality: 0.7,
      format: 'jpeg',
    },
    tiktok: {
      maxWidth: 1080,
      maxHeight: 1920,
      quality: 0.85,
      format: 'jpeg',
    },
  };

  const settings = platformSettings[platform];
  return optimizeImage(uri, settings);
};

/**
 * Show optimization suggestions
 */
export const showOptimizationTip = (originalWidth: number, originalHeight: number) => {
  const preset = getRecommendedPreset(originalWidth, originalHeight);
  const info = QUALITY_PRESETS[preset];

  Alert.alert(
    'Optimization Tip',
    `For best results with ${originalWidth}x${originalHeight}, we recommend:\n\n` +
    `Preset: ${preset.toUpperCase()}\n` +
    `${info.description}`,
    [{ text: 'Got it' }]
  );
};

/**
 * Compress image aggressively for sharing
 */
export const compressForSharing = async (uri: string): Promise<OptimizationResult> => {
  return optimizeImage(uri, {
    preset: 'medium',
    format: 'jpeg',
  });
};

/**
 * Prepare image for export (highest quality)
 */
export const prepareForExport = async (uri: string): Promise<OptimizationResult> => {
  return optimizeImage(uri, {
    preset: 'maximum',
    format: 'png',
  });
};
