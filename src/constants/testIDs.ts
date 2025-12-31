/**
 * Test IDs for automated testing and accessibility
 * Centralized constants for consistent testID usage across the app
 */

export const TestIDs = {
  // Screens
  SCREENS: {
    ONBOARDING: 'onboarding-screen',
    HOME: 'home-screen',
    EDITOR: 'editor-screen',
    GALLERY: 'gallery-screen',
    SETTINGS: 'settings-screen',
    PREMIUM: 'premium-screen',
    PRIVACY_POLICY: 'privacy-policy-screen',
    TERMS_OF_SERVICE: 'terms-of-service-screen',
    TRENDING: 'trending-screen',
  },

  // Navigation
  NAV: {
    TAB_HOME: 'tab-home',
    TAB_GALLERY: 'tab-gallery',
    TAB_SETTINGS: 'tab-settings',
    BACK_BUTTON: 'back-button',
    CLOSE_BUTTON: 'close-button',
  },

  // Onboarding
  ONBOARDING: {
    SKIP_BUTTON: 'onboarding-skip-button',
    NEXT_BUTTON: 'onboarding-next-button',
    GET_STARTED_BUTTON: 'onboarding-get-started-button',
    SLIDE: (index: number) => `onboarding-slide-${index}`,
  },

  // Home Screen
  HOME: {
    SEARCH_INPUT: 'home-search-input',
    TEMPLATE_GRID: 'home-template-grid',
    TEMPLATE_ITEM: (id: string) => `template-item-${id}`,
    CAMERA_BUTTON: 'home-camera-button',
    GALLERY_BUTTON: 'home-gallery-button',
    CATEGORY_FILTER: (category: string) => `category-filter-${category}`,
    TRENDING_BUTTON: 'home-trending-button',
  },

  // Editor Screen
  EDITOR: {
    CANVAS: 'editor-canvas',
    TEXT_INPUT: 'editor-text-input',
    ADD_TEXT_BUTTON: 'editor-add-text-button',
    SAVE_BUTTON: 'editor-save-button',
    SHARE_BUTTON: 'editor-share-button',
    UNDO_BUTTON: 'editor-undo-button',
    REDO_BUTTON: 'editor-redo-button',
    COLOR_PICKER: 'editor-color-picker',
    FONT_SIZE_SLIDER: 'editor-font-size-slider',
    TEXT_ITEM: (id: string) => `editor-text-${id}`,
    DELETE_TEXT_BUTTON: 'editor-delete-text-button',
    VOICE_INPUT_BUTTON: 'editor-voice-input-button',
    OCR_BUTTON: 'editor-ocr-button',
  },

  // Gallery Screen
  GALLERY: {
    MEME_LIST: 'gallery-meme-list',
    MEME_ITEM: (id: string) => `gallery-meme-${id}`,
    DELETE_BUTTON: (id: string) => `gallery-delete-${id}`,
    SHARE_BUTTON: (id: string) => `gallery-share-${id}`,
    EMPTY_STATE: 'gallery-empty-state',
    SEARCH_INPUT: 'gallery-search-input',
  },

  // Settings Screen
  SETTINGS: {
    PREMIUM_BUTTON: 'settings-premium-button',
    RATE_APP_BUTTON: 'settings-rate-app-button',
    SHARE_APP_BUTTON: 'settings-share-app-button',
    PRIVACY_POLICY_BUTTON: 'settings-privacy-policy-button',
    TERMS_OF_SERVICE_BUTTON: 'settings-terms-of-service-button',
    CONTACT_SUPPORT_BUTTON: 'settings-contact-support-button',
    CLEAR_CACHE_BUTTON: 'settings-clear-cache-button',
    ABOUT_BUTTON: 'settings-about-button',
  },

  // Premium Screen
  PREMIUM: {
    UNLOCK_BUTTON: 'premium-unlock-button',
    RESTORE_BUTTON: 'premium-restore-button',
    CLOSE_BUTTON: 'premium-close-button',
    FEATURE_LIST: 'premium-feature-list',
    PRICE_TEXT: 'premium-price-text',
  },

  // Common Components
  COMMON: {
    LOADING_INDICATOR: 'loading-indicator',
    ERROR_MESSAGE: 'error-message',
    SUCCESS_MESSAGE: 'success-message',
    MODAL_OVERLAY: 'modal-overlay',
    CONFIRM_BUTTON: 'confirm-button',
    CANCEL_BUTTON: 'cancel-button',
  },

  // Ads
  ADS: {
    BANNER: 'ad-banner',
    INTERSTITIAL: 'ad-interstitial',
    REWARDED: 'ad-rewarded',
  },
};

/**
 * Accessibility Labels
 * Descriptive labels for screen readers
 */
export const A11yLabels = {
  // Navigation
  NAV: {
    TAB_HOME: 'Home tab',
    TAB_GALLERY: 'My memes gallery tab',
    TAB_SETTINGS: 'Settings tab',
    BACK: 'Go back',
    CLOSE: 'Close',
  },

  // Onboarding
  ONBOARDING: {
    SKIP: 'Skip onboarding',
    NEXT: 'Next slide',
    GET_STARTED: 'Get started with Meme Generator',
  },

  // Home
  HOME: {
    SEARCH: 'Search meme templates',
    CAMERA: 'Take photo for custom meme',
    GALLERY: 'Choose photo from gallery',
    TEMPLATE: (name: string) => `${name} meme template`,
    TRENDING: 'View trending memes',
  },

  // Editor
  EDITOR: {
    CANVAS: 'Meme editing canvas',
    TEXT_INPUT: 'Enter meme text',
    ADD_TEXT: 'Add text to meme',
    SAVE: 'Save meme to gallery',
    SHARE: 'Share meme',
    UNDO: 'Undo last change',
    REDO: 'Redo last change',
    COLOR_PICKER: 'Choose text color',
    FONT_SIZE: 'Adjust text size',
    DELETE_TEXT: 'Delete selected text',
    VOICE_INPUT: 'Add text using voice',
    OCR: 'Recognize text from image',
  },

  // Gallery
  GALLERY: {
    MEME: (date: string) => `Meme created on ${date}`,
    DELETE: 'Delete this meme',
    SHARE: 'Share this meme',
    EMPTY: 'No memes yet. Create your first meme!',
  },

  // Settings
  SETTINGS: {
    PREMIUM: 'Upgrade to premium',
    RATE_APP: 'Rate app on store',
    SHARE_APP: 'Share app with friends',
    PRIVACY: 'View privacy policy',
    TERMS: 'View terms of service',
    SUPPORT: 'Contact support',
    CLEAR_CACHE: 'Clear all data',
    ABOUT: 'About Meme Generator',
  },

  // Premium
  PREMIUM: {
    UNLOCK: 'Unlock premium features',
    RESTORE: 'Restore previous purchase',
    CLOSE: 'Close premium screen',
  },
};

/**
 * Accessibility Hints
 * Additional context for screen reader users
 */
export const A11yHints = {
  // Navigation
  NAV: {
    TAB: 'Double tap to switch tabs',
    BACK: 'Returns to previous screen',
  },

  // Home
  HOME: {
    TEMPLATE: 'Double tap to create meme with this template',
    CAMERA: 'Opens camera to take a photo',
    GALLERY: 'Opens photo gallery to choose an image',
  },

  // Editor
  EDITOR: {
    SAVE: 'Saves meme to your gallery',
    SHARE: 'Opens share options',
    TEXT_INPUT: 'Type or use voice to add text',
    VOICE: 'Speak to add text to your meme',
  },

  // Gallery
  GALLERY: {
    MEME: 'Double tap to view or edit',
    DELETE: 'Permanently deletes this meme',
    SHARE: 'Share via social media or messaging',
  },

  // Settings
  SETTINGS: {
    CLEAR_CACHE: 'Warning: This will delete all your saved memes',
    PREMIUM: 'One-time purchase to unlock all features',
  },
};

export default TestIDs;
