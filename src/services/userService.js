// User profile and achievement management
const STORAGE_KEY = 'medc_app_users';
const CURRENT_USER_KEY = 'medc_app_current_user';

// Badge definitions
export const BADGES = {
  SILVER: {
    name: 'Silver Badge',
    threshold: 0,
    maxThreshold: 20,
    icon: '🥈',
    color: 'from-gray-400 to-gray-500',
    description: 'Practiced 20 words or less'
  },
  BRONZE: {
    name: 'Bronze Badge',
    threshold: 21,
    maxThreshold: 99,
    icon: '🥉',
    color: 'from-amber-700 to-amber-800',
    description: 'Practiced 21-99 words'
  },
  GOLD: {
    name: 'Gold Badge',
    threshold: 100,
    maxThreshold: 199,
    icon: '🏆',
    color: 'from-yellow-400 to-yellow-500',
    description: 'Practiced 100-199 words'
  },
  LEGEND: {
    name: 'Legend Badge',
    threshold: 200,
    maxThreshold: Infinity,
    icon: '👑',
    color: 'from-purple-600 to-pink-600',
    description: 'Practiced 200+ words - You\'re a Twi Master!'
  }
};

export const getBadgeByWordCount = (wordCount) => {
  if (wordCount >= BADGES.LEGEND.threshold) return BADGES.LEGEND;
  if (wordCount >= BADGES.GOLD.threshold) return BADGES.GOLD;
  if (wordCount >= BADGES.BRONZE.threshold) return BADGES.BRONZE;
  return BADGES.SILVER;
};

export const getUserProfile = (userId) => {
  const users = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  return users[userId] || null;
};

export const createUserProfile = (userId, userName) => {
  const users = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  
  const newProfile = {
    userId,
    userName,
    createdAt: new Date().toISOString(),
    totalPointsEarned: 0,
    totalWordsPracticed: 0,
    practiceHistory: [],
    currentBadge: BADGES.SILVER,
    badgesEarned: [BADGES.SILVER],
    lastPracticeDate: null,
    practiceStreak: 0
  };
  
  users[userId] = newProfile;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
  localStorage.setItem(CURRENT_USER_KEY, userId);
  
  return newProfile;
};

export const updateUserAfterPractice = (userId, pointsEarned, wordsPracticed, category) => {
  const users = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  const user = users[userId];
  
  if (!user) return null;
  
  user.totalPointsEarned += pointsEarned;
  user.totalWordsPracticed += wordsPracticed;
  user.lastPracticeDate = new Date().toISOString();
  
  // Add practice history entry
  user.practiceHistory.push({
    date: new Date().toISOString(),
    category,
    wordsPracticed,
    pointsEarned,
    newTotalWords: user.totalWordsPracticed
  });
  
  // Update badge based on total words practiced
  const newBadge = getBadgeByWordCount(user.totalWordsPracticed);
  user.currentBadge = newBadge;
  
  // Add to badgesEarned if it's new
  const badgeNames = user.badgesEarned.map(b => b.name);
  if (!badgeNames.includes(newBadge.name)) {
    user.badgesEarned.push(newBadge);
  }
  
  users[userId] = user;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
  
  return user;
};

export const getCurrentUser = () => {
  const currentUserId = localStorage.getItem(CURRENT_USER_KEY);
  if (!currentUserId) return null;
  return getUserProfile(currentUserId);
};

export const setCurrentUser = (userId) => {
  localStorage.setItem(CURRENT_USER_KEY, userId);
};

export const getAllUsers = () => {
  const users = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  return Object.values(users);
};

export const userExists = (userId) => {
  const users = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  return userId in users;
};

export const generateUserId = () => {
  return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};
