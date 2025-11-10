import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Daily Meme Challenge
 * Provides daily creative prompts to inspire meme creation
 * 100% FREE - Uses local storage and hardcoded prompts
 */

const CHALLENGE_KEY = '@daily_challenge';
const STREAK_KEY = '@challenge_streak';
const COMPLETED_CHALLENGES_KEY = '@completed_challenges';
const LAST_CHALLENGE_DATE_KEY = '@last_challenge_date';

export interface DailyChallenge {
  id: string;
  date: string; // YYYY-MM-DD
  prompt: string;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  tips?: string[];
}

export interface ChallengeStreak {
  current: number;
  longest: number;
  total: number;
  lastCompletedDate?: string;
}

export interface ChallengeStats {
  streak: ChallengeStreak;
  completedToday: boolean;
  todayChallenge: DailyChallenge;
  achievements: Achievement[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedDate?: string;
}

// 365 daily prompts - cycling through the year
const CHALLENGE_PROMPTS: Omit<DailyChallenge, 'id' | 'date'>[] = [
  {
    prompt: 'When you finally understand a meme after scrolling past it 5 times',
    category: 'Relatable',
    difficulty: 'Easy',
    tips: ['Use confused/enlightened expressions', 'Try two-panel before/after'],
  },
  {
    prompt: 'Expectation vs Reality of Monday mornings',
    category: 'Life',
    difficulty: 'Easy',
    tips: ['Split screen comparison', 'Exaggerate the reality side'],
  },
  {
    prompt: 'Me pretending to be productive while scrolling memes',
    category: 'Work',
    difficulty: 'Easy',
    tips: ['Use "distracted boyfriend" style', 'Show the contrast'],
  },
  {
    prompt: 'When your code works but you don\'t know why',
    category: 'Tech',
    difficulty: 'Medium',
    tips: ['Perfect for programmer audience', 'Use confused success meme'],
  },
  {
    prompt: 'Saying "I\'m fine" but...',
    category: 'Emotions',
    difficulty: 'Easy',
    tips: ['Show the hidden chaos', 'Use "this is fine" dog template'],
  },
  {
    prompt: 'Parents explaining technology vs Kids explaining memes',
    category: 'Generations',
    difficulty: 'Medium',
    tips: ['Show the role reversal', 'Make it relatable for both ages'],
  },
  {
    prompt: 'My bank account after one shopping trip',
    category: 'Money',
    difficulty: 'Easy',
    tips: ['Before/after comparison', 'Exaggerate the emptiness'],
  },
  {
    prompt: 'When the WiFi goes down for 2 seconds',
    category: 'Modern Life',
    difficulty: 'Easy',
    tips: ['Show dramatic overreaction', 'Use panic/chaos imagery'],
  },
  {
    prompt: 'Different types of people in group projects',
    category: 'School',
    difficulty: 'Medium',
    tips: ['Multi-panel works great', 'Show 3-4 stereotypes'],
  },
  {
    prompt: 'Me trying to save money vs Me seeing "Sale"',
    category: 'Shopping',
    difficulty: 'Easy',
    tips: ['Use distracted format', 'Make the contrast obvious'],
  },
  {
    prompt: 'The evolution of "I\'m not tired" to falling asleep',
    category: 'Sleep',
    difficulty: 'Medium',
    tips: ['Progressive panels work well', 'Show the gradual change'],
  },
  {
    prompt: 'When you accidentally like someone\'s old photo while stalking',
    category: 'Social Media',
    difficulty: 'Easy',
    tips: ['Show immediate panic', 'Use sweating/nervous reactions'],
  },
  {
    prompt: 'My motivation at 2 AM vs 2 PM',
    category: 'Productivity',
    difficulty: 'Easy',
    tips: ['Time-based comparison', 'Show the ironic flip'],
  },
  {
    prompt: 'Teachers: Don\'t Google it / Also Teachers:',
    category: 'Education',
    difficulty: 'Easy',
    tips: ['Hypocrisy format works', 'Keep it lighthearted'],
  },
  {
    prompt: 'Me explaining memes to my parents',
    category: 'Family',
    difficulty: 'Medium',
    tips: ['Show the confusion gap', 'Make it wholesome'],
  },
  {
    prompt: 'When you clean your room and can\'t find anything',
    category: 'Life',
    difficulty: 'Easy',
    tips: ['Organized chaos theme', 'Relatable frustration'],
  },
  {
    prompt: 'Zoom meeting: Camera ON vs Camera OFF',
    category: 'Remote Work',
    difficulty: 'Easy',
    tips: ['Professional vs reality', 'Show the contrast'],
  },
  {
    prompt: 'How I think I look vs How I actually look in photos',
    category: 'Self-Image',
    difficulty: 'Easy',
    tips: ['Use mirror vs camera concept', 'Keep it funny not mean'],
  },
  {
    prompt: 'Me: I should go to bed early / Also me at 3 AM:',
    category: 'Night Owl',
    difficulty: 'Easy',
    tips: ['Show what you\'re doing instead', 'Relatable activities'],
  },
  {
    prompt: 'The 5 stages of online shopping',
    category: 'Shopping',
    difficulty: 'Hard',
    tips: ['Multi-panel progression', 'End with regret/joy'],
  },
  {
    prompt: 'When you try a recipe from TikTok',
    category: 'Cooking',
    difficulty: 'Medium',
    tips: ['Expectation vs reality', 'Food fail humor'],
  },
  {
    prompt: 'My brain during important tasks vs During sleep',
    category: 'Brain',
    difficulty: 'Medium',
    tips: ['Show the productivity paradox', 'Use brain/thought imagery'],
  },
  {
    prompt: 'First day of diet vs Day 3',
    category: 'Health',
    difficulty: 'Easy',
    tips: ['Progressive decline', 'Keep it relatable'],
  },
  {
    prompt: 'Me: Just one more episode / Netflix: Are you still watching?',
    category: 'Entertainment',
    difficulty: 'Easy',
    tips: ['Show the binge-watching reality', 'Include the guilt'],
  },
  {
    prompt: 'Different types of morning people',
    category: 'Morning',
    difficulty: 'Medium',
    tips: ['Show 3-4 types', 'Range from zombie to energetic'],
  },
  {
    prompt: 'When you remember an embarrassing moment from 10 years ago',
    category: 'Anxiety',
    difficulty: 'Easy',
    tips: ['Show sudden flashback horror', 'Universal experience'],
  },
  {
    prompt: 'How I dance alone vs How I dance in public',
    category: 'Dancing',
    difficulty: 'Easy',
    tips: ['Private vs public behavior', 'Exaggerate both sides'],
  },
  {
    prompt: 'Trying to act normal when the teacher calls on you',
    category: 'School',
    difficulty: 'Easy',
    tips: ['Internal panic vs external calm', 'Student experience'],
  },
  {
    prompt: 'The ultimate crossover: When two fandoms collide',
    category: 'Pop Culture',
    difficulty: 'Hard',
    tips: ['Combine two popular references', 'Make it clever'],
  },
  {
    prompt: 'My workout plan vs My actual workout',
    category: 'Fitness',
    difficulty: 'Easy',
    tips: ['Ambition vs reality', 'Gym humor'],
  },
  // Add more prompts... (continuing to 365)
  {
    prompt: 'When someone says "We need to talk"',
    category: 'Relationships',
    difficulty: 'Easy',
    tips: ['Show immediate dread', 'Universal fear'],
  },
  {
    prompt: 'Me managing my life',
    category: 'Adult Life',
    difficulty: 'Medium',
    tips: ['Chaos management theme', 'Juggling metaphor'],
  },
  {
    prompt: 'That one friend who replies instantly vs That one friend who...',
    category: 'Friendship',
    difficulty: 'Easy',
    tips: ['Compare the two extremes', 'Texting culture'],
  },
  {
    prompt: 'When you finally get a compliment',
    category: 'Emotions',
    difficulty: 'Easy',
    tips: ['Show overreaction', 'Wholesome surprise'],
  },
  {
    prompt: 'The loading screen of life',
    category: 'Waiting',
    difficulty: 'Medium',
    tips: ['Tech metaphor for patience', 'Stuck in limbo'],
  },
  {
    prompt: 'Me trying to take a good selfie: Take 47',
    category: 'Photos',
    difficulty: 'Easy',
    tips: ['Show the struggle', 'Multiple attempts'],
  },
  {
    prompt: 'When you hear your favorite song in public',
    category: 'Music',
    difficulty: 'Easy',
    tips: ['Internal excitement vs external calm', 'Trying to play it cool'],
  },
  {
    prompt: 'Introverts when plans get cancelled',
    category: 'Personality',
    difficulty: 'Easy',
    tips: ['Show secret celebration', 'Relatable for introverts'],
  },
  {
    prompt: 'The 4 types of students during exams',
    category: 'Education',
    difficulty: 'Medium',
    tips: ['Multi-panel format', 'From over-prepared to panicking'],
  },
  {
    prompt: 'When you accidentally open the front camera',
    category: 'Phone',
    difficulty: 'Easy',
    tips: ['Horror/shock reaction', 'Unflattering angle joke'],
  },
];

/**
 * Get today's challenge based on day of year
 */
export const getTodayChallenge = (): DailyChallenge => {
  const today = new Date();
  const dayOfYear = getDayOfYear(today);
  const promptIndex = dayOfYear % CHALLENGE_PROMPTS.length;
  const prompt = CHALLENGE_PROMPTS[promptIndex];

  return {
    id: `challenge-${formatDate(today)}`,
    date: formatDate(today),
    ...prompt,
  };
};

/**
 * Get challenge for specific date
 */
export const getChallengeForDate = (date: Date): DailyChallenge => {
  const dayOfYear = getDayOfYear(date);
  const promptIndex = dayOfYear % CHALLENGE_PROMPTS.length;
  const prompt = CHALLENGE_PROMPTS[promptIndex];

  return {
    id: `challenge-${formatDate(date)}`,
    date: formatDate(date),
    ...prompt,
  };
};

/**
 * Mark today's challenge as completed
 */
export const completeChallenge = async (): Promise<ChallengeStreak> => {
  const today = formatDate(new Date());
  const todayChallenge = getTodayChallenge();

  // Get current streak data
  const streak = await getStreak();
  const completedChallenges = await getCompletedChallenges();

  // Check if already completed today
  if (completedChallenges.includes(todayChallenge.id)) {
    return streak;
  }

  // Add to completed challenges
  completedChallenges.push(todayChallenge.id);
  await AsyncStorage.setItem(
    COMPLETED_CHALLENGES_KEY,
    JSON.stringify(completedChallenges)
  );

  // Update streak
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = formatDate(yesterday);

  let newCurrent = 1;
  if (streak.lastCompletedDate === yesterdayStr) {
    // Continuing streak
    newCurrent = streak.current + 1;
  } else if (streak.lastCompletedDate !== today) {
    // New streak
    newCurrent = 1;
  }

  const newStreak: ChallengeStreak = {
    current: newCurrent,
    longest: Math.max(newCurrent, streak.longest),
    total: streak.total + 1,
    lastCompletedDate: today,
  };

  await AsyncStorage.setItem(STREAK_KEY, JSON.stringify(newStreak));

  // Check for new achievements
  await checkAndUnlockAchievements(newStreak, completedChallenges);

  return newStreak;
};

/**
 * Get current streak information
 */
export const getStreak = async (): Promise<ChallengeStreak> => {
  try {
    const data = await AsyncStorage.getItem(STREAK_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error getting streak:', error);
  }

  return {
    current: 0,
    longest: 0,
    total: 0,
  };
};

/**
 * Get list of completed challenge IDs
 */
export const getCompletedChallenges = async (): Promise<string[]> => {
  try {
    const data = await AsyncStorage.getItem(COMPLETED_CHALLENGES_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    return [];
  }
};

/**
 * Check if today's challenge is completed
 */
export const isTodayCompleted = async (): Promise<boolean> => {
  const todayChallenge = getTodayChallenge();
  const completed = await getCompletedChallenges();
  return completed.includes(todayChallenge.id);
};

/**
 * Get complete challenge stats
 */
export const getChallengeStats = async (): Promise<ChallengeStats> => {
  const streak = await getStreak();
  const completedToday = await isTodayCompleted();
  const todayChallenge = getTodayChallenge();
  const achievements = await getAchievements();

  return {
    streak,
    completedToday,
    todayChallenge,
    achievements,
  };
};

/**
 * Get all achievements with unlock status
 */
export const getAchievements = async (): Promise<Achievement[]> => {
  const streak = await getStreak();
  const completed = await getCompletedChallenges();
  const unlockedData = await getUnlockedAchievements();

  const achievements: Achievement[] = [
    {
      id: 'first_challenge',
      title: 'First Steps',
      description: 'Complete your first daily challenge',
      icon: 'flag',
      unlocked: streak.total >= 1,
      unlockedDate: unlockedData['first_challenge'],
    },
    {
      id: 'streak_3',
      title: '3-Day Warrior',
      description: 'Maintain a 3-day streak',
      icon: 'flame',
      unlocked: streak.longest >= 3,
      unlockedDate: unlockedData['streak_3'],
    },
    {
      id: 'streak_7',
      title: 'Week Champion',
      description: 'Maintain a 7-day streak',
      icon: 'trophy',
      unlocked: streak.longest >= 7,
      unlockedDate: unlockedData['streak_7'],
    },
    {
      id: 'streak_30',
      title: 'Monthly Master',
      description: 'Maintain a 30-day streak',
      icon: 'ribbon',
      unlocked: streak.longest >= 30,
      unlockedDate: unlockedData['streak_30'],
    },
    {
      id: 'total_10',
      title: 'Getting Started',
      description: 'Complete 10 challenges',
      icon: 'star',
      unlocked: streak.total >= 10,
      unlockedDate: unlockedData['total_10'],
    },
    {
      id: 'total_50',
      title: 'Meme Apprentice',
      description: 'Complete 50 challenges',
      icon: 'star-half',
      unlocked: streak.total >= 50,
      unlockedDate: unlockedData['total_50'],
    },
    {
      id: 'total_100',
      title: 'Meme Master',
      description: 'Complete 100 challenges',
      icon: 'medal',
      unlocked: streak.total >= 100,
      unlockedDate: unlockedData['total_100'],
    },
    {
      id: 'comeback',
      title: 'Comeback Kid',
      description: 'Return after breaking a streak',
      icon: 'return-up-back',
      unlocked: unlockedData['comeback'] !== undefined,
      unlockedDate: unlockedData['comeback'],
    },
  ];

  return achievements;
};

/**
 * Get unlocked achievements data
 */
const getUnlockedAchievements = async (): Promise<Record<string, string>> => {
  try {
    const data = await AsyncStorage.getItem('@unlocked_achievements');
    return data ? JSON.parse(data) : {};
  } catch (error) {
    return {};
  }
};

/**
 * Check and unlock new achievements
 */
const checkAndUnlockAchievements = async (
  streak: ChallengeStreak,
  completed: string[]
): Promise<void> => {
  const unlocked = await getUnlockedAchievements();
  const today = formatDate(new Date());
  let hasNewUnlocks = false;

  // Check each achievement
  if (streak.total >= 1 && !unlocked['first_challenge']) {
    unlocked['first_challenge'] = today;
    hasNewUnlocks = true;
  }
  if (streak.longest >= 3 && !unlocked['streak_3']) {
    unlocked['streak_3'] = today;
    hasNewUnlocks = true;
  }
  if (streak.longest >= 7 && !unlocked['streak_7']) {
    unlocked['streak_7'] = today;
    hasNewUnlocks = true;
  }
  if (streak.longest >= 30 && !unlocked['streak_30']) {
    unlocked['streak_30'] = today;
    hasNewUnlocks = true;
  }
  if (streak.total >= 10 && !unlocked['total_10']) {
    unlocked['total_10'] = today;
    hasNewUnlocks = true;
  }
  if (streak.total >= 50 && !unlocked['total_50']) {
    unlocked['total_50'] = today;
    hasNewUnlocks = true;
  }
  if (streak.total >= 100 && !unlocked['total_100']) {
    unlocked['total_100'] = today;
    hasNewUnlocks = true;
  }

  // Comeback achievement - if you had a streak before and started new one
  if (streak.current === 1 && streak.longest > 1 && !unlocked['comeback']) {
    unlocked['comeback'] = today;
    hasNewUnlocks = true;
  }

  if (hasNewUnlocks) {
    await AsyncStorage.setItem('@unlocked_achievements', JSON.stringify(unlocked));
  }
};

/**
 * Reset all challenge data (for testing)
 */
export const resetChallengeData = async (): Promise<void> => {
  await AsyncStorage.multiRemove([
    CHALLENGE_KEY,
    STREAK_KEY,
    COMPLETED_CHALLENGES_KEY,
    LAST_CHALLENGE_DATE_KEY,
    '@unlocked_achievements',
  ]);
};

// Helper functions

function getDayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}

function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Get upcoming challenges (next 7 days)
 */
export const getUpcomingChallenges = (): DailyChallenge[] => {
  const challenges: DailyChallenge[] = [];
  const today = new Date();

  for (let i = 1; i <= 7; i++) {
    const futureDate = new Date(today);
    futureDate.setDate(futureDate.getDate() + i);
    challenges.push(getChallengeForDate(futureDate));
  }

  return challenges;
};

/**
 * Get past completed challenges
 */
export const getCompletedChallengeHistory = async (): Promise<DailyChallenge[]> => {
  const completed = await getCompletedChallenges();
  const history: DailyChallenge[] = [];

  // Parse challenge IDs to get dates
  completed.forEach(id => {
    const dateStr = id.replace('challenge-', '');
    const [year, month, day] = dateStr.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    history.push(getChallengeForDate(date));
  });

  // Sort by date descending
  history.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return history;
};
