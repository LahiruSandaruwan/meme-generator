import { ExpoConfig, ConfigContext } from '@expo/config';

/**
 * Expo App Configuration
 * This file uses environment variables to configure the app for different environments
 *
 * Environment files:
 * - .env.development - Development configuration with test IDs
 * - .env.production - Production configuration with real IDs
 *
 * To build for production, set APP_ENV=production in your environment
 */

export default ({ config }: ConfigContext): ExpoConfig => {
  // Determine environment (default to development)
  const isDevelopment = process.env.APP_ENV !== 'production';
  const environment = isDevelopment ? 'development' : 'production';

  // Load environment-specific values
  const appName = process.env.APP_NAME || 'Meme Generator';
  const appVersion = process.env.APP_VERSION || '1.0.0';
  const iosBundleId = process.env.APP_BUNDLE_ID_IOS || 'com.memegen.app';
  const androidPackage = process.env.APP_BUNDLE_ID_ANDROID || 'com.memegen.app';

  // AdMob Configuration
  const admobIosAppId = process.env.ADMOB_IOS_APP_ID || 'ca-app-pub-3940256099942544~1458002511';
  const admobAndroidAppId = process.env.ADMOB_ANDROID_APP_ID || 'ca-app-pub-3940256099942544~3347511713';

  // Sentry Configuration
  const sentryDsn = process.env.SENTRY_DSN || '';
  const sentryOrg = process.env.SENTRY_ORG || '';
  const sentryProject = process.env.SENTRY_PROJECT || '';

  console.log(`📱 Building for: ${environment}`);
  console.log(`📦 App Version: ${appVersion}`);
  console.log(`🏷️  Bundle ID (iOS): ${iosBundleId}`);
  console.log(`🏷️  Package (Android): ${androidPackage}`);

  return {
    ...config,
    name: appName,
    slug: 'meme-generator',
    version: appVersion,
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'light',
    splash: {
      image: './assets/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#FF6B6B',
    },
    assetBundlePatterns: ['**/*'],
    ios: {
      supportsTablet: true,
      bundleIdentifier: iosBundleId,
      infoPlist: {
        NSPhotoLibraryUsageDescription:
          'This app needs access to your photo library to save and share your memes.',
        NSCameraUsageDescription:
          'This app needs access to your camera to take photos for custom memes.',
        NSPhotoLibraryAddUsageDescription:
          'This app needs permission to save memes to your photo library.',
        NSMicrophoneUsageDescription:
          'This app needs access to your microphone for voice commands.',
        NSSpeechRecognitionUsageDescription:
          'This app uses speech recognition to add text to your memes by voice.',
      },
      buildNumber: '1',
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#FF6B6B',
      },
      package: androidPackage,
      permissions: [
        'CAMERA',
        'READ_EXTERNAL_STORAGE',
        'WRITE_EXTERNAL_STORAGE',
        'READ_MEDIA_IMAGES',
        'RECORD_AUDIO',
      ],
      versionCode: 1,
    },
    web: {
      favicon: './assets/favicon.png',
      bundler: 'metro',
    },
    plugins: [
      [
        'expo-image-picker',
        {
          photosPermission: 'The app needs access to your photos to let you create custom memes.',
        },
      ],
      [
        'expo-media-library',
        {
          photosPermission: 'Allow Meme Generator to save your created memes.',
          savePhotosPermission: 'Allow Meme Generator to save memes to your photos.',
        },
      ],
      [
        'react-native-google-mobile-ads',
        {
          androidAppId: admobAndroidAppId,
          iosAppId: admobIosAppId,
        },
      ],
      'expo-asset',
      // Sentry plugin (only in production if configured)
      ...(sentryDsn && !isDevelopment
        ? [
            [
              '@sentry/react-native/expo',
              {
                organization: sentryOrg,
                project: sentryProject,
              },
            ],
          ]
        : []),
    ],
    extra: {
      // Make environment variables available to the app via expo-constants
      environment,
      isDevelopment,
      admob: {
        iosBannerId: process.env.ADMOB_IOS_BANNER_ID,
        androidBannerId: process.env.ADMOB_ANDROID_BANNER_ID,
        iosInterstitialId: process.env.ADMOB_IOS_INTERSTITIAL_ID,
        androidInterstitialId: process.env.ADMOB_ANDROID_INTERSTITIAL_ID,
        iosRewardedId: process.env.ADMOB_IOS_REWARDED_ID,
        androidRewardedId: process.env.ADMOB_ANDROID_REWARDED_ID,
      },
      sentry: {
        dsn: sentryDsn,
        enabled: process.env.ENABLE_CRASH_REPORTING === 'true',
      },
      analytics: {
        firebaseProjectId: process.env.FIREBASE_PROJECT_ID,
        firebaseApiKey: process.env.FIREBASE_API_KEY,
        firebaseAppId: process.env.FIREBASE_APP_ID,
        enabled: process.env.ENABLE_ANALYTICS === 'true',
      },
      api: {
        baseUrl: process.env.API_BASE_URL,
        timeout: parseInt(process.env.API_TIMEOUT || '30000', 10),
      },
      features: {
        freemiumMemeLimit: parseInt(process.env.FREEMIUM_MEME_LIMIT || '5', 10),
        premiumPrice: parseFloat(process.env.PREMIUM_PRICE_USD || '4.99'),
      },
      eas: {
        projectId: process.env.EAS_PROJECT_ID || '',
      },
    },
    owner: process.env.EXPO_OWNER,
  };
};
