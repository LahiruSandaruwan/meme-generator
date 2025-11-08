import { Platform } from 'react-native';

/**
 * Real AdMob Integration (Mobile Only)
 * IMPORTANT: Replace test IDs with your real AdMob unit IDs before production!
 *
 * Note: AdMob only works on iOS and Android. On web, this provides stub implementations.
 */

// Conditionally import AdMob only for native platforms
let mobileAds: any;
let InterstitialAd: any;
let RewardedAd: any;
let TestIds: any;
let AdEventType: any;
let RewardedAdEventType: any;

if (Platform.OS !== 'web') {
  const admob = require('react-native-google-mobile-ads');
  mobileAds = admob.default;
  InterstitialAd = admob.InterstitialAd;
  RewardedAd = admob.RewardedAd;
  TestIds = admob.TestIds;
  AdEventType = admob.AdEventType;
  RewardedAdEventType = admob.RewardedAdEventType;
}

// Ad Unit IDs - REPLACE THESE WITH YOUR REAL IDS IN PRODUCTION
const AD_UNIT_IDS = {
  android: {
    banner: Platform.OS !== 'web' ? TestIds?.BANNER : 'test-banner', // Replace with: 'ca-app-pub-XXXXX/XXXXX'
    interstitial: Platform.OS !== 'web' ? TestIds?.INTERSTITIAL : 'test-interstitial', // Replace with: 'ca-app-pub-XXXXX/XXXXX'
    rewarded: Platform.OS !== 'web' ? TestIds?.REWARDED : 'test-rewarded', // Replace with: 'ca-app-pub-XXXXX/XXXXX'
  },
  ios: {
    banner: Platform.OS !== 'web' ? TestIds?.BANNER : 'test-banner', // Replace with: 'ca-app-pub-XXXXX/XXXXX'
    interstitial: Platform.OS !== 'web' ? TestIds?.INTERSTITIAL : 'test-interstitial', // Replace with: 'ca-app-pub-XXXXX/XXXXX'
    rewarded: Platform.OS !== 'web' ? TestIds?.REWARDED : 'test-rewarded', // Replace with: 'ca-app-pub-XXXXX/XXXXX'
  },
};

class AdManager {
  private interstitialAd: any = null;
  private rewardedAd: any = null;
  private lastInterstitialTime: number = 0;
  private readonly INTERSTITIAL_FREQUENCY = 60000; // 1 minute minimum between interstitials
  private interstitialLoaded: boolean = false;
  private rewardedLoaded: boolean = false;
  private initialized: boolean = false;

  constructor() {
    this.initialize();
  }

  /**
   * Initialize AdMob (Native only - stub on web)
   */
  async initialize(): Promise<void> {
    try {
      if (this.initialized) return;

      // Skip initialization on web
      if (Platform.OS === 'web') {
        if (__DEV__) {
          console.log('[AdManager] Running on web - AdMob disabled');
        }
        this.initialized = true;
        return;
      }

      await mobileAds().initialize();

      // Pre-load interstitial and rewarded ads
      this.loadInterstitialAd();
      this.loadRewardedAd();

      this.initialized = true;
    } catch (error) {
      if (__DEV__) {
        // Silently handle in production
      }
    }
  }

  /**
   * Get banner ad unit ID for current platform
   */
  getBannerAdUnitId(): string {
    return Platform.OS === 'ios' ? AD_UNIT_IDS.ios.banner : AD_UNIT_IDS.android.banner;
  }

  /**
   * Load interstitial ad (Native only - stub on web)
   */
  private loadInterstitialAd(): void {
    // Skip on web
    if (Platform.OS === 'web') return;

    try {
      const adUnitId =
        Platform.OS === 'ios' ? AD_UNIT_IDS.ios.interstitial : AD_UNIT_IDS.android.interstitial;

      this.interstitialAd = InterstitialAd.createForAdRequest(adUnitId, {
        requestNonPersonalizedAdsOnly: false,
      });

      // Set up event listeners
      const unsubscribeLoaded = this.interstitialAd.addAdEventListener(
        AdEventType.LOADED,
        () => {
          this.interstitialLoaded = true;
        }
      );

      const unsubscribeClosed = this.interstitialAd.addAdEventListener(
        AdEventType.CLOSED,
        () => {
          this.interstitialLoaded = false;
          // Reload for next use
          this.loadInterstitialAd();
        }
      );

      // Start loading
      this.interstitialAd.load();
    } catch (error) {
      this.interstitialLoaded = false;
    }
  }

  /**
   * Show interstitial ad with frequency capping (Native only - stub on web)
   */
  async showInterstitialAd(): Promise<boolean> {
    // Skip on web
    if (Platform.OS === 'web') return false;

    try {
      if (!this.initialized) {
        await this.initialize();
      }

      // Frequency capping: Don't show ads too frequently
      const now = Date.now();
      if (now - this.lastInterstitialTime < this.INTERSTITIAL_FREQUENCY) {
        return false;
      }

      if (!this.interstitialAd || !this.interstitialLoaded) {
        // Try to reload if not loaded
        this.loadInterstitialAd();
        return false;
      }

      await this.interstitialAd.show();
      this.lastInterstitialTime = now;
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Load rewarded ad (Native only - stub on web)
   */
  private loadRewardedAd(): void {
    // Skip on web
    if (Platform.OS === 'web') return;

    try {
      const adUnitId =
        Platform.OS === 'ios' ? AD_UNIT_IDS.ios.rewarded : AD_UNIT_IDS.android.rewarded;

      this.rewardedAd = RewardedAd.createForAdRequest(adUnitId, {
        requestNonPersonalizedAdsOnly: false,
      });

      // Set up event listeners
      const unsubscribeLoaded = this.rewardedAd.addAdEventListener(
        RewardedAdEventType.LOADED,
        () => {
          this.rewardedLoaded = true;
        }
      );

      const unsubscribeClosed = this.rewardedAd.addAdEventListener(
        AdEventType.CLOSED,
        () => {
          this.rewardedLoaded = false;
          // Reload for next use
          this.loadRewardedAd();
        }
      );

      // Start loading
      this.rewardedAd.load();
    } catch (error) {
      this.rewardedLoaded = false;
    }
  }

  /**
   * Show rewarded ad (Native only - stub on web)
   * @param onRewarded Callback when user earns reward
   */
  async showRewardedAd(onRewarded: () => void): Promise<boolean> {
    // Skip on web
    if (Platform.OS === 'web') return false;

    try {
      if (!this.initialized) {
        await this.initialize();
      }

      if (!this.rewardedAd || !this.rewardedLoaded) {
        // Try to reload if not loaded
        this.loadRewardedAd();
        return false;
      }

      // Set up reward listener
      const unsubscribeEarned = this.rewardedAd.addAdEventListener(
        RewardedAdEventType.EARNED_REWARD,
        (reward) => {
          // User earned reward
          onRewarded();
        }
      );

      await this.rewardedAd.show();

      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Check if rewarded ad is ready
   */
  isRewardedAdReady(): boolean {
    return this.rewardedLoaded;
  }

  /**
   * Check if interstitial ad is ready
   */
  isInterstitialAdReady(): boolean {
    return this.interstitialLoaded;
  }

  /**
   * Preload ads (call when app starts)
   */
  preloadAds(): void {
    if (!this.interstitialLoaded) {
      this.loadInterstitialAd();
    }
    if (!this.rewardedLoaded) {
      this.loadRewardedAd();
    }
  }
}

// Export singleton instance
export const adManager = new AdManager();

/**
 * IMPORTANT: Before releasing to production, replace test IDs with your real AdMob IDs:
 *
 * 1. Go to https://admob.google.com
 * 2. Create your app and get ad unit IDs
 * 3. Replace the TestIds above with your actual IDs:
 *
 * Example:
 * const AD_UNIT_IDS = {
 *   android: {
 *     banner: 'ca-app-pub-1234567890123456/1234567890',
 *     interstitial: 'ca-app-pub-1234567890123456/1234567890',
 *     rewarded: 'ca-app-pub-1234567890123456/1234567890',
 *   },
 *   ios: {
 *     banner: 'ca-app-pub-1234567890123456/1234567890',
 *     interstitial: 'ca-app-pub-1234567890123456/1234567890',
 *     rewarded: 'ca-app-pub-1234567890123456/1234567890',
 *   },
 * };
 *
 * Also update app.json with your AdMob app IDs:
 * "androidAppId": "ca-app-pub-1234567890123456~1234567890",
 * "iosAppId": "ca-app-pub-1234567890123456~1234567890"
 */
