import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/colors';
import {
  subscribeToNetworkStatus,
  getOfflineQueue,
  getOfflineStats,
} from '../utils/offlineManager';

interface OfflineIndicatorProps {
  onPress?: () => void;
}

export const OfflineIndicator: React.FC<OfflineIndicatorProps> = ({ onPress }) => {
  const [isOnline, setIsOnline] = useState(true);
  const [queuedItems, setQueuedItems] = useState(0);
  const [slideAnim] = useState(new Animated.Value(-100));

  useEffect(() => {
    loadStats();

    const unsubscribe = subscribeToNetworkStatus((online) => {
      setIsOnline(online);

      if (!online) {
        // Slide down when offline
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: true,
          tension: 65,
          friction: 8,
        }).start();
      } else {
        // Slide up when back online
        Animated.timing(slideAnim, {
          toValue: -100,
          duration: 300,
          useNativeDriver: true,
        }).start();
      }

      loadStats();
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const loadStats = async () => {
    const stats = await getOfflineStats();
    setQueuedItems(stats.queuedItems);
  };

  if (isOnline) {
    return null;
  }

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <TouchableOpacity
        style={styles.content}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <View style={styles.iconContainer}>
          <Ionicons name="cloud-offline" size={20} color={colors.white} />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>You're Offline</Text>
          <Text style={styles.subtitle}>
            {queuedItems > 0
              ? `${queuedItems} action${queuedItems > 1 ? 's' : ''} queued`
              : 'Limited functionality available'}
          </Text>
        </View>
        {onPress && (
          <Ionicons name="information-circle-outline" size={20} color={colors.white} />
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    backgroundColor: '#FF6B35',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    paddingTop: 16,
  },
  iconContainer: {
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.white,
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 12,
    color: colors.white,
    opacity: 0.9,
  },
});
