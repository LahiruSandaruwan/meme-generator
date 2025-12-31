/**
 * Storage Utility Tests
 * Tests for AsyncStorage wrapper functions
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  saveMeme,
  getSavedMemes,
  deleteMeme,
  setOnboardingCompleted,
  getOnboardingCompleted,
  setLastAdTime,
  getLastAdTime,
  incrementMemeViewCount,
  resetMemeViewCount,
  clearAllData,
} from '../storage';
import { SavedMeme } from '../../types';

describe('Storage Utility', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('Saved Memes', () => {
    const mockMeme: SavedMeme = {
      id: 'test-meme-1',
      uri: 'file://test/meme1.jpg',
      timestamp: Date.now(),
      templateId: 'template-1',
    };

    const mockMeme2: SavedMeme = {
      id: 'test-meme-2',
      uri: 'file://test/meme2.jpg',
      timestamp: Date.now(),
    };

    describe('saveMeme', () => {
      it('should save a meme to storage', async () => {
        await saveMeme(mockMeme);

        expect(AsyncStorage.setItem).toHaveBeenCalledWith(
          '@meme_generator:saved_memes',
          JSON.stringify([mockMeme])
        );
      });

      it('should prepend new meme to existing memes', async () => {
        // Mock existing memes
        (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
          JSON.stringify([mockMeme])
        );

        await saveMeme(mockMeme2);

        expect(AsyncStorage.setItem).toHaveBeenCalledWith(
          '@meme_generator:saved_memes',
          JSON.stringify([mockMeme2, mockMeme])
        );
      });

      it('should throw error on save failure', async () => {
        (AsyncStorage.setItem as jest.Mock).mockRejectedValueOnce(
          new Error('Storage error')
        );

        await expect(saveMeme(mockMeme)).rejects.toThrow('Storage error');
      });
    });

    describe('getSavedMemes', () => {
      it('should return empty array when no memes exist', async () => {
        (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);

        const result = await getSavedMemes();

        expect(result).toEqual([]);
      });

      it('should return saved memes', async () => {
        (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
          JSON.stringify([mockMeme, mockMeme2])
        );

        const result = await getSavedMemes();

        expect(result).toEqual([mockMeme, mockMeme2]);
      });

      it('should return empty array on error', async () => {
        (AsyncStorage.getItem as jest.Mock).mockRejectedValueOnce(
          new Error('Storage error')
        );

        const result = await getSavedMemes();

        expect(result).toEqual([]);
      });
    });

    describe('deleteMeme', () => {
      it('should delete a meme by id', async () => {
        (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
          JSON.stringify([mockMeme, mockMeme2])
        );

        await deleteMeme('test-meme-1');

        expect(AsyncStorage.setItem).toHaveBeenCalledWith(
          '@meme_generator:saved_memes',
          JSON.stringify([mockMeme2])
        );
      });

      it('should handle deleting non-existent meme', async () => {
        (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
          JSON.stringify([mockMeme])
        );

        await deleteMeme('non-existent-id');

        expect(AsyncStorage.setItem).toHaveBeenCalledWith(
          '@meme_generator:saved_memes',
          JSON.stringify([mockMeme])
        );
      });

      it('should throw error on delete failure', async () => {
        (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
          JSON.stringify([mockMeme])
        );
        (AsyncStorage.setItem as jest.Mock).mockRejectedValueOnce(
          new Error('Storage error')
        );

        await expect(deleteMeme('test-meme-1')).rejects.toThrow('Storage error');
      });
    });
  });

  describe('Onboarding', () => {
    describe('setOnboardingCompleted', () => {
      it('should set onboarding as completed', async () => {
        await setOnboardingCompleted();

        expect(AsyncStorage.setItem).toHaveBeenCalledWith(
          '@meme_generator:onboarding_completed',
          'true'
        );
      });

      it('should not throw on error', async () => {
        (AsyncStorage.setItem as jest.Mock).mockRejectedValueOnce(
          new Error('Storage error')
        );

        await expect(setOnboardingCompleted()).resolves.toBeUndefined();
      });
    });

    describe('getOnboardingCompleted', () => {
      it('should return true when onboarding is completed', async () => {
        (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce('true');

        const result = await getOnboardingCompleted();

        expect(result).toBe(true);
      });

      it('should return false when onboarding is not completed', async () => {
        (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);

        const result = await getOnboardingCompleted();

        expect(result).toBe(false);
      });

      it('should return false on error', async () => {
        (AsyncStorage.getItem as jest.Mock).mockRejectedValueOnce(
          new Error('Storage error')
        );

        const result = await getOnboardingCompleted();

        expect(result).toBe(false);
      });
    });
  });

  describe('Ad Tracking', () => {
    describe('setLastAdTime', () => {
      it('should set last ad time to current timestamp', async () => {
        const now = Date.now();
        jest.spyOn(Date, 'now').mockReturnValue(now);

        await setLastAdTime();

        expect(AsyncStorage.setItem).toHaveBeenCalledWith(
          '@meme_generator:last_ad_time',
          now.toString()
        );
      });

      it('should not throw on error', async () => {
        (AsyncStorage.setItem as jest.Mock).mockRejectedValueOnce(
          new Error('Storage error')
        );

        await expect(setLastAdTime()).resolves.toBeUndefined();
      });
    });

    describe('getLastAdTime', () => {
      it('should return last ad time', async () => {
        const timestamp = 1234567890;
        (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
          timestamp.toString()
        );

        const result = await getLastAdTime();

        expect(result).toBe(timestamp);
      });

      it('should return 0 when no timestamp exists', async () => {
        (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);

        const result = await getLastAdTime();

        expect(result).toBe(0);
      });

      it('should return 0 on error', async () => {
        (AsyncStorage.getItem as jest.Mock).mockRejectedValueOnce(
          new Error('Storage error')
        );

        const result = await getLastAdTime();

        expect(result).toBe(0);
      });
    });
  });

  describe('Meme View Count', () => {
    describe('incrementMemeViewCount', () => {
      it('should increment count from 0 to 1', async () => {
        (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);

        const result = await incrementMemeViewCount();

        expect(result).toBe(1);
        expect(AsyncStorage.setItem).toHaveBeenCalledWith(
          '@meme_generator:meme_view_count',
          '1'
        );
      });

      it('should increment existing count', async () => {
        (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce('5');

        const result = await incrementMemeViewCount();

        expect(result).toBe(6);
        expect(AsyncStorage.setItem).toHaveBeenCalledWith(
          '@meme_generator:meme_view_count',
          '6'
        );
      });

      it('should return 0 on error', async () => {
        (AsyncStorage.getItem as jest.Mock).mockRejectedValueOnce(
          new Error('Storage error')
        );

        const result = await incrementMemeViewCount();

        expect(result).toBe(0);
      });
    });

    describe('resetMemeViewCount', () => {
      it('should reset count to 0', async () => {
        await resetMemeViewCount();

        expect(AsyncStorage.setItem).toHaveBeenCalledWith(
          '@meme_generator:meme_view_count',
          '0'
        );
      });

      it('should not throw on error', async () => {
        (AsyncStorage.setItem as jest.Mock).mockRejectedValueOnce(
          new Error('Storage error')
        );

        await expect(resetMemeViewCount()).resolves.toBeUndefined();
      });
    });
  });

  describe('clearAllData', () => {
    it('should clear all AsyncStorage data', async () => {
      await clearAllData();

      expect(AsyncStorage.clear).toHaveBeenCalled();
    });

    it('should throw error on clear failure', async () => {
      (AsyncStorage.clear as jest.Mock).mockRejectedValueOnce(
        new Error('Clear error')
      );

      await expect(clearAllData()).rejects.toThrow('Clear error');
    });
  });
});
