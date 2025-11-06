// AdMob Configuration
// IMPORTANT: These are TEST ad unit IDs. Replace with your real AdMob IDs before production!
// Get your AdMob IDs from: https://apps.admob.com/

export const ADMOB_CONFIG = {
  // Android Test Ad Units
  android: {
    banner: 'ca-app-pub-3940256099942544/6300978111',
    interstitial: 'ca-app-pub-3940256099942544/1033173712',
    rewarded: 'ca-app-pub-3940256099942544/5224854917',
  },
  // iOS Test Ad Units
  ios: {
    banner: 'ca-app-pub-3940256099942544/2934735716',
    interstitial: 'ca-app-pub-3940256099942544/4411468910',
    rewarded: 'ca-app-pub-3940256099942544/1712485313',
  },
};

// App Configuration
export const APP_CONFIG = {
  appName: 'Meme Generator',
  version: '1.0.0',
  watermarkText: 'Made with MemeGen',
  interstitialAdFrequency: 60000, // 1 minute in milliseconds
  maxMemeWidth: 800,
  maxMemeHeight: 800,
  imageQuality: 0.9,
};

// Meme Text Configuration
export const TEXT_CONFIG = {
  defaultFontSize: 40,
  minFontSize: 20,
  maxFontSize: 80,
  defaultColor: '#FFFFFF',
  defaultStrokeColor: '#000000',
  defaultStrokeWidth: 3,
};
