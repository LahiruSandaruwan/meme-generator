// Ads disabled - mock implementation
class AdManager {
  async initialize(): Promise<void> {
    // Ads disabled
  }

  getBannerAdUnitId(): string {
    return '';
  }

  async showInterstitialAd(): Promise<boolean> {
    return false;
  }

  async showRewardedAd(onRewarded: () => void): Promise<boolean> {
    return false;
  }

  isRewardedAdReady(): boolean {
    return false;
  }
}

// Export singleton instance
export const adManager = new AdManager();
