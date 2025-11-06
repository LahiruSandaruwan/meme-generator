import { Platform } from 'react-native';
import MobileAds, {
  InterstitialAd,
  RewardedAd,
  AdEventType,
  TestIds,
  RewardedAdEventType,
} from 'react-native-google-mobile-ads';
import { ADMOB_CONFIG, APP_CONFIG } from '../constants/config';
import { getLastAdTime, setLastAdTime } from './storage';

class AdManager {
  private interstitialAd: InterstitialAd | null = null;
  private rewardedAd: RewardedAd | null = null;
  private isInitialized = false;

  async initialize(): Promise<void> {
    try {
      if (this.isInitialized) return;

      await MobileAds().initialize();
      this.isInitialized = true;

      // Pre-load interstitial ad
      this.loadInterstitialAd();

      // Pre-load rewarded ad
      this.loadRewardedAd();
    } catch (error) {
      console.error('Error initializing AdMob:', error);
    }
  }

  private getAdUnitId(adType: 'banner' | 'interstitial' | 'rewarded'): string {
    const platform = Platform.OS === 'ios' ? 'ios' : 'android';
    return ADMOB_CONFIG[platform][adType];
  }

  getBannerAdUnitId(): string {
    return this.getAdUnitId('banner');
  }

  // Interstitial Ad Methods
  private loadInterstitialAd(): void {
    try {
      this.interstitialAd = InterstitialAd.createForAdRequest(
        this.getAdUnitId('interstitial')
      );

      this.interstitialAd.addAdEventListener(AdEventType.LOADED, () => {
        console.log('Interstitial ad loaded');
      });

      this.interstitialAd.addAdEventListener(AdEventType.CLOSED, () => {
        console.log('Interstitial ad closed');
        // Pre-load next ad
        this.loadInterstitialAd();
      });

      this.interstitialAd.addAdEventListener(AdEventType.ERROR, (error) => {
        console.error('Interstitial ad error:', error);
        // Try to reload after error
        setTimeout(() => this.loadInterstitialAd(), 5000);
      });

      this.interstitialAd.load();
    } catch (error) {
      console.error('Error loading interstitial ad:', error);
    }
  }

  async showInterstitialAd(): Promise<boolean> {
    try {
      // Check frequency cap
      const lastAdTime = await getLastAdTime();
      const timeSinceLastAd = Date.now() - lastAdTime;

      if (timeSinceLastAd < APP_CONFIG.interstitialAdFrequency) {
        console.log('Ad frequency cap reached, skipping ad');
        return false;
      }

      if (this.interstitialAd?.loaded) {
        await this.interstitialAd.show();
        await setLastAdTime();
        return true;
      } else {
        console.log('Interstitial ad not loaded yet');
        // Try to load if not already loaded
        this.loadInterstitialAd();
        return false;
      }
    } catch (error) {
      console.error('Error showing interstitial ad:', error);
      return false;
    }
  }

  // Rewarded Ad Methods
  private loadRewardedAd(): void {
    try {
      this.rewardedAd = RewardedAd.createForAdRequest(
        this.getAdUnitId('rewarded')
      );

      this.rewardedAd.addAdEventListener(RewardedAdEventType.LOADED, () => {
        console.log('Rewarded ad loaded');
      });

      this.rewardedAd.addAdEventListener(RewardedAdEventType.EARNED_REWARD, (reward) => {
        console.log('User earned reward:', reward);
      });

      this.rewardedAd.addAdEventListener(AdEventType.CLOSED, () => {
        console.log('Rewarded ad closed');
        // Pre-load next ad
        this.loadRewardedAd();
      });

      this.rewardedAd.addAdEventListener(AdEventType.ERROR, (error) => {
        console.error('Rewarded ad error:', error);
        // Try to reload after error
        setTimeout(() => this.loadRewardedAd(), 5000);
      });

      this.rewardedAd.load();
    } catch (error) {
      console.error('Error loading rewarded ad:', error);
    }
  }

  async showRewardedAd(onRewarded: () => void): Promise<boolean> {
    try {
      if (this.rewardedAd?.loaded) {
        // Set up one-time reward listener
        const unsubscribe = this.rewardedAd.addAdEventListener(
          RewardedAdEventType.EARNED_REWARD,
          () => {
            onRewarded();
            unsubscribe();
          }
        );

        await this.rewardedAd.show();
        return true;
      } else {
        console.log('Rewarded ad not loaded yet');
        // Try to load if not already loaded
        this.loadRewardedAd();
        return false;
      }
    } catch (error) {
      console.error('Error showing rewarded ad:', error);
      return false;
    }
  }

  isRewardedAdReady(): boolean {
    return this.rewardedAd?.loaded ?? false;
  }
}

// Export singleton instance
export const adManager = new AdManager();
