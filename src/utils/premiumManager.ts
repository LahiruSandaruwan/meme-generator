import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Premium Manager
 * Handles freemium model: First 10 memes free, then watermark/ads/premium
 */

const STORAGE_KEYS = {
  MEME_COUNT: '@memeCount',
  IS_PREMIUM: '@isPremium',
  PREMIUM_EXPIRY: '@premiumExpiry',
  REWARDED_AD_USES: '@rewardedAdUses',
  LAST_AD_DATE: '@lastAdDate',
};

export interface PremiumStatus {
  isPremium: boolean;
  memeCount: number;
  canCreateWithoutWatermark: boolean;
  needsUpgrade: boolean;
  daysRemaining?: number;
}

class PremiumManager {
  private static instance: PremiumManager;
  private memeCount: number = 0;
  private isPremium: boolean = false;
  private premiumExpiry: number = 0;

  private constructor() {
    this.initialize();
  }

  public static getInstance(): PremiumManager {
    if (!PremiumManager.instance) {
      PremiumManager.instance = new PremiumManager();
    }
    return PremiumManager.instance;
  }

  private async initialize() {
    try {
      const [countStr, premiumStr, expiryStr] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.MEME_COUNT),
        AsyncStorage.getItem(STORAGE_KEYS.IS_PREMIUM),
        AsyncStorage.getItem(STORAGE_KEYS.PREMIUM_EXPIRY),
      ]);

      this.memeCount = countStr ? parseInt(countStr, 10) : 0;
      this.isPremium = premiumStr === 'true';
      this.premiumExpiry = expiryStr ? parseInt(expiryStr, 10) : 0;

      // Check if premium has expired
      if (this.isPremium && this.premiumExpiry > 0 && Date.now() > this.premiumExpiry) {
        this.isPremium = false;
        await AsyncStorage.setItem(STORAGE_KEYS.IS_PREMIUM, 'false');
      }
    } catch (error) {
      // Silently handle initialization errors
    }
  }

  /**
   * Get current premium status
   */
  public async getStatus(): Promise<PremiumStatus> {
    await this.initialize();

    const canCreateWithoutWatermark = this.isPremium || this.memeCount < 10;
    const needsUpgrade = !this.isPremium && this.memeCount >= 10;

    let daysRemaining: number | undefined;
    if (this.isPremium && this.premiumExpiry > 0) {
      const msRemaining = this.premiumExpiry - Date.now();
      daysRemaining = Math.ceil(msRemaining / (1000 * 60 * 60 * 24));
    }

    return {
      isPremium: this.isPremium,
      memeCount: this.memeCount,
      canCreateWithoutWatermark,
      needsUpgrade,
      daysRemaining,
    };
  }

  /**
   * Increment meme count when user saves a meme
   */
  public async incrementMemeCount(): Promise<void> {
    this.memeCount += 1;
    await AsyncStorage.setItem(STORAGE_KEYS.MEME_COUNT, this.memeCount.toString());
  }

  /**
   * Check if user should see watermark
   */
  public async shouldShowWatermark(): Promise<boolean> {
    await this.initialize();
    return !this.isPremium && this.memeCount >= 10;
  }

  /**
   * Upgrade to premium (for in-app purchase)
   * @param duration Duration in days (0 = lifetime)
   */
  public async upgradeToPremium(duration: number = 0): Promise<void> {
    this.isPremium = true;

    if (duration > 0) {
      this.premiumExpiry = Date.now() + duration * 24 * 60 * 60 * 1000;
      await AsyncStorage.setItem(STORAGE_KEYS.PREMIUM_EXPIRY, this.premiumExpiry.toString());
    } else {
      this.premiumExpiry = 0; // Lifetime
      await AsyncStorage.setItem(STORAGE_KEYS.PREMIUM_EXPIRY, '0');
    }

    await AsyncStorage.setItem(STORAGE_KEYS.IS_PREMIUM, 'true');
  }

  /**
   * Remove watermark for current meme (after watching rewarded ad)
   * @returns true if watermark can be removed
   */
  public async canRemoveWatermarkWithAd(): Promise<boolean> {
    // User can always watch ad to remove watermark
    return !this.isPremium && this.memeCount >= 10;
  }

  /**
   * Track rewarded ad usage
   */
  public async trackRewardedAdUse(): Promise<void> {
    try {
      const today = new Date().toDateString();
      const lastAdDate = await AsyncStorage.getItem(STORAGE_KEYS.LAST_AD_DATE);
      const rewardedUses = await AsyncStorage.getItem(STORAGE_KEYS.REWARDED_AD_USES);

      let count = rewardedUses ? parseInt(rewardedUses, 10) : 0;

      // Reset count if it's a new day
      if (lastAdDate !== today) {
        count = 0;
        await AsyncStorage.setItem(STORAGE_KEYS.LAST_AD_DATE, today);
      }

      count += 1;
      await AsyncStorage.setItem(STORAGE_KEYS.REWARDED_AD_USES, count.toString());
    } catch (error) {
      // Silently handle tracking errors
    }
  }

  /**
   * Get rewarded ad usage count for today
   */
  public async getRewardedAdUsageToday(): Promise<number> {
    try {
      const today = new Date().toDateString();
      const lastAdDate = await AsyncStorage.getItem(STORAGE_KEYS.LAST_AD_DATE);

      if (lastAdDate !== today) {
        return 0;
      }

      const rewardedUses = await AsyncStorage.getItem(STORAGE_KEYS.REWARDED_AD_USES);
      return rewardedUses ? parseInt(rewardedUses, 10) : 0;
    } catch (error) {
      return 0;
    }
  }

  /**
   * Reset premium status (for testing)
   */
  public async reset(): Promise<void> {
    this.memeCount = 0;
    this.isPremium = false;
    this.premiumExpiry = 0;

    await Promise.all([
      AsyncStorage.setItem(STORAGE_KEYS.MEME_COUNT, '0'),
      AsyncStorage.setItem(STORAGE_KEYS.IS_PREMIUM, 'false'),
      AsyncStorage.setItem(STORAGE_KEYS.PREMIUM_EXPIRY, '0'),
      AsyncStorage.removeItem(STORAGE_KEYS.REWARDED_AD_USES),
      AsyncStorage.removeItem(STORAGE_KEYS.LAST_AD_DATE),
    ]);
  }

  /**
   * Get premium features list
   */
  public getPremiumFeatures(): string[] {
    return [
      'Unlimited memes without watermark',
      'Ad-free experience',
      'Exclusive premium templates (20+)',
      'Advanced text effects',
      'Multi-panel meme creator',
      'Voice-to-text meme creation',
      'Priority support',
      'Early access to new features',
    ];
  }

  /**
   * Get pricing options
   */
  public getPricingOptions(): Array<{
    id: string;
    title: string;
    price: string;
    duration: string;
    savings?: string;
    popular?: boolean;
  }> {
    return [
      {
        id: 'monthly',
        title: 'Monthly',
        price: '$4.99',
        duration: 'per month',
      },
      {
        id: 'yearly',
        title: 'Yearly',
        price: '$29.99',
        duration: 'per year',
        savings: 'Save 50%',
        popular: true,
      },
      {
        id: 'lifetime',
        title: 'Lifetime',
        price: '$49.99',
        duration: 'one-time',
        savings: 'Best Value',
      },
    ];
  }
}

// Export singleton instance
export const premiumManager = PremiumManager.getInstance();
