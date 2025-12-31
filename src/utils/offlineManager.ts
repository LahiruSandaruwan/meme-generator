/**
 * Offline Mode Manager
 * Handles offline functionality and network state
 * 100% FREE - Uses React Native NetInfo
 */

// Using stub implementation until NetInfo is properly configured
// import NetInfo, { NetInfoState } from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';

const OFFLINE_QUEUE_KEY = '@offline_queue';
const CACHED_TEMPLATES_KEY = '@cached_templates';
const NETWORK_STATE_KEY = '@network_state';

export interface OfflineQueueItem {
  id: string;
  type: 'share' | 'upload' | 'sync';
  data: any;
  timestamp: number;
  retries: number;
}

export interface CachedTemplate {
  id: string;
  uri: string;
  name: string;
  cachedAt: number;
}

/**
 * Check if device is online
 */
export const isOnline = async (): Promise<boolean> => {
  try {
    // Stub: Always return true until NetInfo is properly configured
    // const state = await NetInfo.fetch();
    // return state.isConnected === true && state.isInternetReachable === true;
    return true;
  } catch (error) {
    // If we can't determine, assume online to not block functionality
    return true;
  }
};

/**
 * Subscribe to network status changes
 */
export const subscribeToNetworkStatus = (
  callback: (isOnline: boolean) => void
): (() => void) => {
  // Stub: Always call callback with true until NetInfo is properly configured
  // const unsubscribe = NetInfo.addEventListener((state: NetInfoState) => {
  //   const online = state.isConnected === true && state.isInternetReachable === true;
  //   callback(online);
  callback(true);

  // Save current state
  AsyncStorage.setItem(NETWORK_STATE_KEY, JSON.stringify({
    isOnline: true,
    timestamp: Date.now(),
  })).catch(() => {});

  // Return no-op unsubscribe function
  return () => {};
  // Original code: });
  // return unsubscribe;
};

/**
 * Get current network state
 */
export const getNetworkState = async (): Promise<{
  isOnline: boolean;
  type: string | null;
  isInternetReachable: boolean | null;
}> => {
  try {
    // Stub: Always return online until NetInfo is properly configured
    // const state = await NetInfo.fetch();
    return {
      isOnline: true,
      type: 'wifi',
      isInternetReachable: true,
    };
  } catch (error) {
    return {
      isOnline: true,
      type: null,
      isInternetReachable: null,
    };
  }
};

/**
 * Add item to offline queue
 */
export const addToOfflineQueue = async (
  type: 'share' | 'upload' | 'sync',
  data: any
): Promise<void> => {
  try {
    const queue = await getOfflineQueue();
    const item: OfflineQueueItem = {
      id: `offline-${Date.now()}-${Math.random()}`,
      type,
      data,
      timestamp: Date.now(),
      retries: 0,
    };

    queue.push(item);
    await AsyncStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(queue));
  } catch (error) {
    if (__DEV__) console.error('Error adding to offline queue:', error);
  }
};

/**
 * Get offline queue
 */
export const getOfflineQueue = async (): Promise<OfflineQueueItem[]> => {
  try {
    const data = await AsyncStorage.getItem(OFFLINE_QUEUE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    return [];
  }
};

/**
 * Remove item from offline queue
 */
export const removeFromOfflineQueue = async (itemId: string): Promise<void> => {
  try {
    const queue = await getOfflineQueue();
    const filtered = queue.filter(item => item.id !== itemId);
    await AsyncStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(filtered));
  } catch (error) {
    if (__DEV__) console.error('Error removing from offline queue:', error);
  }
};

/**
 * Process offline queue (when back online)
 */
export const processOfflineQueue = async (
  processor: (item: OfflineQueueItem) => Promise<boolean>
): Promise<{ processed: number; failed: number }> => {
  let processed = 0;
  let failed = 0;

  try {
    const online = await isOnline();
    if (!online) {
      return { processed: 0, failed: 0 };
    }

    const queue = await getOfflineQueue();
    const remaining: OfflineQueueItem[] = [];

    for (const item of queue) {
      try {
        const success = await processor(item);
        if (success) {
          processed++;
        } else {
          // Increment retry count
          item.retries++;
          if (item.retries < 3) {
            remaining.push(item);
          } else {
            failed++;
          }
        }
      } catch (error) {
        item.retries++;
        if (item.retries < 3) {
          remaining.push(item);
        } else {
          failed++;
        }
      }
    }

    await AsyncStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(remaining));
  } catch (error) {
    if (__DEV__) console.error('Error processing offline queue:', error);
  }

  return { processed, failed };
};

/**
 * Clear offline queue
 */
export const clearOfflineQueue = async (): Promise<void> => {
  try {
    await AsyncStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify([]));
  } catch (error) {
    if (__DEV__) console.error('Error clearing offline queue:', error);
  }
};

/**
 * Cache template for offline access
 */
export const cacheTemplate = async (
  id: string,
  uri: string,
  name: string
): Promise<void> => {
  try {
    const cached = await getCachedTemplates();

    // Check if already cached
    const exists = cached.find(t => t.id === id);
    if (exists) return;

    const template: CachedTemplate = {
      id,
      uri,
      name,
      cachedAt: Date.now(),
    };

    cached.push(template);

    // Limit to 50 cached templates
    if (cached.length > 50) {
      cached.sort((a, b) => b.cachedAt - a.cachedAt);
      cached.splice(50);
    }

    await AsyncStorage.setItem(CACHED_TEMPLATES_KEY, JSON.stringify(cached));
  } catch (error) {
    if (__DEV__) console.error('Error caching template:', error);
  }
};

/**
 * Get cached templates
 */
export const getCachedTemplates = async (): Promise<CachedTemplate[]> => {
  try {
    const data = await AsyncStorage.getItem(CACHED_TEMPLATES_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    return [];
  }
};

/**
 * Check if template is cached
 */
export const isTemplateCached = async (id: string): Promise<boolean> => {
  const cached = await getCachedTemplates();
  return cached.some(t => t.id === id);
};

/**
 * Clear old cached templates (older than 30 days)
 */
export const clearOldCachedTemplates = async (): Promise<number> => {
  try {
    const cached = await getCachedTemplates();
    const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);

    const remaining = cached.filter(t => t.cachedAt > thirtyDaysAgo);
    const removed = cached.length - remaining.length;

    await AsyncStorage.setItem(CACHED_TEMPLATES_KEY, JSON.stringify(remaining));
    return removed;
  } catch (error) {
    return 0;
  }
};

/**
 * Get offline mode statistics
 */
export const getOfflineStats = async (): Promise<{
  queuedItems: number;
  cachedTemplates: number;
  isCurrentlyOnline: boolean;
  lastOnlineCheck: number;
}> => {
  const queue = await getOfflineQueue();
  const cached = await getCachedTemplates();
  const online = await isOnline();

  return {
    queuedItems: queue.length,
    cachedTemplates: cached.length,
    isCurrentlyOnline: online,
    lastOnlineCheck: Date.now(),
  };
};

/**
 * Enable offline-first mode
 * This ensures the app works seamlessly offline
 */
export const enableOfflineFirst = async (): Promise<void> => {
  try {
    // Pre-cache critical data
    // This is called on app startup

    // Listen for network changes
    NetInfo.addEventListener((state) => {
      const online = state.isConnected === true && state.isInternetReachable === true;

      // If just came back online, process queue
      if (online) {
        // Queue will be processed by the app
        if (__DEV__) console.log('Back online - queue ready for processing');
      }
    });
  } catch (error) {
    if (__DEV__) console.error('Error enabling offline-first mode:', error);
  }
};

/**
 * Get network quality indicator
 */
export const getNetworkQuality = async (): Promise<'offline' | 'poor' | 'good' | 'excellent'> => {
  try {
    const state = await NetInfo.fetch();

    if (!state.isConnected || state.isInternetReachable === false) {
      return 'offline';
    }

    // Check connection type
    if (state.type === 'wifi') {
      return 'excellent';
    } else if (state.type === 'cellular') {
      // Could add more granular checks here based on cellular data
      return 'good';
    } else if (state.type === 'ethernet') {
      return 'excellent';
    }

    return 'good';
  } catch (error) {
    return 'offline';
  }
};

/**
 * Check if feature requires internet
 */
export const requiresInternet = async (
  feature: 'share' | 'trending' | 'upload' | 'download'
): Promise<boolean> => {
  const online = await isOnline();

  if (!online) {
    return true; // Requires but doesn't have
  }

  return false; // Has internet
};

/**
 * Show offline message helper
 */
export const getOfflineMessage = (action: string): string => {
  return `Cannot ${action} while offline. This action will be queued and completed when you're back online.`;
};

/**
 * Export all offline data for backup
 */
export const exportOfflineData = async (): Promise<{
  queue: OfflineQueueItem[];
  cachedTemplates: CachedTemplate[];
  timestamp: number;
}> => {
  const queue = await getOfflineQueue();
  const cached = await getCachedTemplates();

  return {
    queue,
    cachedTemplates: cached,
    timestamp: Date.now(),
  };
};

/**
 * Import offline data from backup
 */
export const importOfflineData = async (data: {
  queue: OfflineQueueItem[];
  cachedTemplates: CachedTemplate[];
}): Promise<void> => {
  try {
    await AsyncStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(data.queue));
    await AsyncStorage.setItem(CACHED_TEMPLATES_KEY, JSON.stringify(data.cachedTemplates));
  } catch (error) {
    throw new Error('Failed to import offline data');
  }
};
