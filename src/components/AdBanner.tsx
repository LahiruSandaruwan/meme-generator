import React from 'react';
import { View, StyleSheet } from 'react-native';
import { BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';
import { adManager } from '../utils/adManager';
import { colors } from '../constants/colors';

/**
 * AdBanner component for native platforms (iOS & Android)
 * For web, AdBanner.web.tsx is automatically used (returns null)
 */

interface AdBannerProps {
  style?: any;
}

export const AdBanner: React.FC<AdBannerProps> = ({ style }) => {
  return (
    <View style={[styles.container, style]}>
      <BannerAd
        unitId={adManager.getBannerAdUnitId()}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        requestOptions={{
          requestNonPersonalizedAdsOnly: false,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
});
