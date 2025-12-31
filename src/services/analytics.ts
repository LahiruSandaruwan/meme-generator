/**
 * Analytics Service
 * Centralized analytics tracking using Firebase Analytics
 */

import { ENV_CONFIG, isAnalyticsEnabled } from '../config/env';
import { logError } from './errorTracking';

// Lazy import Firebase Analytics to avoid errors when not configured
let analytics: any = null;

/**
 * Initialize Firebase Analytics
 * Call this once at app startup
 */
export const initializeAnalytics = async (): Promise<void> => {
  if (!isAnalyticsEnabled()) {
    console.log('📊 Analytics disabled in this environment');
    return;
  }

  try {
    // Dynamically import Firebase Analytics
    const firebaseAnalytics = await import('@react-native-firebase/analytics');
    analytics = firebaseAnalytics.default();

    // Set analytics collection enabled
    await analytics.setAnalyticsCollectionEnabled(true);

    console.log('✅ Firebase Analytics initialized successfully');
  } catch (error) {
    console.error('❌ Failed to initialize Firebase Analytics:', error);
    // Don't throw - analytics failure shouldn't crash the app
  }
};

/**
 * Log a custom analytics event
 * @param eventName - Event name (use snake_case)
 * @param params - Event parameters
 */
export const logEvent = async (
  eventName: string,
  params?: Record<string, any>
): Promise<void> => {
  if (!isAnalyticsEnabled() || !analytics) {
    if (__DEV__) {
      console.log(`[Analytics Event] ${eventName}`, params);
    }
    return;
  }

  try {
    await analytics.logEvent(eventName, params);
  } catch (error) {
    logError(error as Error, {
      context: 'logEvent',
      eventName,
    });
  }
};

/**
 * Log screen view event
 * @param screenName - Screen name
 * @param screenClass - Screen class/component name
 */
export const logScreenView = async (
  screenName: string,
  screenClass?: string
): Promise<void> => {
  await logEvent('screen_view', {
    screen_name: screenName,
    screen_class: screenClass || screenName,
  });
};

/**
 * Set user ID for analytics
 * @param userId - User identifier
 */
export const setUserId = async (userId: string | null): Promise<void> => {
  if (!isAnalyticsEnabled() || !analytics) {
    return;
  }

  try {
    await analytics.setUserId(userId);
  } catch (error) {
    logError(error as Error, {
      context: 'setUserId',
    });
  }
};

/**
 * Set user property
 * @param name - Property name
 * @param value - Property value
 */
export const setUserProperty = async (
  name: string,
  value: string | null
): Promise<void> => {
  if (!isAnalyticsEnabled() || !analytics) {
    return;
  }

  try {
    await analytics.setUserProperty(name, value);
  } catch (error) {
    logError(error as Error, {
      context: 'setUserProperty',
      property: name,
    });
  }
};

/**
 * Log app open event
 */
export const logAppOpen = async (): Promise<void> => {
  await logEvent('app_open');
};

/**
 * Log meme creation event
 * @param templateId - Template used
 * @param hasCustomImage - Whether custom image was used
 */
export const logMemeCreated = async (
  templateId?: string,
  hasCustomImage: boolean = false
): Promise<void> => {
  await logEvent('meme_created', {
    template_id: templateId || 'custom',
    has_custom_image: hasCustomImage,
    timestamp: Date.now(),
  });
};

/**
 * Log meme shared event
 * @param method - Share method (e.g., 'instagram', 'whatsapp', 'other')
 */
export const logMemeShared = async (method: string): Promise<void> => {
  await logEvent('share', {
    content_type: 'meme',
    method,
  });
};

/**
 * Log meme saved event
 */
export const logMemeSaved = async (): Promise<void> => {
  await logEvent('meme_saved');
};

/**
 * Log premium unlock event
 * @param method - Purchase method
 * @param price - Price paid
 */
export const logPremiumUnlock = async (
  method: string,
  price: number
): Promise<void> => {
  await logEvent('purchase', {
    transaction_id: `premium_${Date.now()}`,
    value: price,
    currency: 'USD',
    items: [
      {
        item_id: 'premium_unlock',
        item_name: 'Premium Unlock',
        price,
      },
    ],
  });
};

/**
 * Log ad impression
 * @param adType - Type of ad (banner, interstitial, rewarded)
 */
export const logAdImpression = async (
  adType: 'banner' | 'interstitial' | 'rewarded'
): Promise<void> => {
  await logEvent('ad_impression', {
    ad_type: adType,
  });
};

/**
 * Log ad clicked
 * @param adType - Type of ad
 */
export const logAdClicked = async (
  adType: 'banner' | 'interstitial' | 'rewarded'
): Promise<void> => {
  await logEvent('ad_click', {
    ad_type: adType,
  });
};

/**
 * Log feature used
 * @param featureName - Name of the feature
 */
export const logFeatureUsed = async (featureName: string): Promise<void> => {
  await logEvent('feature_used', {
    feature_name: featureName,
  });
};

/**
 * Log error event
 * @param errorMessage - Error message
 * @param fatal - Whether error was fatal
 */
export const logErrorEvent = async (
  errorMessage: string,
  fatal: boolean = false
): Promise<void> => {
  await logEvent('error', {
    description: errorMessage,
    fatal,
  });
};

/**
 * Log search event
 * @param searchTerm - Search term
 */
export const logSearch = async (searchTerm: string): Promise<void> => {
  await logEvent('search', {
    search_term: searchTerm,
  });
};

/**
 * Log tutorial begin
 */
export const logTutorialBegin = async (): Promise<void> => {
  await logEvent('tutorial_begin');
};

/**
 * Log tutorial complete
 */
export const logTutorialComplete = async (): Promise<void> => {
  await logEvent('tutorial_complete');
};

/**
 * Log level up event (for gamification features)
 * @param level - Level reached
 */
export const logLevelUp = async (level: number): Promise<void> => {
  await logEvent('level_up', {
    level,
    character: 'meme_creator',
  });
};

/**
 * Export all analytics functions
 */
export const Analytics = {
  init: initializeAnalytics,
  logEvent,
  logScreenView,
  setUserId,
  setUserProperty,
  logAppOpen,
  logMemeCreated,
  logMemeShared,
  logMemeSaved,
  logPremiumUnlock,
  logAdImpression,
  logAdClicked,
  logFeatureUsed,
  logErrorEvent,
  logSearch,
  logTutorialBegin,
  logTutorialComplete,
  logLevelUp,
};

export default Analytics;
