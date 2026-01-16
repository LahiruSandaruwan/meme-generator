import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/colors';
import {
  getChallengeStats,
  completeChallenge,
  getUpcomingChallenges,
  getCompletedChallengeHistory,
  type ChallengeStats,
  type DailyChallenge,
  type Achievement,
} from '../utils/dailyChallenge';

interface DailyChallengeModalProps {
  visible: boolean;
  onClose: () => void;
  onStartChallenge?: () => void;
}

export const DailyChallengeModal: React.FC<DailyChallengeModalProps> = ({
  visible,
  onClose,
  onStartChallenge,
}) => {
  const [stats, setStats] = useState<ChallengeStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'today' | 'upcoming' | 'achievements'>('today');
  const [upcomingChallenges, setUpcomingChallenges] = useState<DailyChallenge[]>([]);
  const [history, setHistory] = useState<DailyChallenge[]>([]);

  useEffect(() => {
    if (visible) {
      loadStats();
    }
  }, [visible]);

  const loadStats = async () => {
    setLoading(true);
    try {
      const challengeStats = await getChallengeStats();
      const upcoming = getUpcomingChallenges();
      const completedHistory = await getCompletedChallengeHistory();

      setStats(challengeStats);
      setUpcomingChallenges(upcoming);
      setHistory(completedHistory);
    } catch (error) {
      console.error('Error loading challenge stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteChallenge = async () => {
    try {
      const newStreak = await completeChallenge();
      await loadStats();

      Alert.alert(
        '🎉 Challenge Completed!',
        `Great job! Current streak: ${newStreak.current} day${newStreak.current > 1 ? 's' : ''}`,
        [
          {
            text: 'Awesome!',
            style: 'default',
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to complete challenge. Please try again.');
    }
  };

  const handleStartChallenge = () => {
    onClose();
    onStartChallenge?.();
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return '#4CAF50';
      case 'Medium':
        return '#FF9800';
      case 'Hard':
        return '#F44336';
      default:
        return colors.primary;
    }
  };

  const renderTodayTab = () => {
    if (!stats) return null;

    const { todayChallenge, completedToday, streak } = stats;
    const isNewUser = streak.total === 0;

    return (
      <ScrollView
        style={styles.tabContent}
        contentContainerStyle={styles.tabContentScroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Welcome Message for New Users */}
        {isNewUser && (
          <View style={styles.welcomeCard}>
            <View style={styles.welcomeHeader}>
              <Ionicons name="calendar" size={40} color="#FFD700" />
              <Text style={styles.welcomeTitle}>Welcome to Daily Challenges!</Text>
            </View>
            <Text style={styles.welcomeText}>
              Complete daily challenges to build your streak, unlock achievements, and improve your meme-making skills. Each day brings a new creative prompt!
            </Text>
          </View>
        )}

        {/* Streak Display */}
        <View style={styles.streakCard}>
          <View style={styles.streakHeader}>
            <Ionicons name="flame" size={32} color="#FF6B35" />
            <Text style={styles.streakTitle}>Current Streak</Text>
          </View>
          <View style={styles.streakStats}>
            <View style={styles.streakStat}>
              <Text style={styles.streakNumber}>{streak.current}</Text>
              <Text style={styles.streakLabel}>Current</Text>
            </View>
            <View style={styles.streakDivider} />
            <View style={styles.streakStat}>
              <Text style={styles.streakNumber}>{streak.longest}</Text>
              <Text style={styles.streakLabel}>Best</Text>
            </View>
            <View style={styles.streakDivider} />
            <View style={styles.streakStat}>
              <Text style={styles.streakNumber}>{streak.total}</Text>
              <Text style={styles.streakLabel}>Total</Text>
            </View>
          </View>
        </View>

        {/* Today's Challenge */}
        <View style={styles.challengeCard}>
          <View style={styles.challengeHeader}>
            <Text style={styles.challengeTitle}>Today's Challenge</Text>
            <View
              style={[
                styles.difficultyBadge,
                { backgroundColor: `${getDifficultyColor(todayChallenge.difficulty)}20` },
              ]}
            >
              <Text
                style={[
                  styles.difficultyText,
                  { color: getDifficultyColor(todayChallenge.difficulty) },
                ]}
              >
                {todayChallenge.difficulty}
              </Text>
            </View>
          </View>

          <View style={styles.categoryBadge}>
            <Ionicons name="pricetag" size={16} color={colors.primary} />
            <Text style={styles.categoryText}>{todayChallenge.category}</Text>
          </View>

          <Text style={styles.promptText}>"{todayChallenge.prompt}"</Text>

          {todayChallenge.tips && todayChallenge.tips.length > 0 && (
            <View style={styles.tipsSection}>
              <View style={styles.tipsHeader}>
                <Ionicons name="bulb" size={18} color="#FFD700" />
                <Text style={styles.tipsTitle}>Pro Tips:</Text>
              </View>
              {todayChallenge.tips.map((tip, index) => (
                <View key={index} style={styles.tipItem}>
                  <Text style={styles.tipBullet}>•</Text>
                  <Text style={styles.tipText}>{tip}</Text>
                </View>
              ))}
            </View>
          )}

          {completedToday ? (
            <View style={styles.completedBadge}>
              <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
              <Text style={styles.completedText}>Completed Today!</Text>
            </View>
          ) : (
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={[styles.button, styles.startButton]}
                onPress={handleStartChallenge}
              >
                <Ionicons name="create" size={20} color={colors.white} />
                <Text style={styles.buttonText}>Start Creating</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.completeButton]}
                onPress={handleCompleteChallenge}
              >
                <Ionicons name="checkmark" size={20} color={colors.primary} />
                <Text style={styles.completeButtonText}>Mark Complete</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* History Preview */}
        {history.length > 0 && (
          <View style={styles.historySection}>
            <Text style={styles.sectionTitle}>Recent Completions</Text>
            {history.slice(0, 3).map((challenge) => (
              <View key={challenge.id} style={styles.historyItem}>
                <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
                <View style={styles.historyContent}>
                  <Text style={styles.historyDate}>{challenge.date}</Text>
                  <Text style={styles.historyPrompt} numberOfLines={1}>
                    {challenge.prompt}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    );
  };

  const renderUpcomingTab = () => {
    return (
      <ScrollView
        style={styles.tabContent}
        contentContainerStyle={styles.tabContentScroll}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>Next 7 Days</Text>
        {upcomingChallenges.map((challenge, index) => (
          <View key={challenge.id} style={styles.upcomingCard}>
            <View style={styles.upcomingHeader}>
              <View style={styles.upcomingDay}>
                <Text style={styles.upcomingDayText}>Day {index + 1}</Text>
              </View>
              <View
                style={[
                  styles.difficultyBadge,
                  { backgroundColor: `${getDifficultyColor(challenge.difficulty)}20` },
                ]}
              >
                <Text
                  style={[
                    styles.difficultyText,
                    { color: getDifficultyColor(challenge.difficulty) },
                  ]}
                >
                  {challenge.difficulty}
                </Text>
              </View>
            </View>
            <View style={styles.categoryBadge}>
              <Ionicons name="pricetag" size={14} color={colors.textLight} />
              <Text style={[styles.categoryText, { color: colors.textLight }]}>
                {challenge.category}
              </Text>
            </View>
            <Text style={styles.upcomingPrompt}>"{challenge.prompt}"</Text>
          </View>
        ))}
      </ScrollView>
    );
  };

  const renderAchievementsTab = () => {
    if (!stats) return null;

    const unlocked = stats.achievements.filter(a => a.unlocked);
    const locked = stats.achievements.filter(a => !a.unlocked);

    return (
      <ScrollView
        style={styles.tabContent}
        contentContainerStyle={styles.tabContentScroll}
        showsVerticalScrollIndicator={false}
      >
        {unlocked.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Unlocked ({unlocked.length})</Text>
            {unlocked.map((achievement) => (
              <View key={achievement.id} style={styles.achievementCard}>
                <View style={styles.achievementIcon}>
                  <Ionicons name={achievement.icon as any} size={28} color="#FFD700" />
                </View>
                <View style={styles.achievementContent}>
                  <Text style={styles.achievementTitle}>{achievement.title}</Text>
                  <Text style={styles.achievementDescription}>
                    {achievement.description}
                  </Text>
                  {achievement.unlockedDate && (
                    <Text style={styles.achievementDate}>
                      Unlocked: {achievement.unlockedDate}
                    </Text>
                  )}
                </View>
              </View>
            ))}
          </>
        )}

        {locked.length > 0 && (
          <>
            <Text style={[styles.sectionTitle, { marginTop: 24 }]}>
              Locked ({locked.length})
            </Text>
            {locked.map((achievement) => (
              <View key={achievement.id} style={[styles.achievementCard, styles.lockedCard]}>
                <View style={[styles.achievementIcon, styles.lockedIcon]}>
                  <Ionicons name="lock-closed" size={28} color={colors.textLight} />
                </View>
                <View style={styles.achievementContent}>
                  <Text style={[styles.achievementTitle, styles.lockedText]}>
                    {achievement.title}
                  </Text>
                  <Text style={styles.achievementDescription}>
                    {achievement.description}
                  </Text>
                </View>
              </View>
            ))}
          </>
        )}
      </ScrollView>
    );
  };

  if (loading || !stats) {
    return (
      <Modal
        visible={visible}
        transparent
        animationType="slide"
        onRequestClose={onClose}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Loading challenge...</Text>
            </View>
          </View>
        </View>
      </Modal>
    );
  }

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
              <Ionicons name="calendar" size={24} color={colors.primary} />
              <Text style={styles.title}>Daily Challenge</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={28} color={colors.text} />
            </TouchableOpacity>
          </View>

          {/* Tabs */}
          <View style={styles.tabs}>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'today' && styles.activeTab]}
              onPress={() => setActiveTab('today')}
            >
              <Ionicons
                name="today"
                size={20}
                color={activeTab === 'today' ? colors.primary : colors.textLight}
              />
              <Text
                style={[
                  styles.tabText,
                  activeTab === 'today' && styles.activeTabText,
                ]}
              >
                Today
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tab, activeTab === 'upcoming' && styles.activeTab]}
              onPress={() => setActiveTab('upcoming')}
            >
              <Ionicons
                name="calendar-outline"
                size={20}
                color={activeTab === 'upcoming' ? colors.primary : colors.textLight}
              />
              <Text
                style={[
                  styles.tabText,
                  activeTab === 'upcoming' && styles.activeTabText,
                ]}
              >
                Upcoming
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tab, activeTab === 'achievements' && styles.activeTab]}
              onPress={() => setActiveTab('achievements')}
            >
              <Ionicons
                name="trophy"
                size={20}
                color={activeTab === 'achievements' ? colors.primary : colors.textLight}
              />
              <Text
                style={[
                  styles.tabText,
                  activeTab === 'achievements' && styles.activeTabText,
                ]}
              >
                Achievements
              </Text>
            </TouchableOpacity>
          </View>

          {/* Tab Content */}
          {activeTab === 'today' && renderTodayTab()}
          {activeTab === 'upcoming' && renderUpcomingTab()}
          {activeTab === 'achievements' && renderAchievementsTab()}
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
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: colors.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textLight,
  },
  activeTabText: {
    color: colors.primary,
  },
  tabContent: {
    flex: 1,
  },
  tabContentScroll: {
    padding: 16,
  },
  loadingContainer: {
    padding: 48,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: colors.textLight,
  },
  streakCard: {
    backgroundColor: '#FFF9E6',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  streakHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  streakTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  streakStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  streakStat: {
    alignItems: 'center',
  },
  streakNumber: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.primary,
  },
  streakLabel: {
    fontSize: 12,
    color: colors.textLight,
    marginTop: 4,
  },
  streakDivider: {
    width: 1,
    backgroundColor: colors.border,
  },
  challengeCard: {
    backgroundColor: colors.background,
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: colors.border,
  },
  challengeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  challengeTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  difficultyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: '600',
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  promptText: {
    fontSize: 16,
    fontStyle: 'italic',
    color: colors.text,
    lineHeight: 24,
    marginBottom: 16,
  },
  tipsSection: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  tipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  tipsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  tipItem: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  tipBullet: {
    fontSize: 14,
    color: colors.textLight,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: colors.textLight,
    lineHeight: 20,
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#E8F5E9',
    borderRadius: 12,
    padding: 16,
  },
  completedText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4CAF50',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 14,
    borderRadius: 12,
  },
  startButton: {
    backgroundColor: colors.primary,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
  },
  completeButton: {
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  completeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  historySection: {
    marginTop: 24,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  historyContent: {
    flex: 1,
  },
  historyDate: {
    fontSize: 12,
    color: colors.textLight,
    marginBottom: 2,
  },
  historyPrompt: {
    fontSize: 14,
    color: colors.text,
  },
  upcomingCard: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  upcomingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  upcomingDay: {
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  upcomingDayText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.white,
  },
  upcomingPrompt: {
    fontSize: 14,
    fontStyle: 'italic',
    color: colors.text,
    marginTop: 8,
  },
  achievementCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  lockedCard: {
    borderColor: colors.border,
    opacity: 0.6,
  },
  achievementIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFF9E6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lockedIcon: {
    backgroundColor: colors.background,
  },
  achievementContent: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  lockedText: {
    color: colors.textLight,
  },
  achievementDescription: {
    fontSize: 14,
    color: colors.textLight,
  },
  achievementDate: {
    fontSize: 12,
    color: colors.textLight,
    marginTop: 4,
    fontStyle: 'italic',
  },
  welcomeCard: {
    backgroundColor: '#FFF9E6',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  welcomeHeader: {
    alignItems: 'center',
    marginBottom: 12,
  },
  welcomeTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginTop: 8,
    textAlign: 'center',
  },
  welcomeText: {
    fontSize: 15,
    color: colors.text,
    lineHeight: 22,
    textAlign: 'center',
  },
});
