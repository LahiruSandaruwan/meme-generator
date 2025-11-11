/**
 * GIF Support Utility
 * Handles animated GIF import, editing, and export
 * 100% FREE - Uses on-device processing
 */

import * as ImageManipulator from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';

export interface GifFrame {
  uri: string;
  delay: number; // milliseconds
  width: number;
  height: number;
}

export interface GifMetadata {
  frameCount: number;
  width: number;
  height: number;
  totalDuration: number; // milliseconds
  fps: number;
}

export interface GifTextOverlay {
  text: string;
  x: number;
  y: number;
  fontSize: number;
  color: string;
  fontFamily?: string;
}

// GIF file signature
const GIF_SIGNATURE = [0x47, 0x49, 0x46]; // "GIF"

/**
 * Check if file is a GIF
 */
export const isGif = async (uri: string): Promise<boolean> => {
  try {
    const fileInfo = await FileSystem.getInfoAsync(uri);
    if (!fileInfo.exists) return false;

    // Read first 3 bytes to check signature
    const base64 = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
      length: 3,
    });

    const bytes = atob(base64).split('').map(c => c.charCodeAt(0));
    return bytes[0] === GIF_SIGNATURE[0] &&
           bytes[1] === GIF_SIGNATURE[1] &&
           bytes[2] === GIF_SIGNATURE[2];
  } catch (error) {
    console.error('Error checking if file is GIF:', error);
    return false;
  }
};

/**
 * Extract frames from animated GIF
 * Note: This is a simplified version that treats GIF as a static image
 * For full frame extraction, we'd need a native GIF decoder
 *
 * Workaround: Use the GIF as-is for display, and when editing,
 * convert the first frame to static image
 */
export const extractFrames = async (gifUri: string): Promise<GifFrame[]> => {
  try {
    // For now, we'll treat the GIF as a single frame
    // Real GIF frame extraction requires native libraries

    // Get image dimensions
    const manipResult = await ImageManipulator.manipulateAsync(
      gifUri,
      [],
      { compress: 1, format: ImageManipulator.SaveFormat.PNG }
    );

    return [
      {
        uri: manipResult.uri,
        delay: 100, // Default 100ms
        width: manipResult.width,
        height: manipResult.height,
      },
    ];
  } catch (error) {
    console.error('Error extracting frames:', error);
    throw new Error('Failed to extract GIF frames');
  }
};

/**
 * Get GIF metadata
 */
export const getGifMetadata = async (gifUri: string): Promise<GifMetadata> => {
  try {
    const frames = await extractFrames(gifUri);
    const firstFrame = frames[0];

    return {
      frameCount: frames.length,
      width: firstFrame.width,
      height: firstFrame.height,
      totalDuration: frames.reduce((sum, f) => sum + f.delay, 0),
      fps: frames.length > 0 ? 1000 / frames[0].delay : 10,
    };
  } catch (error) {
    console.error('Error getting GIF metadata:', error);
    throw new Error('Failed to get GIF metadata');
  }
};

/**
 * Add text overlay to GIF frames
 * Note: This simplified version converts GIF to static image with text
 */
export const addTextToGif = async (
  gifUri: string,
  textOverlay: GifTextOverlay
): Promise<string> => {
  try {
    // Extract first frame
    const frames = await extractFrames(gifUri);
    const firstFrame = frames[0];

    // For now, we'll just return the frame URI
    // Real text overlay requires canvas manipulation or native rendering
    // The actual text will be added in the editor UI layer

    return firstFrame.uri;
  } catch (error) {
    console.error('Error adding text to GIF:', error);
    throw new Error('Failed to add text to GIF');
  }
};

/**
 * Resize GIF (by resizing first frame)
 */
export const resizeGif = async (
  gifUri: string,
  width: number,
  height: number
): Promise<string> => {
  try {
    const result = await ImageManipulator.manipulateAsync(
      gifUri,
      [{ resize: { width, height } }],
      { compress: 0.9, format: ImageManipulator.SaveFormat.PNG }
    );

    return result.uri;
  } catch (error) {
    console.error('Error resizing GIF:', error);
    throw new Error('Failed to resize GIF');
  }
};

/**
 * Crop GIF (by cropping first frame)
 */
export const cropGif = async (
  gifUri: string,
  originX: number,
  originY: number,
  width: number,
  height: number
): Promise<string> => {
  try {
    const result = await ImageManipulator.manipulateAsync(
      gifUri,
      [{ crop: { originX, originY, width, height } }],
      { compress: 0.9, format: ImageManipulator.SaveFormat.PNG }
    );

    return result.uri;
  } catch (error) {
    console.error('Error cropping GIF:', error);
    throw new Error('Failed to crop GIF');
  }
};

/**
 * Rotate GIF (by rotating first frame)
 */
export const rotateGif = async (
  gifUri: string,
  degrees: number
): Promise<string> => {
  try {
    const result = await ImageManipulator.manipulateAsync(
      gifUri,
      [{ rotate: degrees }],
      { compress: 0.9, format: ImageManipulator.SaveFormat.PNG }
    );

    return result.uri;
  } catch (error) {
    console.error('Error rotating GIF:', error);
    throw new Error('Failed to rotate GIF');
  }
};

/**
 * Flip GIF (by flipping first frame)
 */
export const flipGif = async (
  gifUri: string,
  flipType: 'horizontal' | 'vertical'
): Promise<string> => {
  try {
    const flip = flipType === 'horizontal'
      ? ImageManipulator.FlipType.Horizontal
      : ImageManipulator.FlipType.Vertical;

    const result = await ImageManipulator.manipulateAsync(
      gifUri,
      [{ flip }],
      { compress: 0.9, format: ImageManipulator.SaveFormat.PNG }
    );

    return result.uri;
  } catch (error) {
    console.error('Error flipping GIF:', error);
    throw new Error('Failed to flip GIF');
  }
};

/**
 * Export frames as image sequence
 * Useful for creating video or manual GIF encoding
 */
export const exportFramesAsSequence = async (
  frames: GifFrame[],
  outputDir: string
): Promise<string[]> => {
  try {
    const outputUris: string[] = [];

    for (let i = 0; i < frames.length; i++) {
      const frame = frames[i];
      const outputPath = `${outputDir}/frame_${i.toString().padStart(4, '0')}.png`;

      // Copy frame to output directory
      await FileSystem.copyAsync({
        from: frame.uri,
        to: outputPath,
      });

      outputUris.push(outputPath);
    }

    return outputUris;
  } catch (error) {
    console.error('Error exporting frames:', error);
    throw new Error('Failed to export frames as sequence');
  }
};

/**
 * Get GIF duration in seconds
 */
export const getGifDuration = async (gifUri: string): Promise<number> => {
  try {
    const metadata = await getGifMetadata(gifUri);
    return metadata.totalDuration / 1000;
  } catch (error) {
    console.error('Error getting GIF duration:', error);
    return 0;
  }
};

/**
 * Optimize GIF for sharing (reduce size)
 */
export const optimizeGif = async (
  gifUri: string,
  maxWidth: number = 480,
  quality: number = 0.8
): Promise<string> => {
  try {
    const metadata = await getGifMetadata(gifUri);

    // Resize if too large
    if (metadata.width > maxWidth) {
      const ratio = maxWidth / metadata.width;
      const newHeight = Math.round(metadata.height * ratio);

      return await resizeGif(gifUri, maxWidth, newHeight);
    }

    return gifUri;
  } catch (error) {
    console.error('Error optimizing GIF:', error);
    throw new Error('Failed to optimize GIF');
  }
};

/**
 * Convert GIF to video (MP4)
 * Note: This would require expo-av and FFmpeg, which might not be FREE
 * Placeholder for future implementation
 */
export const convertGifToVideo = async (
  gifUri: string,
  outputPath: string
): Promise<string> => {
  // This would require FFmpeg or similar video encoding library
  // For now, we'll throw an error indicating it's not yet implemented
  throw new Error('GIF to video conversion requires additional libraries');
};

/**
 * Validate GIF file
 */
export const validateGif = async (uri: string): Promise<{
  valid: boolean;
  error?: string;
}> => {
  try {
    const fileInfo = await FileSystem.getInfoAsync(uri);

    if (!fileInfo.exists) {
      return { valid: false, error: 'File does not exist' };
    }

    if (fileInfo.size === undefined || fileInfo.size === 0) {
      return { valid: false, error: 'File is empty' };
    }

    const isGifFile = await isGif(uri);
    if (!isGifFile) {
      return { valid: false, error: 'File is not a valid GIF' };
    }

    return { valid: true };
  } catch (error) {
    return { valid: false, error: 'Failed to validate GIF file' };
  }
};

/**
 * GIF editing presets
 */
export const GIF_PRESETS = {
  social: {
    name: 'Social Media',
    maxWidth: 480,
    maxHeight: 480,
    quality: 0.8,
  },
  story: {
    name: 'Story (9:16)',
    maxWidth: 480,
    maxHeight: 854,
    quality: 0.8,
  },
  square: {
    name: 'Square (1:1)',
    maxWidth: 480,
    maxHeight: 480,
    quality: 0.8,
  },
  wide: {
    name: 'Wide (16:9)',
    maxWidth: 640,
    maxHeight: 360,
    quality: 0.8,
  },
};

/**
 * Popular GIF categories for search/discovery
 */
export const GIF_CATEGORIES = [
  { id: 'reactions', name: 'Reactions', icon: 'happy-outline' },
  { id: 'memes', name: 'Memes', icon: 'images-outline' },
  { id: 'animals', name: 'Animals', icon: 'paw-outline' },
  { id: 'sports', name: 'Sports', icon: 'football-outline' },
  { id: 'movies', name: 'Movies & TV', icon: 'film-outline' },
  { id: 'dance', name: 'Dance', icon: 'musical-notes-outline' },
  { id: 'celebrate', name: 'Celebrations', icon: 'ribbon-outline' },
  { id: 'funny', name: 'Funny', icon: 'thunderstorm-outline' },
];

/**
 * GIF search tips
 */
export const GIF_SEARCH_TIPS = [
  'Use specific keywords like "cat falling" instead of just "cat"',
  'Add emotion words like "happy", "sad", "angry" for reactions',
  'Try celebrity names or movie titles for pop culture GIFs',
  'Use "loop" or "perfect loop" for seamless repeating GIFs',
];

// Note: This is a simplified GIF utility that focuses on treating GIFs
// as static images for editing. Full animated GIF support would require:
// 1. Native GIF decoder (e.g., expo-image with GIF support)
// 2. Frame-by-frame editing capabilities
// 3. GIF encoder for creating animated output
//
// For a FREE solution, the recommended approach is:
// - Display GIFs using expo-image (supports animated GIFs)
// - Edit the first frame as a static image
// - Export as PNG/JPG or use an external service for GIF creation
//
// Alternative: Use React Native WebView with HTML5 Canvas and gif.js
// for client-side GIF encoding, but this is more complex.
