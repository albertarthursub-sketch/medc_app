import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, updateProfile, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { getFirestore, collection, doc, setDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase Configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Google Auth Provider
const googleProvider = new GoogleAuthProvider();

// Helper function to create/update user profile
const createOrUpdateUserProfile = async (user) => {
  const userRef = doc(db, 'users', user.uid);
  const userDoc = await getDoc(userRef);

  if (!userDoc.exists()) {
    // New user - create profile
    await setDoc(userRef, {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || 'User',
      photoURL: user.photoURL || null,
      authProvider: user.providerData?.[0]?.providerId || 'password',
      createdAt: serverTimestamp(),
      totalPointsEarned: 0,
      totalWordsPracticed: 0,
      currentBadge: 'SILVER',
      badgesEarned: ['SILVER'],
      practiceHistory: [],
      lastPracticeDate: null,
      practiceStreak: 0,
      totalPracticeSessions: 0,
      averageScorePercentage: 0,
    });
  } else {
    // Existing user - update last login
    await updateDoc(userRef, {
      lastLoginAt: serverTimestamp(),
    });
  }

  return user;
};

// Auth Functions
export const registerUser = async (email, password, displayName) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Update profile with display name
    await updateProfile(user, {
      displayName: displayName,
    });

    // Create user profile
    await createOrUpdateUserProfile(user);
    return user;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    // Create or update user profile
    await createOrUpdateUserProfile(user);

    return user;
  } catch (error) {
    if (error.code === 'auth/popup-closed-by-user') {
      throw new Error('Sign-in was cancelled');
    }
    throw new Error(error.message);
  }
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(user);
    }, reject);
  });
};

// Firestore Functions
export const getUserProfile = async (uid) => {
  try {
    const docRef = doc(db, 'users', uid);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() : null;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
};

export const updateUserAfterPractice = async (uid, pointsEarned, wordsPracticed, category) => {
  try {
    const userRef = doc(db, 'users', uid);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      console.error('User document not found');
      return null;
    }

    const userData = userDoc.data();
    const newTotalPoints = userData.totalPointsEarned + pointsEarned;
    const newTotalWords = userData.totalWordsPracticed + wordsPracticed;
    
    // Determine badge based on words practiced
    let newBadge = 'SILVER';
    if (newTotalWords >= 200) newBadge = 'LEGEND';
    else if (newTotalWords >= 100) newBadge = 'GOLD';
    else if (newTotalWords >= 21) newBadge = 'BRONZE';

    // Add to practice history
    const newPracticeEntry = {
      date: serverTimestamp(),
      category,
      wordsPracticed,
      pointsEarned,
      newTotalWords,
      totalPointsEarned: newTotalPoints,
    };

    const updatedBadges = userData.badgesEarned || ['SILVER'];
    if (!updatedBadges.includes(newBadge)) {
      updatedBadges.push(newBadge);
    }

    // Update user profile
    await updateDoc(userRef, {
      totalPointsEarned: newTotalPoints,
      totalWordsPracticed: newTotalWords,
      currentBadge: newBadge,
      badgesEarned: updatedBadges,
      lastPracticeDate: serverTimestamp(),
      totalPracticeSessions: userData.totalPracticeSessions + 1,
      practiceHistory: [...(userData.practiceHistory || []), newPracticeEntry],
    });

    return {
      uid,
      totalPointsEarned: newTotalPoints,
      totalWordsPracticed: newTotalWords,
      currentBadge: newBadge,
      badgesEarned: updatedBadges,
      newBadgeUnlocked: !userData.badgesEarned.includes(newBadge),
    };
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

export const updateUserStreak = async (uid) => {
  try {
    const userRef = doc(db, 'users', uid);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) return;

    const userData = userDoc.data();
    const lastPractice = userData.lastPracticeDate?.toDate?.() || null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let streak = userData.practiceStreak || 0;

    if (lastPractice) {
      const lastPracticeDate = new Date(lastPractice);
      lastPracticeDate.setHours(0, 0, 0, 0);
      const daysDiff = Math.floor((today - lastPracticeDate) / (1000 * 60 * 60 * 24));

      if (daysDiff === 1) {
        streak += 1;
      } else if (daysDiff > 1) {
        streak = 1;
      }
    } else {
      streak = 1;
    }

    await updateDoc(userRef, {
      practiceStreak: streak,
    });

    return streak;
  } catch (error) {
    console.error('Error updating streak:', error);
    throw error;
  }
};
