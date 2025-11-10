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
  getStats,
  getMilestones,
  getStatsForPeriod,
  getLevel,
  formatTimeSpent,
  type MemeStats,
  type Milestone,
} from '../utils/memeStats';

interface MemeStatsModalProps {
  visible: boolean;
  onClose: () => void;
}

export const MemeStatsModal: React.FC<MemeStatsModalProps> = ({
  visible,
  onClose,
}) => {
  const [stats, setStats] = useState<MemeStats | null>(null);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<'today' | 'week' | 'month' | 'allTime'>('allTime');
  const [periodStats, setPeriodStats] = useState({ memesCreated: 0, averagePerDay: 0 });

  useEffect(() => {
    if (visible) {
      loadData();
    }
  }, [visible, selectedPeriod]);

  const loadData = async () => {
    const memeStats = await getStats();
    const milestonesData = await getMilestones();
    const periodData = await getStatsForPeriod(selectedPeriod);

    setStats(memeStats);
    setMilestones(milestonesData);
    setPeriodStats(periodData);
  };

  if (!stats) {
    return null;
  }

  const level = getLevel(stats.totalMemesCreated);
  const unlockedMilestones = milestones.filter(m => m.unlocked);
  const lockedMilestones = milestones.filter(m => !m.unlocked);

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
              <Ionicons name="stats-chart" size={24} color={colors.primary} />
              <Text style={styles.title}>Your Stats</Text>
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
            {/* Level Card */}
            <View style={styles.levelCard}>
              <View style={styles.levelHeader}>
                <View style={styles.levelBadge}>
                  <Text style={styles.levelNumber}>{level.level}</Text>
                </View>
                <View style={styles.levelInfo}>
                  <Text style={styles.levelTitle}>{level.title}</Text>
                  {level.nextMilestone > 0 && (
                    <Text style={styles.levelSubtitle}>
                      {level.nextMilestone - stats.totalMemesCreated} more to level up
                    </Text>
                  )}
                </View>
              </View>
              {level.nextMilestone > 0 && (
                <View style={styles.progressContainer}>
                  <View style={styles.progressBar}>
                    <View
                      style={[
                        styles.progressFill,
                        {
                          width: `${(stats.totalMemesCreated / level.nextMilestone) * 100}%`,
                        },
                      ]}
                    />
                  </View>
                  <Text style={styles.progressText}>
                    {stats.totalMemesCreated} / {level.nextMilestone}
                  </Text>
                </View>
              )}
            </View>

            {/* Period Selector */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.periodSelector}
              contentContainerStyle={styles.periodSelectorContent}
            >
              {['today', 'week', 'month', 'allTime'].map((period) => (
                <TouchableOpacity
                  key={period}
                  style={[
                    styles.periodButton,
                    selectedPeriod === period && styles.periodButtonActive,
                  ]}
                  onPress={() => setSelectedPeriod(period as any)}
                >
                  <Text
                    style={[
                      styles.periodButtonText,
                      selectedPeriod === period && styles.periodButtonTextActive,
                    ]}
                  >
                    {period === 'allTime' ? 'All Time' : period.charAt(0).toUpperCase() + period.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Stats Grid */}
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <Ionicons name="images" size={24} color={colors.primary} />
                <Text style={styles.statNumber}>{periodStats.memesCreated}</Text>
                <Text style={styles.statLabel}>Memes Created</Text>
              </View>

              <View style={styles.statCard}>
                <Ionicons name="trending-up" size={24} color="#4CAF50" />
                <Text style={styles.statNumber}>{periodStats.averagePerDay.toFixed(1)}</Text>
                <Text style={styles.statLabel}>Avg Per Day</Text>
              </View>
            </View>

            {selectedPeriod === 'allTime' && (
              <>
                {/* Additional All-Time Stats */}
                <View style={styles.statsGrid}>
                  <View style={styles.statCard}>
                    <Ionicons name="flame" size={24} color="#FF6B35" />
                    <Text style={styles.statNumber}>{stats.currentStreak}</Text>
                    <Text style={styles.statLabel}>Current Streak</Text>
                  </View>

                  <View style={styles.statCard}>
                    <Ionicons name="trophy" size={24} color="#FFD700" />
                    <Text style={styles.statNumber}>{stats.longestStreak}</Text>
                    <Text style={styles.statLabel}>Longest Streak</Text>
                  </View>
                </View>

                {/* Personal Records */}
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Personal Records</Text>
                  <View style={styles.recordCard}>
                    <Ionicons name="calendar" size={20} color={colors.primary} />
                    <View style={styles.recordContent}>
                      <Text style={styles.recordValue}>
                        {stats.personalRecords.mostMemesInDay.count} memes
                      </Text>
                      <Text style={styles.recordLabel}>
                        Most in a Day ({stats.personalRecords.mostMemesInDay.date || 'N/A'})
                      </Text>
                    </View>
                  </View>

                  <View style={styles.recordCard}>
                    <Ionicons name="time" size={20} color={colors.primary} />
                    <View style={styles.recordContent}>
                      <Text style={styles.recordValue}>
                        {formatTimeSpent(stats.totalTimeSpent)}
                      </Text>
                      <Text style={styles.recordLabel}>Total Time Creating</Text>
                    </View>
                  </View>

                  {stats.favoriteTemplate && (
                    <View style={styles.recordCard}>
                      <Ionicons name="heart" size={20} color="#F44336" />
                      <View style={styles.recordContent}>
                        <Text style={styles.recordValue}>
                          {stats.favoriteTemplate.name}
                        </Text>
                        <Text style={styles.recordLabel}>
                          Favorite Template ({stats.favoriteTemplate.count} uses)
                        </Text>
                      </View>
                    </View>
                  )}

                  {stats.mostUsedCategory && (
                    <View style={styles.recordCard}>
                      <Ionicons name="folder" size={20} color="#9C27B0" />
                      <View style={styles.recordContent}>
                        <Text style={styles.recordValue}>
                          {stats.mostUsedCategory.name}
                        </Text>
                        <Text style={styles.recordLabel}>
                          Most Used Category ({stats.mostUsedCategory.count} memes)
                        </Text>
                      </View>
                    </View>
                  )}
                </View>

                {/* Milestones */}
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>
                    Milestones ({unlockedMilestones.length}/{milestones.length})
                  </Text>

                  {unlockedMilestones.length > 0 && (
                    <>
                      <Text style={styles.subsectionTitle}>Unlocked</Text>
                      {unlockedMilestones.map((milestone) => (
                        <View key={milestone.id} style={styles.milestoneCard}>
                          <View style={styles.milestoneIcon}>
                            <Ionicons name={milestone.icon as any} size={24} color="#FFD700" />
                          </View>
                          <View style={styles.milestoneContent}>
                            <Text style={styles.milestoneTitle}>{milestone.title}</Text>
                            <Text style={styles.milestoneDescription}>
                              {milestone.description}
                            </Text>
                            {milestone.unlockedDate && (
                              <Text style={styles.milestoneDate}>
                                Unlocked {new Date(milestone.unlockedDate).toLocaleDateString()}
                              </Text>
                            )}
                          </View>
                        </View>
                      ))}
                    </>
                  )}

                  {lockedMilestones.length > 0 && (
                    <>
                      <Text style={[styles.subsectionTitle, { marginTop: 16 }]}>
                        Locked
                      </Text>
                      {lockedMilestones.map((milestone) => (
                        <View key={milestone.id} style={[styles.milestoneCard, styles.lockedMilestone]}>
                          <View style={[styles.milestoneIcon, styles.lockedIcon]}>
                            <Ionicons name="lock-closed" size={24} color={colors.textLight} />
                          </View>
                          <View style={styles.milestoneContent}>
                            <Text style={[styles.milestoneTitle, styles.lockedText]}>
                              {milestone.title}
                            </Text>
                            <Text style={styles.milestoneDescription}>
                              {milestone.description}
                            </Text>
                          </View>
                        </View>
                      ))}
                    </>
                  )}
                </View>
              </>
            )}

            {/* Info */}
            <View style={styles.infoCard}>
              <Ionicons name="information-circle" size={24} color={colors.primary} />
              <View style={styles.infoContent}>
                <Text style={styles.infoTitle}>Track Your Progress</Text>
                <Text style={styles.infoText}>
                  Keep creating memes to unlock achievements, maintain streaks, and level up your meme-making skills!
                </Text>
              </View>
            </View>
          </ScrollView>
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
  levelCard: {
    backgroundColor: `${colors.primary}10`,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  levelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 16,
  },
  levelBadge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  levelNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.white,
  },
  levelInfo: {
    flex: 1,
  },
  levelTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  levelSubtitle: {
    fontSize: 14,
    color: colors.textLight,
  },
  progressContainer: {
    gap: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.white,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: colors.textLight,
    textAlign: 'right',
  },
  periodSelector: {
    marginBottom: 16,
  },
  periodSelectorContent: {
    gap: 8,
  },
  periodButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  periodButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  periodButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  periodButtonTextActive: {
    color: colors.white,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
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
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  subsectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textLight,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  recordCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  recordContent: {
    flex: 1,
  },
  recordValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  recordLabel: {
    fontSize: 13,
    color: colors.textLight,
  },
  milestoneCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  lockedMilestone: {
    borderColor: colors.border,
    opacity: 0.6,
  },
  milestoneIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFF9E6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lockedIcon: {
    backgroundColor: colors.background,
  },
  milestoneContent: {
    flex: 1,
  },
  milestoneTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 2,
  },
  lockedText: {
    color: colors.textLight,
  },
  milestoneDescription: {
    fontSize: 13,
    color: colors.textLight,
  },
  milestoneDate: {
    fontSize: 11,
    color: colors.textLight,
    marginTop: 4,
    fontStyle: 'italic',
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
});
