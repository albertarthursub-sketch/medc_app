import { useState, useEffect } from 'react';
import WelcomeScreen from './components/WelcomeScreen';
import WordCard from './components/WordCard';
import Navigation from './components/Navigation';
import WordHistory from './components/WordHistory';
import CategorySelector from './components/CategorySelector';
import PracticeMode from './components/PracticeMode';
import RewardScreen from './components/RewardScreen';
import JollofQuiz from './components/JollofQuiz';
import WordSearch from './components/WordSearch';
import AuthScreen from './components/AuthScreen';
import AchievementScreen from './components/AchievementScreen';
import { getTwiWords, addDynamicWord, addMultipleDynamicWords, WORD_CATEGORIES } from './data/twiWords';
import { generateTwiWord, generateMultipleTwiWords, getCachedWord, cacheWord, clearCache } from './services/llmService';
import { updateUserAfterPractice, updateUserStreak } from './services/firebaseService';
import { useAuth } from './contexts/AuthContext';

function App() {
  const { user, userProfile, loading: authLoading, setUserProfile } = useAuth();
  
  const [showWelcome, setShowWelcome] = useState(true);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [showHistory, setShowHistory] = useState(false);
  const [twiWords, setTwiWords] = useState([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('intermediate');
  const [showCategorySelector, setShowCategorySelector] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [appMode, setAppMode] = useState('learn'); // 'learn' or 'practice'
  const [ghanaCedis, setGhanaCedis] = useState(0);
  const [showRewardScreen, setShowRewardScreen] = useState(false);
  const [showJollofQuizAtStart, setShowJollofQuizAtStart] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showAchievementScreen, setShowAchievementScreen] = useState(false);
  const [lastPracticeStats, setLastPracticeStats] = useState(null);

  // Set initial points from user profile
  useEffect(() => {
    if (userProfile) {
      setGhanaCedis(userProfile.totalPointsEarned || 0);
    }
  }, [userProfile]);

  // Generate initial batch of words on app load
  useEffect(() => {
    if (authLoading) return; // Wait for auth to load
    
    const initializeWords = async () => {
      setIsInitializing(true);
      try {
        // IMPORTANT: Clear old incorrect cached words from LLM (if they exist)
        clearCache();
        
        // Generate initial batch of 3 words per category from VERIFIED DICTIONARY
        console.log('Generating words from verified Twi dictionary...');
        const easyWords = await generateMultipleTwiWords(3, 'easy', 1);
        const intermediateWords = await generateMultipleTwiWords(3, 'intermediate', 100);
        const difficultWords = await generateMultipleTwiWords(3, 'difficult', 200);
        
        const allNewWords = [...easyWords, ...intermediateWords, ...difficultWords];
        
        // Cache all generated words
        allNewWords.forEach(word => cacheWord(word));
        
        // Add to state
        addMultipleDynamicWords(allNewWords);
        const filteredWords = getTwiWords(selectedCategory);
        setTwiWords(filteredWords);
      } catch (error) {
        console.error('Error initializing words:', error);
      } finally {
        setIsInitializing(false);
      }
    };

    if (showWelcome === false && twiWords.length === 0) {
      initializeWords();
    }
  }, [showWelcome]);

  // Filter words when category changes
  useEffect(() => {
    const filteredWords = getTwiWords(selectedCategory);
    setTwiWords(filteredWords);
    setCurrentWordIndex(0);
  }, [selectedCategory]);

  // Get today's word based on the day of year (so it's "daily")
  useEffect(() => {
    if (!showWelcome && twiWords.length > 0 && !isInitializing) {
      const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
      const dailyWordIndex = dayOfYear % twiWords.length;
      setCurrentWordIndex(dailyWordIndex);
    }
  }, [showWelcome, twiWords, isInitializing]);

  const handlePlayAudio = (word) => {
    // Deprecated - now using pronunciationService
    console.warn('Old audio handler called - using pronunciationService instead');
  };

  const handlePrevious = () => {
    if (currentWordIndex > 0) {
      setCurrentWordIndex(currentWordIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentWordIndex < twiWords.length - 1) {
      setCurrentWordIndex(currentWordIndex + 1);
    }
  };

  const handlePracticeComplete = (stats) => {
    // Save practice stats and show achievement screen
    const updatedUser = updateUserAfterPractice(
      currentUser.userId,
      stats.pointsEarned,
      stats.wordsPracticed,
      stats.category
    );
    
    setCurrentUser(updatedUser);
    
    // Check if badge was newly unlocked
    const previousBadgeCount = currentUser.badgesEarned.length;
    const newBadgeUnlocked = updatedUser.badgesEarned.length > previousBadgeCount;
    
    setLastPracticeStats({
      ...stats,
      totalWordsPracticed: updatedUser.totalWordsPracticed,
      totalPointsEarned: updatedUser.totalPointsEarned,
      newBadgeUnlocked
    });
    
    setShowAchievementScreen(true);
    setAppMode('learn');
  };

  const handleStartPractice = () => {
    // Practice mode - go directly to practice (no Jollof quiz)
    setAppMode('practice');
  };

  const handleAuthSuccess = async (authUser) => {
    // User has successfully authenticated
    setShowWelcome(false);
    // Words will be initialized by useEffect after auth loads
  };

  const handlePracticeStats = (stats) => {
    // Called from PracticeMode when practice completes
    if (!user) return;

    // Update Firebase with new stats
    updateUserAfterPractice(user.uid, stats.pointsEarned, stats.wordsPracticed, stats.category)
      .then((updatedData) => {
        // Update local state with new profile data
        setUserProfile(updatedData);
        setGhanaCedis(updatedData.totalPointsEarned);
        
        setLastPracticeStats({
          ...stats,
          totalWordsPracticed: updatedData.totalWordsPracticed,
          totalPointsEarned: updatedData.totalPointsEarned,
          newBadgeUnlocked: updatedData.newBadgeUnlocked,
        });
        
        setShowAchievementScreen(true);
        setAppMode('learn');

        // Update streak
        updateUserStreak(user.uid);
      })
      .catch((error) => {
        console.error('Error updating practice stats:', error);
        alert('Error saving your progress. Please try again.');
      });
  };

  const handleSelectWord = (index) => {
    setCurrentWordIndex(index);
  };

  const handleGenerateNewWord = async () => {
    setIsLoadingMore(true);
    try {
      const allWords = getTwiWords('all');
      const nextId = Math.max(...allWords.map(w => w.id), 0) + 1;
      
      let newWord = getCachedWord(nextId);
      
      if (!newWord) {
        newWord = await generateTwiWord(nextId, selectedCategory);
        cacheWord(newWord);
      }
      
      addDynamicWord(newWord);
      const filteredWords = getTwiWords(selectedCategory);
      setTwiWords(filteredWords);
    } catch (error) {
      alert(`Failed to generate word: ${error.message}`);
    } finally {
      setIsLoadingMore(false);
    }
  };

  const handleEarnPoints = (points) => {
    const newTotal = ghanaCedis + points;
    setGhanaCedis(newTotal);

    // Check if reached 100 GHS milestone
    if (newTotal >= 100 && ghanaCedis < 100) {
      setShowRewardScreen(true);
    }
  };

  const handleContinueToJollof = () => {
    setShowRewardScreen(false);
    // After reaching 100 GHS, just continue learning
    // Jollof quiz now appears before practice instead
  };

  const handleGhanaChoice = () => {
    setGhanaCedis(prev => prev + 50);
  };

  const handleNigeriaChoice = () => {
    // Show breakup message in an alert for now
    alert('💔 I am breaking up with you 2pm tomorrow hahaha 💔\n\nThat\'s what you get for choosing Nigerian Jollof! 😭');
  };

  // Show loading while authentication is being checked
  if (authLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-pink-50 via-orange-50 to-yellow-50">
        <div className="text-center">
          <div className="inline-block">
            <div className="w-16 h-16 border-4 border-pink-200 border-t-pink-500 rounded-full animate-spin mb-4"></div>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Loading Your Profile</h2>
          <p className="text-gray-600">Preparing your Twi learning journey...</p>
        </div>
      </div>
    );
  }

  // Show Auth Screen if user is not logged in
  if (!user) {
    return (
      <AuthScreen onAuthSuccess={handleAuthSuccess} />
    );
  }

  if (showWelcome) {
    return (
      <WelcomeScreen 
        onContinue={() => setShowWelcome(false)} 
        onShowJollofQuiz={() => {
          setShowWelcome(false);
          setShowJollofQuizAtStart(true);
        }}
      />
    );
  }

  // Show Achievement Screen after practice
  if (showAchievementScreen && lastPracticeStats) {
    return (
      <AchievementScreen
        userName={userProfile?.displayName || 'Learner'}
        pointsEarned={lastPracticeStats.pointsEarned}
        wordsPracticed={lastPracticeStats.wordsPracticed}
        totalWordsPracticed={lastPracticeStats.totalWordsPracticed}
        totalPointsEarned={lastPracticeStats.totalPointsEarned}
        newBadgeUnlocked={lastPracticeStats.newBadgeUnlocked}
        onContinue={() => setShowAchievementScreen(false)}
      />
    );
  }

  // Show Jollof Quiz at start (before learning)
  if (showJollofQuizAtStart) {
    return (
      <div className="min-h-screen">
        <JollofQuiz
          onGhanaChoice={() => {
            handleGhanaChoice();
            setShowJollofQuizAtStart(false);
          }}
          onNigeriaChoice={() => {
            handleNigeriaChoice();
            setShowJollofQuizAtStart(false);
          }}
        />
      </div>
    );
  }

  // Show Practice Mode
  if (appMode === 'practice') {
    return (
      <div className="min-h-screen">
        <PracticeMode
          words={getTwiWords('all')}
          selectedCategory={selectedCategory}
          onClose={() => setAppMode('learn')}
          onEarnPoints={handleEarnPoints}
          onPracticeComplete={handlePracticeStats}
        />
      </div>
    );
  }

  // Show Reward Screen at 100 GHS
  if (showRewardScreen) {
    return (
      <div className="min-h-screen">
        <RewardScreen
          cedis={ghanaCedis}
          onContinueToJollof={handleContinueToJollof}
        />
      </div>
    );
  }

  if (showCategorySelector) {
    return (
      <div className="min-h-screen pb-32">
        <header className="bg-white shadow-md sticky top-0 z-10">
          <div className="max-w-2xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-3xl">❤️</span>
                <div>
                  <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-orange-400">
                    Twi Learning
                  </h1>
                  <p className="text-xs text-gray-500">Made with love</p>
                </div>
              </div>
              <button
                onClick={() => setShowWelcome(true)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                title="Back to welcome"
              >
                <span className="text-2xl">🏠</span>
              </button>
            </div>
          </div>
        </header>
        
        <main className="pt-8">
          <CategorySelector 
            selectedCategory={selectedCategory} 
            onSelectCategory={(category) => {
              setSelectedCategory(category);
              setShowCategorySelector(false);
            }}
          />
        </main>
      </div>
    );
  }

  if (isInitializing) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-pink-50 via-orange-50 to-yellow-50">
        <div className="text-center">
          <div className="inline-block">
            <div className="w-16 h-16 border-4 border-pink-200 border-t-pink-500 rounded-full animate-spin mb-4"></div>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Generating Your Words</h2>
          <p className="text-gray-600">Creating AI-powered Twi words just for you...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl">❤️</span>
              <div>
                <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-orange-400">
                  Twi Learning
                </h1>
                <p className="text-xs text-gray-500">
                  {WORD_CATEGORIES[selectedCategory].label}
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowWelcome(true)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
              title="Back to welcome"
            >
              <span className="text-2xl">🏠</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-8">
        {twiWords.length > 0 ? (
          <WordCard
            word={twiWords[currentWordIndex]}
            onPlayAudio={handlePlayAudio}
          />
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No words in this category. Generate some!</p>
          </div>
        )}
      </main>

      {/* Navigation */}
      <Navigation
        currentIndex={currentWordIndex}
        totalWords={twiWords.length}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onShowHistory={() => setShowHistory(true)}
        onGenerateNew={handleGenerateNewWord}
        isLoading={isLoadingMore}
        onChangeCategory={() => setShowCategorySelector(true)}
        currentCategory={selectedCategory}
        onStartPractice={handleStartPractice}
        ghanaCedis={ghanaCedis}
        onShowSearch={() => setShowSearch(true)}
      />

      {/* Word History Modal */}
      {showHistory && (
        <WordHistory
          words={twiWords}
          onSelectWord={handleSelectWord}
          onClose={() => setShowHistory(false)}
        />
      )}

      {/* Word Search Modal */}
      {showSearch && (
        <WordSearch
          onClose={() => setShowSearch(false)}
        />
      )}
    </div>
  );
}

export default App;
