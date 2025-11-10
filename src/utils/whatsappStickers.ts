/**
 * WhatsApp Sticker Creator
 * Convert memes to WhatsApp sticker format
 * 100% FREE - Uses expo-image-manipulator
 */

import * as ImageManipulator from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STICKER_PACKS_KEY = '@whatsapp_sticker_packs';

/**
 * WhatsApp sticker requirements
 */
export const STICKER_REQUIREMENTS = {
  size: 512,
  maxFileSize: 100 * 1024, // 100KB
  minStickers: 3,
  maxStickers: 30,
  format: 'webp' as const,
  trayIconSize: 96,
};

export interface StickerPack {
  id: string;
  name: string;
  author: string;
  trayImageUri?: string;
  stickers: Sticker[];
  createdAt: number;
}

export interface Sticker {
  id: string;
  uri: string;
  emoji?: string;
}

/**
 * Convert image to WhatsApp sticker format
 */
export const convertToSticker = async (
  imageUri: string,
  options: {
    removeBackground?: boolean;
    resize?: boolean;
  } = {}
): Promise<{ uri: string; size: number }> => {
  try {
    const { resize = true } = options;

    // Start with the image
    let manipulations: ImageManipulator.Action[] = [];

    // Resize to 512x512 if needed
    if (resize) {
      manipulations.push({
        resize: {
          width: STICKER_REQUIREMENTS.size,
          height: STICKER_REQUIREMENTS.size,
        },
      });
    }

    // Convert to WebP format
    const result = await ImageManipulator.manipulateAsync(
      imageUri,
      manipulations,
      {
        compress: 0.8, // Compress to meet 100KB limit
        format: ImageManipulator.SaveFormat.WEBP,
      }
    );

    // Check file size
    const fileInfo = await FileSystem.getInfoAsync(result.uri);
    const fileSize = (fileInfo as any).size || 0;

    // If file is too large, compress more
    if (fileSize > STICKER_REQUIREMENTS.maxFileSize) {
      const compressedResult = await ImageManipulator.manipulateAsync(
        imageUri,
        manipulations,
        {
          compress: 0.5, // More aggressive compression
          format: ImageManipulator.SaveFormat.WEBP,
        }
      );

      const compressedInfo = await FileSystem.getInfoAsync(compressedResult.uri);
      const compressedSize = (compressedInfo as any).size || 0;

      return {
        uri: compressedResult.uri,
        size: compressedSize,
      };
    }

    return {
      uri: result.uri,
      size: fileSize,
    };
  } catch (error) {
    throw new Error('Failed to convert to sticker format');
  }
};

/**
 * Create tray icon (96x96) from image
 */
export const createTrayIcon = async (imageUri: string): Promise<string> => {
  try {
    const result = await ImageManipulator.manipulateAsync(
      imageUri,
      [
        {
          resize: {
            width: STICKER_REQUIREMENTS.trayIconSize,
            height: STICKER_REQUIREMENTS.trayIconSize,
          },
        },
      ],
      {
        compress: 0.8,
        format: ImageManipulator.SaveFormat.PNG,
      }
    );

    return result.uri;
  } catch (error) {
    throw new Error('Failed to create tray icon');
  }
};

/**
 * Save sticker pack
 */
export const saveStickerPack = async (pack: Omit<StickerPack, 'id' | 'createdAt'>): Promise<StickerPack> => {
  try {
    const packs = await getStickerPacks();

    const newPack: StickerPack = {
      ...pack,
      id: `pack-${Date.now()}`,
      createdAt: Date.now(),
    };

    packs.push(newPack);
    await AsyncStorage.setItem(STICKER_PACKS_KEY, JSON.stringify(packs));

    return newPack;
  } catch (error) {
    throw new Error('Failed to save sticker pack');
  }
};

/**
 * Get all sticker packs
 */
export const getStickerPacks = async (): Promise<StickerPack[]> => {
  try {
    const data = await AsyncStorage.getItem(STICKER_PACKS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    return [];
  }
};

/**
 * Get sticker pack by ID
 */
export const getStickerPack = async (packId: string): Promise<StickerPack | null> => {
  const packs = await getStickerPacks();
  return packs.find(pack => pack.id === packId) || null;
};

/**
 * Delete sticker pack
 */
export const deleteStickerPack = async (packId: string): Promise<void> => {
  try {
    const packs = await getStickerPacks();
    const filtered = packs.filter(pack => pack.id !== packId);
    await AsyncStorage.setItem(STICKER_PACKS_KEY, JSON.stringify(filtered));
  } catch (error) {
    throw new Error('Failed to delete sticker pack');
  }
};

/**
 * Add sticker to pack
 */
export const addStickerToPack = async (
  packId: string,
  sticker: Omit<Sticker, 'id'>
): Promise<void> => {
  try {
    const packs = await getStickerPacks();
    const packIndex = packs.findIndex(p => p.id === packId);

    if (packIndex === -1) {
      throw new Error('Pack not found');
    }

    if (packs[packIndex].stickers.length >= STICKER_REQUIREMENTS.maxStickers) {
      throw new Error(`Maximum ${STICKER_REQUIREMENTS.maxStickers} stickers per pack`);
    }

    const newSticker: Sticker = {
      ...sticker,
      id: `sticker-${Date.now()}`,
    };

    packs[packIndex].stickers.push(newSticker);
    await AsyncStorage.setItem(STICKER_PACKS_KEY, JSON.stringify(packs));
  } catch (error) {
    throw error;
  }
};

/**
 * Remove sticker from pack
 */
export const removeStickerFromPack = async (
  packId: string,
  stickerId: string
): Promise<void> => {
  try {
    const packs = await getStickerPacks();
    const packIndex = packs.findIndex(p => p.id === packId);

    if (packIndex === -1) {
      throw new Error('Pack not found');
    }

    packs[packIndex].stickers = packs[packIndex].stickers.filter(
      s => s.id !== stickerId
    );

    await AsyncStorage.setItem(STICKER_PACKS_KEY, JSON.stringify(packs));
  } catch (error) {
    throw error;
  }
};

/**
 * Validate sticker pack
 */
export const validateStickerPack = (pack: StickerPack): {
  valid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];

  if (!pack.name || pack.name.trim().length === 0) {
    errors.push('Pack name is required');
  }

  if (!pack.author || pack.author.trim().length === 0) {
    errors.push('Author name is required');
  }

  if (pack.stickers.length < STICKER_REQUIREMENTS.minStickers) {
    errors.push(`At least ${STICKER_REQUIREMENTS.minStickers} stickers required`);
  }

  if (pack.stickers.length > STICKER_REQUIREMENTS.maxStickers) {
    errors.push(`Maximum ${STICKER_REQUIREMENTS.maxStickers} stickers allowed`);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

/**
 * Share sticker pack to WhatsApp
 * Note: WhatsApp doesn't have a direct API for adding stickers
 * Users need to use a third-party app or manually import
 */
export const shareStickerPack = async (pack: StickerPack): Promise<void> => {
  try {
    // Validate pack first
    const validation = validateStickerPack(pack);
    if (!validation.valid) {
      throw new Error(validation.errors.join(', '));
    }

    // Create a share message with instructions
    const shareMessage = `
WhatsApp Sticker Pack: ${pack.name}
By: ${pack.author}
${pack.stickers.length} stickers

To add to WhatsApp:
1. Save all stickers to your device
2. Open WhatsApp
3. Start a chat
4. Tap the sticker icon
5. Tap the + icon
6. Select your saved stickers

Enjoy your custom sticker pack!
    `.trim();

    // Share the message
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(pack.stickers[0].uri, {
        dialogTitle: `Share ${pack.name} Sticker Pack`,
      });
    }
  } catch (error) {
    throw error;
  }
};

/**
 * Export sticker pack as ZIP (for advanced users)
 */
export const exportStickerPack = async (pack: StickerPack): Promise<string> => {
  try {
    // Create metadata file
    const metadata = {
      name: pack.name,
      author: pack.author,
      stickers: pack.stickers.map((s, index) => ({
        image_file: `${index}.webp`,
        emojis: s.emoji ? [s.emoji] : ['😀'],
      })),
      tray_image: 'tray.png',
    };

    // In a real implementation, you would:
    // 1. Create a temporary directory
    // 2. Copy all sticker files
    // 3. Create metadata.json
    // 4. ZIP everything
    // 5. Return ZIP file URI

    // For now, return the pack as JSON
    return JSON.stringify(metadata, null, 2);
  } catch (error) {
    throw new Error('Failed to export sticker pack');
  }
};

/**
 * Get pack statistics
 */
export const getPackStats = (pack: StickerPack): {
  stickerCount: number;
  canAddMore: boolean;
  remainingSlots: number;
  isValid: boolean;
} => {
  const validation = validateStickerPack(pack);

  return {
    stickerCount: pack.stickers.length,
    canAddMore: pack.stickers.length < STICKER_REQUIREMENTS.maxStickers,
    remainingSlots: STICKER_REQUIREMENTS.maxStickers - pack.stickers.length,
    isValid: validation.valid,
  };
};

/**
 * Format file size
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) {
    return `${bytes} B`;
  } else if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

/**
 * Check if image meets sticker requirements
 */
export const checkStickerRequirements = (fileSize: number): {
  meetsRequirements: boolean;
  message: string;
} => {
  if (fileSize > STICKER_REQUIREMENTS.maxFileSize) {
    return {
      meetsRequirements: false,
      message: `File too large: ${formatFileSize(fileSize)} (max ${formatFileSize(STICKER_REQUIREMENTS.maxFileSize)})`,
    };
  }

  return {
    meetsRequirements: true,
    message: 'Meets WhatsApp sticker requirements',
  };
};
