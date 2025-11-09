import AsyncStorage from '@react-native-async-storage/async-storage';

const RECENT_FONTS_KEY = '@recently_used_fonts';
const FAVORITE_FONTS_KEY = '@favorite_fonts';
const MAX_RECENT_FONTS = 10;

// Recently Used Fonts
export const getRecentlyUsedFonts = async (): Promise<string[]> => {
  try {
    const data = await AsyncStorage.getItem(RECENT_FONTS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    if (__DEV__) {
      console.error('Error getting recently used fonts:', error);
    }
    return [];
  }
};

export const addRecentlyUsedFont = async (fontId: string): Promise<void> => {
  try {
    const recentFonts = await getRecentlyUsedFonts();

    // Remove if already exists
    const filtered = recentFonts.filter(id => id !== fontId);

    // Add to beginning
    const updated = [fontId, ...filtered].slice(0, MAX_RECENT_FONTS);

    await AsyncStorage.setItem(RECENT_FONTS_KEY, JSON.stringify(updated));
  } catch (error) {
    if (__DEV__) {
      console.error('Error adding recently used font:', error);
    }
  }
};

export const clearRecentlyUsedFonts = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(RECENT_FONTS_KEY);
  } catch (error) {
    if (__DEV__) {
      console.error('Error clearing recently used fonts:', error);
    }
  }
};

// Favorite Fonts
export const getFavoriteFonts = async (): Promise<string[]> => {
  try {
    const data = await AsyncStorage.getItem(FAVORITE_FONTS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    if (__DEV__) {
      console.error('Error getting favorite fonts:', error);
    }
    return [];
  }
};

export const toggleFavoriteFont = async (fontId: string): Promise<boolean> => {
  try {
    const favorites = await getFavoriteFonts();
    const isFavorite = favorites.includes(fontId);

    let updated: string[];
    if (isFavorite) {
      // Remove from favorites
      updated = favorites.filter(id => id !== fontId);
    } else {
      // Add to favorites
      updated = [...favorites, fontId];
    }

    await AsyncStorage.setItem(FAVORITE_FONTS_KEY, JSON.stringify(updated));
    return !isFavorite; // Return new state
  } catch (error) {
    if (__DEV__) {
      console.error('Error toggling favorite font:', error);
    }
    return false;
  }
};

export const isFontFavorite = async (fontId: string): Promise<boolean> => {
  try {
    const favorites = await getFavoriteFonts();
    return favorites.includes(fontId);
  } catch (error) {
    if (__DEV__) {
      console.error('Error checking if font is favorite:', error);
    }
    return false;
  }
};

export const clearFavoriteFonts = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(FAVORITE_FONTS_KEY);
  } catch (error) {
    if (__DEV__) {
      console.error('Error clearing favorite fonts:', error);
    }
  }
};
