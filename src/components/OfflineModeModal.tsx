import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/colors';
import {
  getOfflineStats,
  getOfflineQueue,
  getNetworkQuality,
  type OfflineQueueItem,
} from '../utils/offlineManager';

interface OfflineModeModalProps {
  visible: boolean;
  onClose: () => void;
}

export const OfflineModeModal: React.FC<OfflineModeModalProps> = ({
  visible,
  onClose,
}) => {
  const [stats, setStats] = useState<{
    queuedItems: number;
    cachedTemplates: number;
    isCurrentlyOnline: boolean;
  }>({
    queuedItems: 0,
    cachedTemplates: 0,
    isCurrentlyOnline: true,
  });
  const [queue, setQueue] = useState<OfflineQueueItem[]>([]);
  const [networkQuality, setNetworkQuality] = useState<string>('good');

  useEffect(() => {
    if (visible) {
      loadData();
    }
  }, [visible]);

  const loadData = async () => {
    const offlineStats = await getOfflineStats();
    const offlineQueue = await getOfflineQueue();
    const quality = await getNetworkQuality();

    setStats(offlineStats);
    setQueue(offlineQueue);
    setNetworkQuality(quality);
  };

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case 'excellent':
        return '#4CAF50';
      case 'good':
        return '#8BC34A';
      case 'poor':
        return '#FF9800';
      case 'offline':
        return '#F44336';
      default:
        return colors.textLight;
    }
  };

  const getQualityIcon = (quality: string): any => {
    switch (quality) {
      case 'excellent':
        return 'wifi';
      case 'good':
        return 'wifi';
      case 'poor':
        return 'wifi-outline';
      case 'offline':
        return 'cloud-offline';
      default:
        return 'help-circle-outline';
    }
  };

  const getActionIcon = (type: string): any => {
    switch (type) {
      case 'share':
        return 'share-social';
      case 'upload':
        return 'cloud-upload';
      case 'sync':
        return 'sync';
      default:
        return 'document';
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Ionicons name="cloud-offline" size={24} color={colors.primary} />
              <Text style={styles.title}>Offline Mode</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={28} color={colors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Network Status */}
            <View style={styles.statusCard}>
              <View style={styles.statusHeader}>
                <Ionicons
                  name={getQualityIcon(networkQuality)}
                  size={32}
                  color={getQualityColor(networkQuality)}
                />
                <View style={styles.statusTextContainer}>
                  <Text style={styles.statusTitle}>
                    {stats.isCurrentlyOnline ? 'Online' : 'Offline'}
                  </Text>
                  <Text style={styles.statusSubtitle}>
                    Network: {networkQuality.charAt(0).toUpperCase() + networkQuality.slice(1)}
                  </Text>
                </View>
              </View>
            </View>

            {/* Stats Cards */}
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <Ionicons name="timer" size={24} color={colors.primary} />
                <Text style={styles.statNumber}>{stats.queuedItems}</Text>
                <Text style={styles.statLabel}>Queued Items</Text>
              </View>

              <View style={styles.statCard}>
                <Ionicons name="images" size={24} color={colors.primary} />
                <Text style={styles.statNumber}>{stats.cachedTemplates}</Text>
                <Text style={styles.statLabel}>Cached Templates</Text>
              </View>
            </View>

            {/* Features Available Offline */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Available Offline</Text>
              <View style={styles.featureList}>
                <View style={styles.featureItem}>
                  <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
                  <Text style={styles.featureText}>Create memes with local templates</Text>
                </View>
                <View style={styles.featureItem}>
                  <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
                  <Text style={styles.featureText}>Edit existing memes</Text>
                </View>
                <View style={styles.featureItem}>
                  <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
                  <Text style={styles.featureText}>Browse your gallery</Text>
                </View>
                <View style={styles.featureItem}>
                  <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
                  <Text style={styles.featureText}>Save to device</Text>
                </View>
                <View style={styles.featureItem}>
                  <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
                  <Text style={styles.featureText}>Multi-panel creator</Text>
                </View>
                <View style={styles.featureItem}>
                  <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
                  <Text style={styles.featureText}>Daily challenges</Text>
                </View>
              </View>
            </View>

            {/* Features Requiring Internet */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Requires Internet</Text>
              <View style={styles.featureList}>
                <View style={styles.featureItem}>
                  <Ionicons name="close-circle" size={20} color="#FF9800" />
                  <Text style={styles.featureText}>Reddit trending memes</Text>
                </View>
                <View style={styles.featureItem}>
                  <Ionicons name="close-circle" size={20} color="#FF9800" />
                  <Text style={styles.featureText}>Social media sharing</Text>
                </View>
              </View>
            </View>

            {/* Queued Actions */}
            {queue.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>
                  Queued Actions ({queue.length})
                </Text>
                <Text style={styles.sectionSubtitle}>
                  These will be completed when you're back online
                </Text>
                {queue.map((item) => (
                  <View key={item.id} style={styles.queueItem}>
                    <Ionicons
                      name={getActionIcon(item.type)}
                      size={20}
                      color={colors.primary}
                    />
                    <View style={styles.queueItemContent}>
                      <Text style={styles.queueItemTitle}>
                        {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                      </Text>
                      <Text style={styles.queueItemTime}>
                        {new Date(item.timestamp).toLocaleString()}
                      </Text>
                    </View>
                    <View style={styles.retryBadge}>
                      <Text style={styles.retryText}>{item.retries}/3</Text>
                    </View>
                  </View>
                ))}
              </View>
            )}

            {/* Info */}
            <View style={styles.infoCard}>
              <Ionicons name="information-circle" size={24} color={colors.primary} />
              <View style={styles.infoContent}>
                <Text style={styles.infoTitle}>How Offline Mode Works</Text>
                <Text style={styles.infoText}>
                  When offline, you can still create and edit memes using cached templates and local features. Actions requiring internet (like sharing) will be queued and automatically completed when you're back online.
                </Text>
              </View>
            </View>
          </ScrollView>

          {/* Action Button */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={onClose}
            >
              <Text style={styles.actionButtonText}>Got It</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  closeButton: {
    padding: 4,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  statusCard: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  statusTextContainer: {
    flex: 1,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  statusSubtitle: {
    fontSize: 14,
    color: colors.textLight,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary,
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textLight,
    marginTop: 4,
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: colors.textLight,
    marginBottom: 12,
  },
  featureList: {
    gap: 10,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureText: {
    fontSize: 14,
    color: colors.text,
  },
  queueItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  queueItemContent: {
    flex: 1,
  },
  queueItemTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  queueItemTime: {
    fontSize: 12,
    color: colors.textLight,
  },
  retryBadge: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  retryText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.white,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: `${colors.primary}10`,
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 6,
  },
  infoText: {
    fontSize: 13,
    color: colors.textLight,
    lineHeight: 20,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  actionButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
  },
});
