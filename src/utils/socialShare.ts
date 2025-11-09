/**
 * Enhanced Social Media Sharing (100% FREE)
 * Uses native share sheets and deep links
 * No paid APIs required
 */

import * as Sharing from 'expo-sharing';
import { Platform, Alert } from 'react-native';

export interface ShareOptions {
  title?: string;
  message?: string;
  hashtags?: string[];
}

/**
 * Share to any platform using native share sheet
 */
export const shareToAny = async (
  imageUri: string,
  options?: ShareOptions
): Promise<boolean> => {
  try {
    const isAvailable = await Sharing.isAvailableAsync();

    if (!isAvailable) {
      Alert.alert('Error', 'Sharing is not available on this device');
      return false;
    }

    let message = options?.message || '';
    if (options?.hashtags && options.hashtags.length > 0) {
      message += '\n\n' + options.hashtags.map(tag => `#${tag}`).join(' ');
    }

    await Sharing.shareAsync(imageUri, {
      mimeType: 'image/jpeg',
      dialogTitle: options?.title || 'Share your meme',
      UTI: 'public.jpeg',
    });

    return true;
  } catch (error) {
    if (__DEV__) {
      console.error('Error sharing:', error);
    }
    return false;
  }
};

/**
 * Get platform-optimized caption
 */
export const getPlatformCaption = (
  platform: 'instagram' | 'twitter' | 'facebook' | 'whatsapp' | 'tiktok',
  baseMessage?: string
): string => {
  const message = baseMessage || 'Check out this meme! 😂';

  const hashtags = {
    instagram: '#meme #funny #lol #memes #comedy #viral',
    twitter: '#meme #funny #lol',
    facebook: '',
    whatsapp: '',
    tiktok: '#meme #funny #fyp #viral #comedy',
  };

  return `${message}\n\n${hashtags[platform]}`;
};

/**
 * Get suggested hashtags based on template name
 */
export const getSuggestedHashtags = (templateName?: string): string[] => {
  const baseHashtags = ['meme', 'funny', 'lol', 'memes'];

  if (!templateName) {
    return baseHashtags;
  }

  const name = templateName.toLowerCase();

  // Add specific hashtags based on template
  if (name.includes('drake')) {
    return [...baseHashtags, 'drake', 'drakehotlinebling'];
  }
  if (name.includes('distracted')) {
    return [...baseHashtags, 'distractedboyfriend', 'relationshipmemes'];
  }
  if (name.includes('dog') || name.includes('doge')) {
    return [...baseHashtags, 'dogememe', 'dogs', 'dogmemes'];
  }
  if (name.includes('cat')) {
    return [...baseHashtags, 'catmeme', 'cats', 'catmemes'];
  }
  if (name.includes('spongebob')) {
    return [...baseHashtags, 'spongebob', 'spongebobmemes', 'nickelodeon'];
  }
  if (name.includes('office') || name.includes('work')) {
    return [...baseHashtags, 'officememes', 'work', 'worklife'];
  }
  if (name.includes('game') || name.includes('gaming')) {
    return [...baseHashtags, 'gaming', 'gamermemes', 'gamer'];
  }

  return baseHashtags;
};

/**
 * Platform-specific share configuration
 */
export const getPlatformConfig = (platform: string) => {
  const configs = {
    instagram: {
      name: 'Instagram',
      icon: 'logo-instagram',
      color: '#E4405F',
      instructions: 'Save to camera roll, then share to Instagram Stories or Feed',
      recommendedSize: '1080x1080',
    },
    facebook: {
      name: 'Facebook',
      icon: 'logo-facebook',
      color: '#1877F2',
      instructions: 'Share directly to Facebook',
      recommendedSize: '1200x630',
    },
    twitter: {
      name: 'Twitter',
      icon: 'logo-twitter',
      color: '#1DA1F2',
      instructions: 'Share directly to Twitter',
      recommendedSize: '1200x675',
    },
    whatsapp: {
      name: 'WhatsApp',
      icon: 'logo-whatsapp',
      color: '#25D366',
      instructions: 'Share directly to WhatsApp',
      recommendedSize: '1080x1080',
    },
    reddit: {
      name: 'Reddit',
      icon: 'logo-reddit',
      color: '#FF4500',
      instructions: 'Save and upload to Reddit',
      recommendedSize: '1080x1080',
    },
    tiktok: {
      name: 'TikTok',
      icon: 'musical-notes',
      color: '#000000',
      instructions: 'Save to camera roll, then upload to TikTok',
      recommendedSize: '1080x1920',
    },
    snapchat: {
      name: 'Snapchat',
      icon: 'logo-snapchat',
      color: '#FFFC00',
      instructions: 'Save to camera roll, then share to Snapchat',
      recommendedSize: '1080x1920',
    },
  };

  return configs[platform as keyof typeof configs] || configs.instagram;
};

/**
 * Get sharing tips
 */
export const getSharingTips = (): string[] => {
  return [
    '🎯 Use trending hashtags to increase reach',
    '⏰ Post during peak hours (6-9 PM)',
    '📝 Add a funny caption or question',
    '🏷️ Tag friends who will relate',
    '🔁 Cross-post to multiple platforms',
    '💬 Engage with comments quickly',
    '🎨 Memes with text perform better',
    '😂 Relatable content gets more shares',
  ];
};

/**
 * Platform availability check
 */
export const checkPlatformAvailability = async (): Promise<{
  canShare: boolean;
  installedApps: string[];
}> => {
  const canShare = await Sharing.isAvailableAsync();

  // On mobile, assume common apps are available
  const commonApps = Platform.select({
    ios: ['instagram', 'facebook', 'twitter', 'whatsapp', 'snapchat', 'tiktok'],
    android: ['instagram', 'facebook', 'twitter', 'whatsapp', 'snapchat', 'tiktok'],
    default: [],
  });

  return {
    canShare,
    installedApps: commonApps || [],
  };
};

/**
 * Generate share analytics
 */
export interface ShareAnalytics {
  platform: string;
  timestamp: number;
  memeId: string;
}

let shareHistory: ShareAnalytics[] = [];

export const trackShare = (platform: string, memeId: string): void => {
  shareHistory.push({
    platform,
    timestamp: Date.now(),
    memeId,
  });

  // Keep only last 100 shares
  if (shareHistory.length > 100) {
    shareHistory = shareHistory.slice(-100);
  }
};

export const getShareStats = (): {
  totalShares: number;
  platformBreakdown: Record<string, number>;
  mostSharedPlatform: string;
} => {
  const platformBreakdown: Record<string, number> = {};

  shareHistory.forEach(share => {
    platformBreakdown[share.platform] = (platformBreakdown[share.platform] || 0) + 1;
  });

  const mostSharedPlatform = Object.entries(platformBreakdown).reduce(
    (max, [platform, count]) =>
      count > (platformBreakdown[max] || 0) ? platform : max,
    'none'
  );

  return {
    totalShares: shareHistory.length,
    platformBreakdown,
    mostSharedPlatform,
  };
};
