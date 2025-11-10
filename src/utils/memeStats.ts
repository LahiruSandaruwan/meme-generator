/**
 * Meme Stats & Analytics
 * Track user's meme creation statistics
 * 100% FREE - Uses AsyncStorage
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

const STATS_KEY = '@meme_stats';
const MILESTONES_KEY = '@meme_milestones';

export interface MemeStats {
  totalMemesCreated: number;
  firstMemeDate: number | null;
  lastMemeDate: number | null;
  favoriteTemplate: {
    id: string;
    name: string;
    count: number;
  } | null;
  mostUsedCategory: {
    name: string;
    count: number;
  } | null;
  templateUsage: Record<string, number>;
  categoryUsage: Record<string, number>;
  dailyStats: Record<string, number>; // YYYY-MM-DD -> count
  weeklyStats: Record<string, number>; // Week number -> count
  monthlyStats: Record<string, number>; // YYYY-MM -> count
  averageMemesPerDay: number;
  currentStreak: number;
  longestStreak: number;
  totalTimeSpent: number; // milliseconds
  achievements: string[];
  personalRecords: {
    mostMemesInDay: { count: number; date: string };
    mostMemesInWeek: { count: number; week: string };
    mostMemesInMonth: { count: number; month: string };
  };
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  icon: string;
  threshold: number;
  unlocked: boolean;
  unlockedDate?: number;
  category: 'total' | 'streak' | 'speed' | 'variety';
}

/**
 * Initialize stats
 */
const getDefaultStats = (): MemeStats => ({
  totalMemesCreated: 0,
  firstMemeDate: null,
  lastMemeDate: null,
  favoriteTemplate: null,
  mostUsedCategory: null,
  templateUsage: {},
  categoryUsage: {},
  dailyStats: {},
  weeklyStats: {},
  monthlyStats: {},
  averageMemesPerDay: 0,
  currentStreak: 0,
  longestStreak: 0,
  totalTimeSpent: 0,
  achievements: [],
  personalRecords: {
    mostMemesInDay: { count: 0, date: '' },
    mostMemesInWeek: { count: 0, week: '' },
    mostMemesInMonth: { count: 0, month: '' },
  },
});

/**
 * Get current stats
 */
export const getStats = async (): Promise<MemeStats> => {
  try {
    const data = await AsyncStorage.getItem(STATS_KEY);
    if (data) {
      return JSON.parse(data);
    }
    return getDefaultStats();
  } catch (error) {
    return getDefaultStats();
  }
};

/**
 * Track meme creation
 */
export const trackMemeCreation = async (
  templateId?: string,
  templateName?: string,
  category?: string,
  timeSpent?: number
): Promise<MemeStats> => {
  const stats = await getStats();
  const now = Date.now();
  const today = formatDate(new Date());
  const week = getWeekNumber(new Date());
  const month = formatMonth(new Date());

  // Update total
  stats.totalMemesCreated++;

  // Update dates
  if (!stats.firstMemeDate) {
    stats.firstMemeDate = now;
  }
  stats.lastMemeDate = now;

  // Update template usage
  if (templateId && templateName) {
    stats.templateUsage[templateId] = (stats.templateUsage[templateId] || 0) + 1;

    // Update favorite template
    const currentCount = stats.templateUsage[templateId];
    if (!stats.favoriteTemplate || currentCount > stats.favoriteTemplate.count) {
      stats.favoriteTemplate = {
        id: templateId,
        name: templateName,
        count: currentCount,
      };
    }
  }

  // Update category usage
  if (category) {
    stats.categoryUsage[category] = (stats.categoryUsage[category] || 0) + 1;

    // Update most used category
    const currentCount = stats.categoryUsage[category];
    if (!stats.mostUsedCategory || currentCount > stats.mostUsedCategory.count) {
      stats.mostUsedCategory = {
        name: category,
        count: currentCount,
      };
    }
  }

  // Update daily stats
  stats.dailyStats[today] = (stats.dailyStats[today] || 0) + 1;

  // Update weekly stats
  stats.weeklyStats[week] = (stats.weeklyStats[week] || 0) + 1;

  // Update monthly stats
  stats.monthlyStats[month] = (stats.monthlyStats[month] || 0) + 1;

  // Update personal records
  const todayCount = stats.dailyStats[today];
  if (todayCount > stats.personalRecords.mostMemesInDay.count) {
    stats.personalRecords.mostMemesInDay = {
      count: todayCount,
      date: today,
    };
  }

  const weekCount = stats.weeklyStats[week];
  if (weekCount > stats.personalRecords.mostMemesInWeek.count) {
    stats.personalRecords.mostMemesInWeek = {
      count: weekCount,
      week,
    };
  }

  const monthCount = stats.monthlyStats[month];
  if (monthCount > stats.personalRecords.mostMemesInMonth.count) {
    stats.personalRecords.mostMemesInMonth = {
      count: monthCount,
      month,
    };
  }

  // Update streak
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = formatDate(yesterday);

  if (stats.dailyStats[yesterdayStr]) {
    stats.currentStreak++;
  } else if (!stats.dailyStats[today] || stats.dailyStats[today] === 1) {
    stats.currentStreak = 1;
  }

  if (stats.currentStreak > stats.longestStreak) {
    stats.longestStreak = stats.currentStreak;
  }

  // Update average
  if (stats.firstMemeDate) {
    const daysSinceFirst = Math.max(1, Math.floor((now - stats.firstMemeDate) / (1000 * 60 * 60 * 24)));
    stats.averageMemesPerDay = parseFloat((stats.totalMemesCreated / daysSinceFirst).toFixed(2));
  }

  // Update time spent
  if (timeSpent) {
    stats.totalTimeSpent += timeSpent;
  }

  // Save
  await AsyncStorage.setItem(STATS_KEY, JSON.stringify(stats));

  // Check milestones
  await checkMilestones(stats);

  return stats;
};

/**
 * Get milestones
 */
export const getMilestones = async (): Promise<Milestone[]> => {
  try {
    const data = await AsyncStorage.getItem(MILESTONES_KEY);
    const unlocked = data ? JSON.parse(data) : {};
    const stats = await getStats();

    const milestones: Milestone[] = [
      {
        id: 'first_meme',
        title: 'First Meme',
        description: 'Create your first meme',
        icon: 'flag',
        threshold: 1,
        category: 'total',
        unlocked: stats.totalMemesCreated >= 1,
        unlockedDate: unlocked['first_meme'],
      },
      {
        id: 'meme_10',
        title: 'Getting Started',
        description: 'Create 10 memes',
        icon: 'star',
        threshold: 10,
        category: 'total',
        unlocked: stats.totalMemesCreated >= 10,
        unlockedDate: unlocked['meme_10'],
      },
      {
        id: 'meme_50',
        title: 'Meme Apprentice',
        description: 'Create 50 memes',
        icon: 'star-half',
        threshold: 50,
        category: 'total',
        unlocked: stats.totalMemesCreated >= 50,
        unlockedDate: unlocked['meme_50'],
      },
      {
        id: 'meme_100',
        title: 'Meme Master',
        description: 'Create 100 memes',
        icon: 'medal',
        threshold: 100,
        category: 'total',
        unlocked: stats.totalMemesCreated >= 100,
        unlockedDate: unlocked['meme_100'],
      },
      {
        id: 'meme_500',
        title: 'Meme Legend',
        description: 'Create 500 memes',
        icon: 'trophy',
        threshold: 500,
        category: 'total',
        unlocked: stats.totalMemesCreated >= 500,
        unlockedDate: unlocked['meme_500'],
      },
      {
        id: 'meme_1000',
        title: 'Meme God',
        description: 'Create 1000 memes',
        icon: 'infinite',
        threshold: 1000,
        category: 'total',
        unlocked: stats.totalMemesCreated >= 1000,
        unlockedDate: unlocked['meme_1000'],
      },
      {
        id: 'streak_3',
        title: '3-Day Streak',
        description: 'Create memes for 3 days in a row',
        icon: 'flame',
        threshold: 3,
        category: 'streak',
        unlocked: stats.longestStreak >= 3,
        unlockedDate: unlocked['streak_3'],
      },
      {
        id: 'streak_7',
        title: 'Week Warrior',
        description: 'Create memes for 7 days in a row',
        icon: 'flame',
        threshold: 7,
        category: 'streak',
        unlocked: stats.longestStreak >= 7,
        unlockedDate: unlocked['streak_7'],
      },
      {
        id: 'streak_30',
        title: 'Monthly Master',
        description: 'Create memes for 30 days in a row',
        icon: 'flame',
        threshold: 30,
        category: 'streak',
        unlocked: stats.longestStreak >= 30,
        unlockedDate: unlocked['streak_30'],
      },
      {
        id: 'productive_day',
        title: 'Productive Day',
        description: 'Create 10 memes in one day',
        icon: 'rocket',
        threshold: 10,
        category: 'speed',
        unlocked: stats.personalRecords.mostMemesInDay.count >= 10,
        unlockedDate: unlocked['productive_day'],
      },
      {
        id: 'variety_10',
        title: 'Template Explorer',
        description: 'Use 10 different templates',
        icon: 'color-palette',
        threshold: 10,
        category: 'variety',
        unlocked: Object.keys(stats.templateUsage).length >= 10,
        unlockedDate: unlocked['variety_10'],
      },
      {
        id: 'variety_50',
        title: 'Template Master',
        description: 'Use 50 different templates',
        icon: 'albums',
        threshold: 50,
        category: 'variety',
        unlocked: Object.keys(stats.templateUsage).length >= 50,
        unlockedDate: unlocked['variety_50'],
      },
    ];

    return milestones;
  } catch (error) {
    return [];
  }
};

/**
 * Check and unlock milestones
 */
const checkMilestones = async (stats: MemeStats): Promise<void> => {
  try {
    const data = await AsyncStorage.getItem(MILESTONES_KEY);
    const unlocked = data ? JSON.parse(data) : {};
    const now = Date.now();
    let hasNewUnlocks = false;

    // Check each milestone
    if (stats.totalMemesCreated >= 1 && !unlocked['first_meme']) {
      unlocked['first_meme'] = now;
      hasNewUnlocks = true;
    }
    if (stats.totalMemesCreated >= 10 && !unlocked['meme_10']) {
      unlocked['meme_10'] = now;
      hasNewUnlocks = true;
    }
    if (stats.totalMemesCreated >= 50 && !unlocked['meme_50']) {
      unlocked['meme_50'] = now;
      hasNewUnlocks = true;
    }
    if (stats.totalMemesCreated >= 100 && !unlocked['meme_100']) {
      unlocked['meme_100'] = now;
      hasNewUnlocks = true;
    }
    if (stats.totalMemesCreated >= 500 && !unlocked['meme_500']) {
      unlocked['meme_500'] = now;
      hasNewUnlocks = true;
    }
    if (stats.totalMemesCreated >= 1000 && !unlocked['meme_1000']) {
      unlocked['meme_1000'] = now;
      hasNewUnlocks = true;
    }
    if (stats.longestStreak >= 3 && !unlocked['streak_3']) {
      unlocked['streak_3'] = now;
      hasNewUnlocks = true;
    }
    if (stats.longestStreak >= 7 && !unlocked['streak_7']) {
      unlocked['streak_7'] = now;
      hasNewUnlocks = true;
    }
    if (stats.longestStreak >= 30 && !unlocked['streak_30']) {
      unlocked['streak_30'] = now;
      hasNewUnlocks = true;
    }
    if (stats.personalRecords.mostMemesInDay.count >= 10 && !unlocked['productive_day']) {
      unlocked['productive_day'] = now;
      hasNewUnlocks = true;
    }
    if (Object.keys(stats.templateUsage).length >= 10 && !unlocked['variety_10']) {
      unlocked['variety_10'] = now;
      hasNewUnlocks = true;
    }
    if (Object.keys(stats.templateUsage).length >= 50 && !unlocked['variety_50']) {
      unlocked['variety_50'] = now;
      hasNewUnlocks = true;
    }

    if (hasNewUnlocks) {
      await AsyncStorage.setItem(MILESTONES_KEY, JSON.stringify(unlocked));
    }
  } catch (error) {
    // Silent fail
  }
};

/**
 * Get stats for specific period
 */
export const getStatsForPeriod = async (
  period: 'today' | 'week' | 'month' | 'allTime'
): Promise<{
  memesCreated: number;
  averagePerDay: number;
}> => {
  const stats = await getStats();
  const now = new Date();

  switch (period) {
    case 'today':
      const today = formatDate(now);
      return {
        memesCreated: stats.dailyStats[today] || 0,
        averagePerDay: stats.dailyStats[today] || 0,
      };

    case 'week':
      const weekNum = getWeekNumber(now);
      return {
        memesCreated: stats.weeklyStats[weekNum] || 0,
        averagePerDay: parseFloat(((stats.weeklyStats[weekNum] || 0) / 7).toFixed(2)),
      };

    case 'month':
      const monthStr = formatMonth(now);
      const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
      return {
        memesCreated: stats.monthlyStats[monthStr] || 0,
        averagePerDay: parseFloat(((stats.monthlyStats[monthStr] || 0) / daysInMonth).toFixed(2)),
      };

    case 'allTime':
      return {
        memesCreated: stats.totalMemesCreated,
        averagePerDay: stats.averageMemesPerDay,
      };

    default:
      return { memesCreated: 0, averagePerDay: 0 };
  }
};

/**
 * Reset stats (for testing)
 */
export const resetStats = async (): Promise<void> => {
  await AsyncStorage.multiRemove([STATS_KEY, MILESTONES_KEY]);
};

// Helper functions

function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function formatMonth(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}

function getWeekNumber(date: Date): string {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
  const weekNumber = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  return `${date.getFullYear()}-W${String(weekNumber).padStart(2, '0')}`;
}

/**
 * Format time spent
 */
export const formatTimeSpent = (milliseconds: number): string => {
  const hours = Math.floor(milliseconds / (1000 * 60 * 60));
  const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
};

/**
 * Get level based on total memes
 */
export const getLevel = (totalMemes: number): { level: number; title: string; nextMilestone: number } => {
  if (totalMemes >= 1000) {
    return { level: 10, title: 'Meme God', nextMilestone: 0 };
  } else if (totalMemes >= 500) {
    return { level: 9, title: 'Meme Legend', nextMilestone: 1000 };
  } else if (totalMemes >= 100) {
    return { level: 8, title: 'Meme Master', nextMilestone: 500 };
  } else if (totalMemes >= 50) {
    return { level: 7, title: 'Meme Apprentice', nextMilestone: 100 };
  } else if (totalMemes >= 25) {
    return { level: 6, title: 'Meme Enthusiast', nextMilestone: 50 };
  } else if (totalMemes >= 10) {
    return { level: 5, title: 'Meme Creator', nextMilestone: 25 };
  } else if (totalMemes >= 5) {
    return { level: 4, title: 'Getting Started', nextMilestone: 10 };
  } else if (totalMemes >= 3) {
    return { level: 3, title: 'Beginner', nextMilestone: 5 };
  } else if (totalMemes >= 1) {
    return { level: 2, title: 'Newbie', nextMilestone: 3 };
  }
  return { level: 1, title: 'Newcomer', nextMilestone: 1 };
};
