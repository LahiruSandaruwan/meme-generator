/**
 * Environment Configuration
 * Access environment variables configured in app.config.ts
 */

import Constants from 'expo-constants';
import { Platform } from 'react-native';

/**
 * Type-safe environment configuration
 */
interface AppConfig {
  environment: 'development' | 'production';
  isDevelopment: boolean;
  admob: {
    bannerId: string;
    interstitialId: string;
    rewardedId: string;
  };
  sentry: {
    dsn: string;
    enabled: boolean;
  };
  analytics: {
    firebaseProjectId: string;
    firebaseApiKey: string;
    firebaseAppId: string;
    enabled: boolean;
  };
  api: {
    baseUrl: string;
    timeout: number;
  };
  features: {
    freemiumMemeLimit: number;
    premiumPrice: number;
  };
}

/**
 * Get the environment configuration
 */
const getConfig = (): AppConfig => {
  const extra = Constants.expoConfig?.extra || {};

  // Platform-specific AdMob IDs
  const isIOS = Platform.OS === 'ios';
  const bannerId = isIOS
    ? extra.admob?.iosBannerId
    : extra.admob?.androidBannerId;
  const interstitialId = isIOS
    ? extra.admob?.iosInterstitialId
    : extra.admob?.androidInterstitialId;
  const rewardedId = isIOS
    ? extra.admob?.iosRewardedId
    : extra.admob?.androidRewardedId;

  return {
    environment: extra.environment || 'development',
    isDevelopment: extra.isDevelopment !== false,
    admob: {
      bannerId: bannerId || '',
      interstitialId: interstitialId || '',
      rewardedId: rewardedId || '',
    },
    sentry: {
      dsn: extra.sentry?.dsn || '',
      enabled: extra.sentry?.enabled === true,
    },
    analytics: {
      firebaseProjectId: extra.analytics?.firebaseProjectId || '',
      firebaseApiKey: extra.analytics?.firebaseApiKey || '',
      firebaseAppId: extra.analytics?.firebaseAppId || '',
      enabled: extra.analytics?.enabled === true,
    },
    api: {
      baseUrl: extra.api?.baseUrl || 'https://api.example.com',
      timeout: extra.api?.timeout || 30000,
    },
    features: {
      freemiumMemeLimit: extra.features?.freemiumMemeLimit || 5,
      premiumPrice: extra.features?.premiumPrice || 4.99,
    },
  };
};

/**
 * Exported configuration object
 */
export const ENV_CONFIG = getConfig();

/**
 * Helper functions
 */
export const isProduction = () => ENV_CONFIG.environment === 'production';
export const isDevelopment = () => ENV_CONFIG.isDevelopment;
export const isSentryEnabled = () => ENV_CONFIG.sentry.enabled && !!ENV_CONFIG.sentry.dsn;
export const isAnalyticsEnabled = () => ENV_CONFIG.analytics.enabled;

/**
 * Log configuration on app start (development only)
 */
if (__DEV__) {
  console.log('📱 App Configuration:', {
    environment: ENV_CONFIG.environment,
    isDevelopment: ENV_CONFIG.isDevelopment,
    sentryEnabled: isSentryEnabled(),
    analyticsEnabled: isAnalyticsEnabled(),
    freemiumLimit: ENV_CONFIG.features.freemiumMemeLimit,
  });
}

export default ENV_CONFIG;
