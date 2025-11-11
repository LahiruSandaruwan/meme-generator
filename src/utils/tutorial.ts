/**
 * Meme Generator Tutorial
 * Interactive walkthrough for first-time users
 * 100% FREE - On-device state management
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

const TUTORIAL_STORAGE_KEY = '@tutorial_completed';
const TUTORIAL_DISMISSED_KEY = '@tutorial_dismissed';

export interface TutorialStep {
  id: string;
  title: string;
  description: string;
  targetElement?: string; // ID of element to highlight
  icon: string; // Ionicons name
  position: 'top' | 'center' | 'bottom';
  action?: 'tap' | 'swipe' | 'none';
}

// Home Screen Tutorial Steps
export const HOME_TUTORIAL_STEPS: TutorialStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to Meme Generator! 🎉',
    description:
      'Create viral memes in seconds with our powerful FREE tools. Let\'s get started!',
    icon: 'sparkles',
    position: 'center',
    action: 'none',
  },
  {
    id: 'search',
    title: 'Search Templates',
    description:
      'Find the perfect meme template by typing keywords like "Drake", "Distracted Boyfriend", or "Success Kid".',
    targetElement: 'search-bar',
    icon: 'search',
    position: 'top',
    action: 'tap',
  },
  {
    id: 'upload',
    title: 'Upload Your Own Images',
    description:
      'Tap here to upload your own photos or take a picture to create custom memes.',
    targetElement: 'upload-button',
    icon: 'cloud-upload',
    position: 'top',
    action: 'tap',
  },
  {
    id: 'templates',
    title: 'Browse Templates',
    description:
      'Scroll through popular meme templates. Tap any template to start editing!',
    targetElement: 'template-grid',
    icon: 'images',
    position: 'center',
    action: 'tap',
  },
  {
    id: 'creative-tools',
    title: 'Advanced Features',
    description:
      'Create multi-panel memes, Instagram stories, WhatsApp stickers, and more with our creative tools!',
    targetElement: 'creative-tools',
    icon: 'color-wand',
    position: 'center',
    action: 'none',
  },
];

// Editor Screen Tutorial Steps
export const EDITOR_TUTORIAL_STEPS: TutorialStep[] = [
  {
    id: 'add-text',
    title: 'Add Text Boxes',
    description:
      'Tap the "+ Text" button to add text to your meme. You can add multiple text boxes!',
    targetElement: 'add-text-button',
    icon: 'text',
    position: 'bottom',
    action: 'tap',
  },
  {
    id: 'drag-text',
    title: 'Move Text',
    description:
      'Drag text boxes to position them anywhere on your meme. Tap to select and edit.',
    targetElement: 'meme-preview',
    icon: 'move',
    position: 'center',
    action: 'swipe',
  },
  {
    id: 'edit-text',
    title: 'Customize Text',
    description:
      'Change font size, color, and add text effects. Make your text stand out!',
    targetElement: 'text-controls',
    icon: 'color-palette',
    position: 'bottom',
    action: 'none',
  },
  {
    id: 'add-stickers',
    title: 'Add Stickers & Shapes',
    description:
      'Enhance your memes with emojis, stickers, shapes, and drawings!',
    targetElement: 'sticker-button',
    icon: 'happy',
    position: 'bottom',
    action: 'tap',
  },
  {
    id: 'filters',
    title: 'Apply Filters',
    description:
      'Adjust brightness, contrast, and saturation. Add color filters to match your style!',
    targetElement: 'filters-button',
    icon: 'color-filter',
    position: 'bottom',
    action: 'tap',
  },
  {
    id: 'save-share',
    title: 'Save & Share',
    description:
      'Save your meme to your gallery or share directly to social media. Go viral!',
    targetElement: 'save-button',
    icon: 'download',
    position: 'bottom',
    action: 'tap',
  },
];

// All tutorial steps
export const ALL_TUTORIAL_STEPS = {
  home: HOME_TUTORIAL_STEPS,
  editor: EDITOR_TUTORIAL_STEPS,
};

/**
 * Check if tutorial has been completed
 */
export const isTutorialCompleted = async (): Promise<boolean> => {
  try {
    const completed = await AsyncStorage.getItem(TUTORIAL_STORAGE_KEY);
    return completed === 'true';
  } catch (error) {
    console.error('Error checking tutorial status:', error);
    return false;
  }
};

/**
 * Mark tutorial as completed
 */
export const completeTutorial = async (): Promise<void> => {
  try {
    await AsyncStorage.setItem(TUTORIAL_STORAGE_KEY, 'true');
  } catch (error) {
    console.error('Error marking tutorial as completed:', error);
  }
};

/**
 * Reset tutorial (for testing or re-onboarding)
 */
export const resetTutorial = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(TUTORIAL_STORAGE_KEY);
    await AsyncStorage.removeItem(TUTORIAL_DISMISSED_KEY);
  } catch (error) {
    console.error('Error resetting tutorial:', error);
  }
};

/**
 * Check if user dismissed the tutorial
 */
export const isTutorialDismissed = async (): Promise<boolean> => {
  try {
    const dismissed = await AsyncStorage.getItem(TUTORIAL_DISMISSED_KEY);
    return dismissed === 'true';
  } catch (error) {
    console.error('Error checking tutorial dismissed status:', error);
    return false;
  }
};

/**
 * Mark tutorial as dismissed (don't show again)
 */
export const dismissTutorial = async (): Promise<void> => {
  try {
    await AsyncStorage.setItem(TUTORIAL_DISMISSED_KEY, 'true');
    await completeTutorial();
  } catch (error) {
    console.error('Error dismissing tutorial:', error);
  }
};

/**
 * Get specific tutorial step by ID
 */
export const getTutorialStep = (
  screen: 'home' | 'editor',
  stepId: string
): TutorialStep | undefined => {
  return ALL_TUTORIAL_STEPS[screen].find(step => step.id === stepId);
};

/**
 * Get next tutorial step
 */
export const getNextTutorialStep = (
  screen: 'home' | 'editor',
  currentStepId: string
): TutorialStep | null => {
  const steps = ALL_TUTORIAL_STEPS[screen];
  const currentIndex = steps.findIndex(step => step.id === currentStepId);

  if (currentIndex === -1 || currentIndex === steps.length - 1) {
    return null;
  }

  return steps[currentIndex + 1];
};

/**
 * Get previous tutorial step
 */
export const getPreviousTutorialStep = (
  screen: 'home' | 'editor',
  currentStepId: string
): TutorialStep | null => {
  const steps = ALL_TUTORIAL_STEPS[screen];
  const currentIndex = steps.findIndex(step => step.id === currentStepId);

  if (currentIndex <= 0) {
    return null;
  }

  return steps[currentIndex - 1];
};

/**
 * Get step progress (current step index + 1, total steps)
 */
export const getStepProgress = (
  screen: 'home' | 'editor',
  currentStepId: string
): { current: number; total: number } => {
  const steps = ALL_TUTORIAL_STEPS[screen];
  const currentIndex = steps.findIndex(step => step.id === currentStepId);

  return {
    current: currentIndex + 1,
    total: steps.length,
  };
};

/**
 * Check if this is the first step
 */
export const isFirstStep = (
  screen: 'home' | 'editor',
  stepId: string
): boolean => {
  const steps = ALL_TUTORIAL_STEPS[screen];
  return steps[0]?.id === stepId;
};

/**
 * Check if this is the last step
 */
export const isLastStep = (
  screen: 'home' | 'editor',
  stepId: string
): boolean => {
  const steps = ALL_TUTORIAL_STEPS[screen];
  return steps[steps.length - 1]?.id === stepId;
};

/**
 * Tutorial tips for different features
 */
export const TUTORIAL_TIPS = {
  text: [
    'Use ALL CAPS for impact text',
    'White text with black stroke is most readable',
    'Impact font is the classic meme font',
    'Keep text short and punchy',
  ],
  stickers: [
    'Layer stickers for creative effects',
    'Rotate stickers by dragging corners',
    'Use emojis to emphasize emotions',
    'Don\'t overdo it - less is more!',
  ],
  filters: [
    'Increase contrast for bold memes',
    'Decrease saturation for vintage look',
    'Brightness can highlight subjects',
    'Preview before applying filters',
  ],
  sharing: [
    'Add trending hashtags for more reach',
    'Post during peak hours (12PM, 6PM)',
    'Engage with comments quickly',
    'Cross-post to multiple platforms',
  ],
};

/**
 * Get random tip for a feature
 */
export const getRandomTip = (feature: keyof typeof TUTORIAL_TIPS): string => {
  const tips = TUTORIAL_TIPS[feature];
  return tips[Math.floor(Math.random() * tips.length)];
};

/**
 * Check if should show tutorial on app launch
 */
export const shouldShowTutorial = async (): Promise<boolean> => {
  const completed = await isTutorialCompleted();
  const dismissed = await isTutorialDismissed();

  return !completed && !dismissed;
};

/**
 * Tutorial analytics (for tracking tutorial completion)
 */
interface TutorialAnalytics {
  startedAt: string;
  completedAt?: string;
  stepsCompleted: number;
  totalSteps: number;
  dismissed: boolean;
}

const ANALYTICS_KEY = '@tutorial_analytics';

/**
 * Log tutorial start
 */
export const logTutorialStart = async (screen: 'home' | 'editor'): Promise<void> => {
  try {
    const analytics: TutorialAnalytics = {
      startedAt: new Date().toISOString(),
      stepsCompleted: 0,
      totalSteps: ALL_TUTORIAL_STEPS[screen].length,
      dismissed: false,
    };

    await AsyncStorage.setItem(
      `${ANALYTICS_KEY}_${screen}`,
      JSON.stringify(analytics)
    );
  } catch (error) {
    console.error('Error logging tutorial start:', error);
  }
};

/**
 * Log tutorial completion
 */
export const logTutorialComplete = async (
  screen: 'home' | 'editor'
): Promise<void> => {
  try {
    const analyticsStr = await AsyncStorage.getItem(`${ANALYTICS_KEY}_${screen}`);
    if (!analyticsStr) return;

    const analytics: TutorialAnalytics = JSON.parse(analyticsStr);
    analytics.completedAt = new Date().toISOString();
    analytics.stepsCompleted = ALL_TUTORIAL_STEPS[screen].length;

    await AsyncStorage.setItem(
      `${ANALYTICS_KEY}_${screen}`,
      JSON.stringify(analytics)
    );
  } catch (error) {
    console.error('Error logging tutorial completion:', error);
  }
};

/**
 * Quick start guide (concise tips)
 */
export const QUICK_START_GUIDE = [
  {
    title: 'Choose a Template',
    description: 'Browse popular templates or upload your own image',
    icon: 'images',
  },
  {
    title: 'Add Text',
    description: 'Tap "+ Text" to add captions to your meme',
    icon: 'text',
  },
  {
    title: 'Customize',
    description: 'Change colors, fonts, and add stickers',
    icon: 'color-palette',
  },
  {
    title: 'Share',
    description: 'Save to gallery or share directly to social media',
    icon: 'share-social',
  },
];
