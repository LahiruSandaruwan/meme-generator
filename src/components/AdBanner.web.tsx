import React from 'react';

/**
 * AdBanner stub for web
 * AdMob is not supported on web, so this returns null
 */

interface AdBannerProps {
  style?: any;
}

export const AdBanner: React.FC<AdBannerProps> = ({ style }) => {
  // Don't render ads on web
  return null;
};
