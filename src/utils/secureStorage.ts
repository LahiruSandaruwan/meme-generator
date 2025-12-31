/**
 * Secure Storage Utility
 * Wrapper around expo-secure-store for sensitive data storage
 * Falls back to AsyncStorage for non-sensitive data
 */

import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { logError } from '../services/errorTracking';

/**
 * Secure storage keys for sensitive data
 */
const SECURE_KEYS = {
  USER_TOKEN: '@secure:user_token',
  PREMIUM_PURCHASE_TOKEN: '@secure:premium_token',
  USER_CREDENTIALS: '@secure:user_creds',
};

/**
 * Check if secure storage is available on this platform
 */
const isSecureStoreAvailable = (): boolean => {
  // SecureStore is available on iOS and Android
  return Platform.OS === 'ios' || Platform.OS === 'android';
};

/**
 * Store a value securely
 * @param key - Storage key
 * @param value - Value to store
 * @param options - SecureStore options
 */
export const setSecureItem = async (
  key: string,
  value: string,
  options?: SecureStore.SecureStoreOptions
): Promise<void> => {
  try {
    if (isSecureStoreAvailable()) {
      await SecureStore.setItemAsync(key, value, options);
    } else {
      // Fallback to AsyncStorage for web
      await AsyncStorage.setItem(key, value);
      if (__DEV__) {
        console.warn(
          `SecureStore not available on ${Platform.OS}, using AsyncStorage as fallback`
        );
      }
    }
  } catch (error) {
    logError(error as Error, {
      context: 'setSecureItem',
      key,
    });
    throw error;
  }
};

/**
 * Retrieve a value from secure storage
 * @param key - Storage key
 * @param options - SecureStore options
 * @returns The stored value or null if not found
 */
export const getSecureItem = async (
  key: string,
  options?: SecureStore.SecureStoreOptions
): Promise<string | null> => {
  try {
    if (isSecureStoreAvailable()) {
      return await SecureStore.getItemAsync(key, options);
    } else {
      // Fallback to AsyncStorage for web
      return await AsyncStorage.getItem(key);
    }
  } catch (error) {
    logError(error as Error, {
      context: 'getSecureItem',
      key,
    });
    return null;
  }
};

/**
 * Delete a value from secure storage
 * @param key - Storage key
 * @param options - SecureStore options
 */
export const deleteSecureItem = async (
  key: string,
  options?: SecureStore.SecureStoreOptions
): Promise<void> => {
  try {
    if (isSecureStoreAvailable()) {
      await SecureStore.deleteItemAsync(key, options);
    } else {
      // Fallback to AsyncStorage for web
      await AsyncStorage.removeItem(key);
    }
  } catch (error) {
    logError(error as Error, {
      context: 'deleteSecureItem',
      key,
    });
    throw error;
  }
};

/**
 * Store user authentication token securely
 * @param token - Auth token
 */
export const setUserToken = async (token: string): Promise<void> => {
  await setSecureItem(SECURE_KEYS.USER_TOKEN, token, {
    keychainAccessible: SecureStore.WHEN_UNLOCKED,
  });
};

/**
 * Retrieve user authentication token
 * @returns Auth token or null
 */
export const getUserToken = async (): Promise<string | null> => {
  return await getSecureItem(SECURE_KEYS.USER_TOKEN);
};

/**
 * Delete user authentication token
 */
export const deleteUserToken = async (): Promise<void> => {
  await deleteSecureItem(SECURE_KEYS.USER_TOKEN);
};

/**
 * Store premium purchase token securely
 * @param token - Purchase token/receipt
 */
export const setPremiumToken = async (token: string): Promise<void> => {
  await setSecureItem(SECURE_KEYS.PREMIUM_PURCHASE_TOKEN, token, {
    keychainAccessible: SecureStore.WHEN_UNLOCKED,
  });
};

/**
 * Retrieve premium purchase token
 * @returns Purchase token or null
 */
export const getPremiumToken = async (): Promise<string | null> => {
  return await getSecureItem(SECURE_KEYS.PREMIUM_PURCHASE_TOKEN);
};

/**
 * Delete premium purchase token
 */
export const deletePremiumToken = async (): Promise<void> => {
  await deleteSecureItem(SECURE_KEYS.PREMIUM_PURCHASE_TOKEN);
};

/**
 * Store user credentials securely (use sparingly)
 * @param credentials - JSON string of credentials
 */
export const setUserCredentials = async (credentials: string): Promise<void> => {
  await setSecureItem(SECURE_KEYS.USER_CREDENTIALS, credentials, {
    keychainAccessible: SecureStore.WHEN_UNLOCKED,
  });
};

/**
 * Retrieve user credentials
 * @returns Credentials JSON string or null
 */
export const getUserCredentials = async (): Promise<string | null> => {
  return await getSecureItem(SECURE_KEYS.USER_CREDENTIALS);
};

/**
 * Delete user credentials
 */
export const deleteUserCredentials = async (): Promise<void> => {
  await deleteSecureItem(SECURE_KEYS.USER_CREDENTIALS);
};

/**
 * Clear all secure storage items
 * WARNING: This will delete all secure data
 */
export const clearAllSecureData = async (): Promise<void> => {
  try {
    await Promise.all([
      deleteUserToken(),
      deletePremiumToken(),
      deleteUserCredentials(),
    ]);
  } catch (error) {
    logError(error as Error, {
      context: 'clearAllSecureData',
    });
    throw error;
  }
};

/**
 * Export all secure storage functions
 */
export const SecureStorage = {
  setItem: setSecureItem,
  getItem: getSecureItem,
  deleteItem: deleteSecureItem,
  setUserToken,
  getUserToken,
  deleteUserToken,
  setPremiumToken,
  getPremiumToken,
  deletePremiumToken,
  setUserCredentials,
  getUserCredentials,
  deleteUserCredentials,
  clearAll: clearAllSecureData,
};

export default SecureStorage;
