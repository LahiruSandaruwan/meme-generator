/**
 * AdMob Stub for Web Platform
 *
 * AdMob is not supported on web, so this provides stub implementations
 * that do nothing but prevent errors.
 */

class AdManager {
  private initialized: boolean = false;

  constructor() {
    this.initialize();
  }

  /**
   * Initialize AdMob (stub - does nothing on web)
   */
  async initialize(): Promise<void> {
    if (this.initialized) return;

    if (__DEV__) {
      console.log('[AdManager] Running on web - AdMob disabled');
    }

    this.initialized = true;
  }

  /**
   * Get banner ad unit ID (stub - returns test ID)
   */
  getBannerAdUnitId(): string {
    return 'ca-app-pub-test-banner-web';
  }

  /**
   * Show interstitial ad (stub - does nothing on web)
   */
  async showInterstitialAd(): Promise<boolean> {
    return false;
  }

  /**
   * Show rewarded ad (stub - does nothing on web)
   */
  async showRewardedAd(onRewarded: () => void): Promise<boolean> {
    return false;
  }
}

// Export singleton instance
export const adManager = new AdManager();
