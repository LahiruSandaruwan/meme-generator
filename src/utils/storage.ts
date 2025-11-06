import AsyncStorage from '@react-native-async-storage/async-storage';
import { SavedMeme } from '../types';

const KEYS = {
  SAVED_MEMES: '@meme_generator:saved_memes',
  ONBOARDING_COMPLETED: '@meme_generator:onboarding_completed',
  LAST_AD_TIME: '@meme_generator:last_ad_time',
  MEME_VIEW_COUNT: '@meme_generator:meme_view_count',
};

// Saved Memes Storage
export const saveMeme = async (meme: SavedMeme): Promise<void> => {
  try {
    const existing = await getSavedMemes();
    const updated = [meme, ...existing];
    await AsyncStorage.setItem(KEYS.SAVED_MEMES, JSON.stringify(updated));
  } catch (error) {
    console.error('Error saving meme:', error);
    throw error;
  }
};

export const getSavedMemes = async (): Promise<SavedMeme[]> => {
  try {
    const data = await AsyncStorage.getItem(KEYS.SAVED_MEMES);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting saved memes:', error);
    return [];
  }
};

export const deleteMeme = async (memeId: string): Promise<void> => {
  try {
    const existing = await getSavedMemes();
    const updated = existing.filter((meme) => meme.id !== memeId);
    await AsyncStorage.setItem(KEYS.SAVED_MEMES, JSON.stringify(updated));
  } catch (error) {
    console.error('Error deleting meme:', error);
    throw error;
  }
};

// Onboarding Storage
export const setOnboardingCompleted = async (): Promise<void> => {
  try {
    await AsyncStorage.setItem(KEYS.ONBOARDING_COMPLETED, 'true');
  } catch (error) {
    console.error('Error setting onboarding completed:', error);
  }
};

export const getOnboardingCompleted = async (): Promise<boolean> => {
  try {
    const value = await AsyncStorage.getItem(KEYS.ONBOARDING_COMPLETED);
    return value === 'true';
  } catch (error) {
    console.error('Error getting onboarding status:', error);
    return false;
  }
};

// Ad Tracking Storage
export const setLastAdTime = async (): Promise<void> => {
  try {
    await AsyncStorage.setItem(KEYS.LAST_AD_TIME, Date.now().toString());
  } catch (error) {
    console.error('Error setting last ad time:', error);
  }
};

export const getLastAdTime = async (): Promise<number> => {
  try {
    const value = await AsyncStorage.getItem(KEYS.LAST_AD_TIME);
    return value ? parseInt(value, 10) : 0;
  } catch (error) {
    console.error('Error getting last ad time:', error);
    return 0;
  }
};

export const incrementMemeViewCount = async (): Promise<number> => {
  try {
    const value = await AsyncStorage.getItem(KEYS.MEME_VIEW_COUNT);
    const count = value ? parseInt(value, 10) + 1 : 1;
    await AsyncStorage.setItem(KEYS.MEME_VIEW_COUNT, count.toString());
    return count;
  } catch (error) {
    console.error('Error incrementing meme view count:', error);
    return 0;
  }
};

export const resetMemeViewCount = async (): Promise<void> => {
  try {
    await AsyncStorage.setItem(KEYS.MEME_VIEW_COUNT, '0');
  } catch (error) {
    console.error('Error resetting meme view count:', error);
  }
};

// Clear all data
export const clearAllData = async (): Promise<void> => {
  try {
    await AsyncStorage.clear();
  } catch (error) {
    console.error('Error clearing all data:', error);
    throw error;
  }
};
