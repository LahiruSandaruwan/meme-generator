/**
 * Environment Configuration Tests
 * Tests for environment variable access and helpers
 */

import ENV_CONFIG, {
  isProduction,
  isDevelopment,
  isSentryEnabled,
  isAnalyticsEnabled,
} from '../env';

describe('Environment Configuration', () => {
  it('should load configuration from expo constants', () => {
    expect(ENV_CONFIG).toBeDefined();
    expect(ENV_CONFIG.environment).toBe('test');
    expect(ENV_CONFIG.isDevelopment).toBe(true);
  });

  it('should have AdMob configuration', () => {
    expect(ENV_CONFIG.admob).toBeDefined();
    expect(ENV_CONFIG.admob.bannerId).toBe('test-banner-id');
    expect(ENV_CONFIG.admob.interstitialId).toBe('test-interstitial-id');
    expect(ENV_CONFIG.admob.rewardedId).toBe('test-rewarded-id');
  });

  it('should have Sentry configuration', () => {
    expect(ENV_CONFIG.sentry).toBeDefined();
    expect(ENV_CONFIG.sentry.enabled).toBe(false);
    expect(ENV_CONFIG.sentry.dsn).toBe('');
  });

  it('should have Analytics configuration', () => {
    expect(ENV_CONFIG.analytics).toBeDefined();
    expect(ENV_CONFIG.analytics.enabled).toBe(false);
  });

  it('should have API configuration', () => {
    expect(ENV_CONFIG.api).toBeDefined();
    expect(ENV_CONFIG.api.baseUrl).toBe('https://test-api.example.com');
    expect(ENV_CONFIG.api.timeout).toBe(30000);
  });

  it('should have feature configuration', () => {
    expect(ENV_CONFIG.features).toBeDefined();
    expect(ENV_CONFIG.features.freemiumMemeLimit).toBe(5);
    expect(ENV_CONFIG.features.premiumPrice).toBe(4.99);
  });

  describe('Helper Functions', () => {
    it('isProduction should return false in test environment', () => {
      expect(isProduction()).toBe(false);
    });

    it('isDevelopment should return true in test environment', () => {
      expect(isDevelopment()).toBe(true);
    });

    it('isSentryEnabled should return false when Sentry is disabled', () => {
      expect(isSentryEnabled()).toBe(false);
    });

    it('isAnalyticsEnabled should return false when analytics is disabled', () => {
      expect(isAnalyticsEnabled()).toBe(false);
    });
  });
});
