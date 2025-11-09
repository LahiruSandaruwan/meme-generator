/**
 * Meme Database using AsyncStorage (100% FREE)
 * No external database needed - uses built-in React Native storage
 * Supports: folders, favorites, tags, search, sorting
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { SavedMeme } from '../types';

export interface MemeMetadata {
  id: string;
  uri: string;
  timestamp: number;
  templateId?: string;
  templateName?: string;
  isFavorite: boolean;
  folderId?: string;
  tags: string[];
  views: number;
  lastViewed?: number;
}

export interface Folder {
  id: string;
  name: string;
  createdAt: number;
  memeCount: number;
  coverUri?: string;
}

const KEYS = {
  MEMES: '@memes_metadata',
  FOLDERS: '@folders',
  STATS: '@stats',
};

/**
 * Get all memes with metadata
 */
export const getAllMemesWithMetadata = async (): Promise<MemeMetadata[]> => {
  try {
    const data = await AsyncStorage.getItem(KEYS.MEMES);
    if (!data) return [];

    const memes: MemeMetadata[] = JSON.parse(data);
    return memes.sort((a, b) => b.timestamp - a.timestamp);
  } catch (error) {
    if (__DEV__) {
      console.error('Error getting memes:', error);
    }
    return [];
  }
};

/**
 * Save meme with metadata
 */
export const saveMemeWithMetadata = async (
  meme: SavedMeme,
  metadata?: Partial<MemeMetadata>
): Promise<void> => {
  try {
    const memes = await getAllMemesWithMetadata();

    const newMeme: MemeMetadata = {
      id: meme.id,
      uri: meme.uri,
      timestamp: meme.timestamp,
      templateId: meme.templateId,
      isFavorite: metadata?.isFavorite || false,
      folderId: metadata?.folderId,
      tags: metadata?.tags || [],
      views: 0,
      ...metadata,
    };

    memes.push(newMeme);
    await AsyncStorage.setItem(KEYS.MEMES, JSON.stringify(memes));
  } catch (error) {
    if (__DEV__) {
      console.error('Error saving meme:', error);
    }
  }
};

/**
 * Update meme metadata
 */
export const updateMemeMetadata = async (
  id: string,
  updates: Partial<MemeMetadata>
): Promise<void> => {
  try {
    const memes = await getAllMemesWithMetadata();
    const index = memes.findIndex(m => m.id === id);

    if (index !== -1) {
      memes[index] = { ...memes[index], ...updates };
      await AsyncStorage.setItem(KEYS.MEMES, JSON.stringify(memes));
    }
  } catch (error) {
    if (__DEV__) {
      console.error('Error updating meme:', error);
    }
  }
};

/**
 * Delete meme
 */
export const deleteMeme = async (id: string): Promise<void> => {
  try {
    const memes = await getAllMemesWithMetadata();
    const filtered = memes.filter(m => m.id !== id);
    await AsyncStorage.setItem(KEYS.MEMES, JSON.stringify(filtered));
  } catch (error) {
    if (__DEV__) {
      console.error('Error deleting meme:', error);
    }
  }
};

/**
 * Toggle favorite
 */
export const toggleFavorite = async (id: string): Promise<boolean> => {
  try {
    const memes = await getAllMemesWithMetadata();
    const meme = memes.find(m => m.id === id);

    if (meme) {
      meme.isFavorite = !meme.isFavorite;
      await AsyncStorage.setItem(KEYS.MEMES, JSON.stringify(memes));
      return meme.isFavorite;
    }

    return false;
  } catch (error) {
    if (__DEV__) {
      console.error('Error toggling favorite:', error);
    }
    return false;
  }
};

/**
 * Get favorites
 */
export const getFavorites = async (): Promise<MemeMetadata[]> => {
  try {
    const memes = await getAllMemesWithMetadata();
    return memes.filter(m => m.isFavorite);
  } catch (error) {
    if (__DEV__) {
      console.error('Error getting favorites:', error);
    }
    return [];
  }
};

/**
 * Search memes
 */
export const searchMemes = async (query: string): Promise<MemeMetadata[]> => {
  try {
    const memes = await getAllMemesWithMetadata();
    const lowerQuery = query.toLowerCase();

    return memes.filter(m =>
      (m.templateName && m.templateName.toLowerCase().includes(lowerQuery)) ||
      m.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  } catch (error) {
    if (__DEV__) {
      console.error('Error searching memes:', error);
    }
    return [];
  }
};

/**
 * Get all folders
 */
export const getFolders = async (): Promise<Folder[]> => {
  try {
    const data = await AsyncStorage.getItem(KEYS.FOLDERS);
    if (!data) return [];

    return JSON.parse(data);
  } catch (error) {
    if (__DEV__) {
      console.error('Error getting folders:', error);
    }
    return [];
  }
};

/**
 * Create folder
 */
export const createFolder = async (name: string): Promise<Folder> => {
  try {
    const folders = await getFolders();

    const newFolder: Folder = {
      id: `folder_${Date.now()}`,
      name,
      createdAt: Date.now(),
      memeCount: 0,
    };

    folders.push(newFolder);
    await AsyncStorage.setItem(KEYS.FOLDERS, JSON.stringify(folders));

    return newFolder;
  } catch (error) {
    if (__DEV__) {
      console.error('Error creating folder:', error);
    }
    throw error;
  }
};

/**
 * Delete folder
 */
export const deleteFolder = async (id: string): Promise<void> => {
  try {
    const folders = await getFolders();
    const filtered = folders.filter(f => f.id !== id);
    await AsyncStorage.setItem(KEYS.FOLDERS, JSON.stringify(filtered));

    // Remove folderId from memes
    const memes = await getAllMemesWithMetadata();
    const updated = memes.map(m =>
      m.folderId === id ? { ...m, folderId: undefined } : m
    );
    await AsyncStorage.setItem(KEYS.MEMES, JSON.stringify(updated));
  } catch (error) {
    if (__DEV__) {
      console.error('Error deleting folder:', error);
    }
  }
};

/**
 * Move meme to folder
 */
export const moveMemeToFolder = async (
  memeId: string,
  folderId: string | undefined
): Promise<void> => {
  await updateMemeMetadata(memeId, { folderId });

  // Update folder counts
  await updateFolderCounts();
};

/**
 * Get memes in folder
 */
export const getMemesInFolder = async (folderId: string): Promise<MemeMetadata[]> => {
  try {
    const memes = await getAllMemesWithMetadata();
    return memes.filter(m => m.folderId === folderId);
  } catch (error) {
    if (__DEV__) {
      console.error('Error getting memes in folder:', error);
    }
    return [];
  }
};

/**
 * Update folder counts
 */
const updateFolderCounts = async (): Promise<void> => {
  try {
    const folders = await getFolders();
    const memes = await getAllMemesWithMetadata();

    const updated = folders.map(folder => {
      const folderMemes = memes.filter(m => m.folderId === folder.id);
      return {
        ...folder,
        memeCount: folderMemes.length,
        coverUri: folderMemes.length > 0 ? folderMemes[0].uri : undefined,
      };
    });

    await AsyncStorage.setItem(KEYS.FOLDERS, JSON.stringify(updated));
  } catch (error) {
    if (__DEV__) {
      console.error('Error updating folder counts:', error);
    }
  }
};

/**
 * Add tag to meme
 */
export const addTagToMeme = async (id: string, tag: string): Promise<void> => {
  try {
    const memes = await getAllMemesWithMetadata();
    const meme = memes.find(m => m.id === id);

    if (meme && !meme.tags.includes(tag)) {
      meme.tags.push(tag);
      await AsyncStorage.setItem(KEYS.MEMES, JSON.stringify(memes));
    }
  } catch (error) {
    if (__DEV__) {
      console.error('Error adding tag:', error);
    }
  }
};

/**
 * Remove tag from meme
 */
export const removeTagFromMeme = async (id: string, tag: string): Promise<void> => {
  try {
    const memes = await getAllMemesWithMetadata();
    const meme = memes.find(m => m.id === id);

    if (meme) {
      meme.tags = meme.tags.filter(t => t !== tag);
      await AsyncStorage.setItem(KEYS.MEMES, JSON.stringify(memes));
    }
  } catch (error) {
    if (__DEV__) {
      console.error('Error removing tag:', error);
    }
  }
};

/**
 * Get all tags
 */
export const getAllTags = async (): Promise<string[]> => {
  try {
    const memes = await getAllMemesWithMetadata();
    const allTags = memes.flatMap(m => m.tags);
    return [...new Set(allTags)].sort();
  } catch (error) {
    if (__DEV__) {
      console.error('Error getting tags:', error);
    }
    return [];
  }
};

/**
 * Get memes by tag
 */
export const getMemesByTag = async (tag: string): Promise<MemeMetadata[]> => {
  try {
    const memes = await getAllMemesWithMetadata();
    return memes.filter(m => m.tags.includes(tag));
  } catch (error) {
    if (__DEV__) {
      console.error('Error getting memes by tag:', error);
    }
    return [];
  }
};

/**
 * Record meme view
 */
export const recordMemeView = async (id: string): Promise<void> => {
  try {
    const memes = await getAllMemesWithMetadata();
    const meme = memes.find(m => m.id === id);

    if (meme) {
      meme.views = (meme.views || 0) + 1;
      meme.lastViewed = Date.now();
      await AsyncStorage.setItem(KEYS.MEMES, JSON.stringify(memes));
    }
  } catch (error) {
    if (__DEV__) {
      console.error('Error recording view:', error);
    }
  }
};

/**
 * Get stats
 */
export const getStats = async (): Promise<{
  totalMemes: number;
  favorites: number;
  folders: number;
  tags: number;
  mostViewedMeme?: MemeMetadata;
}> => {
  try {
    const memes = await getAllMemesWithMetadata();
    const folders = await getFolders();
    const tags = await getAllTags();

    const mostViewed = memes.reduce((max, meme) =>
      (meme.views || 0) > (max.views || 0) ? meme : max
    , memes[0]);

    return {
      totalMemes: memes.length,
      favorites: memes.filter(m => m.isFavorite).length,
      folders: folders.length,
      tags: tags.length,
      mostViewedMeme: mostViewed,
    };
  } catch (error) {
    if (__DEV__) {
      console.error('Error getting stats:', error);
    }
    return {
      totalMemes: 0,
      favorites: 0,
      folders: 0,
      tags: 0,
    };
  }
};
