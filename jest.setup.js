// Jest setup file
import '@testing-library/jest-native/extend-expect';

// Mock Expo Winter runtime
global.__ExpoImportMetaRegistry = {};

// Polyfill structuredClone for Jest environment
if (typeof global.structuredClone === 'undefined') {
  global.structuredClone = (obj) => JSON.parse(JSON.stringify(obj));
}

// Mock Expo Constants
const mockExpoConfig = {
  extra: {
    environment: 'test',
    isDevelopment: true,
    admob: {
      iosBannerId: 'test-banner-id',
      androidBannerId: 'test-banner-id',
      iosInterstitialId: 'test-interstitial-id',
      androidInterstitialId: 'test-interstitial-id',
      iosRewardedId: 'test-rewarded-id',
      androidRewardedId: 'test-rewarded-id',
    },
    sentry: {
      dsn: '',
      enabled: false,
    },
    analytics: {
      enabled: false,
    },
    api: {
      baseUrl: 'https://test-api.example.com',
      timeout: 30000,
    },
    features: {
      freemiumMemeLimit: 5,
      premiumPrice: 4.99,
    },
  },
};

jest.mock('expo-constants', () => ({
  __esModule: true,
  default: {
    expoConfig: mockExpoConfig,
  },
  expoConfig: mockExpoConfig,
}));

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// Mock react-native-google-mobile-ads
jest.mock('react-native-google-mobile-ads', () => ({
  __esModule: true,
  default: jest.fn(),
  MobileAds: jest.fn(() => ({
    initialize: jest.fn(() => Promise.resolve()),
    setRequestConfiguration: jest.fn(),
  })),
  TestIds: {
    BANNER: 'test-banner-id',
    INTERSTITIAL: 'test-interstitial-id',
    REWARDED: 'test-rewarded-id',
  },
  BannerAd: jest.fn(),
  InterstitialAd: {
    createForAdRequest: jest.fn(() => ({
      load: jest.fn(),
      show: jest.fn(),
      addAdEventListener: jest.fn(),
    })),
  },
  RewardedAd: {
    createForAdRequest: jest.fn(() => ({
      load: jest.fn(),
      show: jest.fn(),
      addAdEventListener: jest.fn(),
    })),
  },
  AdEventType: {
    LOADED: 'loaded',
    CLOSED: 'closed',
    ERROR: 'error',
  },
  RewardedAdEventType: {
    LOADED: 'loaded',
    EARNED_REWARD: 'earned_reward',
    CLOSED: 'closed',
  },
}));

// Mock Expo modules
jest.mock('expo-image-picker', () => ({
  launchImageLibraryAsync: jest.fn(),
  launchCameraAsync: jest.fn(),
  MediaTypeOptions: {
    Images: 'Images',
  },
}));

jest.mock('expo-media-library', () => ({
  requestPermissionsAsync: jest.fn(() => Promise.resolve({ status: 'granted' })),
  saveToLibraryAsync: jest.fn(() => Promise.resolve()),
  getAssetsAsync: jest.fn(() => Promise.resolve({ assets: [] })),
}));

jest.mock('expo-file-system', () => ({
  documentDirectory: 'file://test/',
  cacheDirectory: 'file://test/cache/',
  readAsStringAsync: jest.fn(),
  writeAsStringAsync: jest.fn(),
  deleteAsync: jest.fn(),
  getInfoAsync: jest.fn(),
  makeDirectoryAsync: jest.fn(),
}));

jest.mock('expo-sharing', () => ({
  shareAsync: jest.fn(() => Promise.resolve()),
  isAvailableAsync: jest.fn(() => Promise.resolve(true)),
}));

jest.mock('expo-image-manipulator', () => ({
  manipulateAsync: jest.fn((uri) => Promise.resolve({ uri })),
  FlipType: {},
  SaveFormat: {
    JPEG: 'jpeg',
    PNG: 'png',
  },
}));

jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(),
  notificationAsync: jest.fn(),
  selectionAsync: jest.fn(),
  ImpactFeedbackStyle: {
    Light: 'light',
    Medium: 'medium',
    Heavy: 'heavy',
  },
}));

// Mock Sentry
jest.mock('@sentry/react-native', () => ({
  init: jest.fn(),
  captureException: jest.fn(),
  captureMessage: jest.fn(),
  setUser: jest.fn(),
  setTag: jest.fn(),
  setContext: jest.fn(),
  addBreadcrumb: jest.fn(),
  startTransaction: jest.fn(() => ({
    finish: jest.fn(),
    setStatus: jest.fn(),
  })),
  ReactNativeTracing: jest.fn(),
  ReactNavigationInstrumentation: jest.fn(),
}));

// Mock react-navigation
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({
    navigate: jest.fn(),
    goBack: jest.fn(),
    dispatch: jest.fn(),
  }),
  useRoute: () => ({
    params: {},
  }),
}));

// Silence console warnings in tests
global.console = {
  ...console,
  warn: jest.fn(),
  error: jest.fn(),
};

// Mock global __DEV__
global.__DEV__ = true;
