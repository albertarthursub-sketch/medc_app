import { useState, useEffect } from 'react';
import WordCard from './components/WordCard';
import Navigation from './components/Navigation';
import WordHistory from './components/WordHistory';
import CategorySelector from './components/CategorySelector';
import PracticeMode from './components/PracticeMode';
import AuthContainer from './components/AuthContainer';
import AchievementScreen from './components/AchievementScreen';
import LearningModeSelector from './components/LearningModeSelector';
import { getTwiWords, addDynamicWord, addMultipleDynamicWords, WORD_CATEGORIES } from './data/twiWords';
import { generateTwiWord, generateMultipleTwiWords, getCachedWord, cacheWord, clearCache } from './services/llmService';
import { updateUserAfterPractice, updateUserStreak } from './services/firebaseService';
import { useAuth } from './contexts/AuthContext';

function App() {
  const { user, userProfile, loading: authLoading, setUserProfile } = useAuth();
  
  // Main flow states
  const [appFlow, setAppFlow] = useState('auth'); // 'auth' | 'modeSelector' | 'lesson' | 'practice'
  const [selectedLearningMode, setSelectedLearningMode] = useState(null);
  
  // Lesson mode states
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [showHistory, setShowHistory] = useState(false);
  const [twiWords, setTwiWords] = useState([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('intermediate');
  const [showCategorySelector, setShowCategorySelector] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [ghanaCedis, setGhanaCedis] = useState(0);
  const [showSearch, setShowSearch] = useState(false);
  
  // Achievement states
  const [showAchievementScreen, setShowAchievementScreen] = useState(false);
  const [lastPracticeStats, setLastPracticeStats] = useState(null);

  // Set initial points from user profile
  useEffect(() => {
    if (userProfile) {
      setGhanaCedis(userProfile.totalPointsEarned || 0);
    }
  }, [userProfile]);

  // Auth flow - move to mode selector once authenticated
  useEffect(() => {
    if (!authLoading && user) {
      setAppFlow('modeSelector');
    }
  }, [authLoading, user]);

  // Load words when entering lesson mode
  useEffect(() => {
    if (appFlow === 'lesson' && twiWords.length === 0) {
      const initializeWords = async () => {
        setIsInitializing(true);
        try {
          clearCache();
          console.log('Loading words for lesson mode...');
          const easyWords = await generateMultipleTwiWords(3, 'easy', 1);
          const intermediateWords = await generateMultipleTwiWords(3, 'intermediate', 100);
          const difficultWords = await generateMultipleTwiWords(3, 'difficult', 200);
          
          const allNewWords = [...easyWords, ...intermediateWords, ...difficultWords];
          allNewWords.forEach(word => cacheWord(word));
          addMultipleDynamicWords(allNewWords);
          
          const filteredWords = getTwiWords(selectedCategory);
          setTwiWords(filteredWords);
        } catch (error) {
          console.error('Error loading words:', error);
        } finally {
          setIsInitializing(false);
        }
      };
      initializeWords();
    }
  }, [appFlow, selectedCategory, twiWords.length]);

  const handlePlayAudio = (word) => {
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

  const handleAuthSuccess = (authUser) => {
    // User authenticated, will move to mode selector via useEffect
  };

  const handleSelectLearningMode = (mode) => {
    setSelectedLearningMode(mode);
    if (mode === 'lessons') {
      setAppFlow('lesson');
    } else if (mode === 'practice') {
      setAppFlow('practice');
    }
    // Quiz and Library can be added later
  };

  const handleStartPractice = () => {
    setAppFlow('practice');
  };

  const handlePracticeStats = (stats) => {
    if (!user) return;

    updateUserAfterPractice(user.uid, stats.pointsEarned, stats.wordsPracticed, stats.category)
      .then((updatedData) => {
        setUserProfile(updatedData);
        setGhanaCedis(updatedData.totalPointsEarned);
        
        setLastPracticeStats({
          ...stats,
          totalWordsPracticed: updatedData.totalWordsPracticed,
          totalPointsEarned: updatedData.totalPointsEarned,
          newBadgeUnlocked: updatedData.newBadgeUnlocked,
        });
        
        setShowAchievementScreen(true);
        updateUserStreak(user.uid);
      })
      .catch((error) => {
        console.error('Error updating practice stats:', error);
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

  // FLOW BASED RENDERING

  // 1. Authentication Flow
  if (appFlow === 'auth' || authLoading) {
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
    
    if (!user) {
      return <AuthContainer onAuthSuccess={handleAuthSuccess} />;
    }
  }

  // 2. Mode Selection Flow
  if (appFlow === 'modeSelector') {
    return (
      <LearningModeSelector
        onSelectMode={handleSelectLearningMode}
        onBack={() => setAppFlow('auth')}
      />
    );
  }

  // 3. Lesson Mode - Loading Words
  if (appFlow === 'lesson' && isInitializing) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-pink-50 via-orange-50 to-yellow-50">
        <div className="text-center">
          <div className="inline-block">
            <div className="w-16 h-16 border-4 border-pink-200 border-t-pink-500 rounded-full animate-spin mb-4"></div>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Loading Lesson Words</h2>
          <p className="text-gray-600">Getting your personalized Twi words ready...</p>
        </div>
      </div>
    );
  }

  // 4. Lesson Mode - Display Words
  if (appFlow === 'lesson') {
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
                  onClick={() => setAppFlow('modeSelector')}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                  title="Back to mode selector"
                >
                  <span className="text-2xl">←</span>
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

    // Main lesson view
    return (
      <div className="min-h-screen pb-24">
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
                onClick={() => setAppFlow('modeSelector')}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                title="Back to mode selector"
              >
                <span className="text-2xl">←</span>
              </button>
            </div>
          </div>
        </header>

        <main className="pt-8">
          {twiWords.length > 0 ? (
            <WordCard
              word={twiWords[currentWordIndex]}
              onPlayAudio={handlePlayAudio}
            />
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No words in this category.</p>
            </div>
          )}
        </main>

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

        {showHistory && (
          <WordHistory
            words={twiWords}
            onSelectWord={handleSelectWord}
            onClose={() => setShowHistory(false)}
          />
        )}

        {showSearch && (
          <WordSearch
            onClose={() => setShowSearch(false)}
          />
        )}
      </div>
    );
  }

  // 5. Practice Mode
  if (appFlow === 'practice') {
    // Show achievement after practice
    if (showAchievementScreen && lastPracticeStats) {
      return (
        <AchievementScreen
          userName={userProfile?.displayName || 'Learner'}
          pointsEarned={lastPracticeStats.pointsEarned}
          wordsPracticed={lastPracticeStats.wordsPracticed}
          totalWordsPracticed={lastPracticeStats.totalWordsPracticed}
          totalPointsEarned={lastPracticeStats.totalPointsEarned}
          newBadgeUnlocked={lastPracticeStats.newBadgeUnlocked}
          onContinue={() => {
            setShowAchievementScreen(false);
            setAppFlow('modeSelector');
          }}
        />
      );
    }

    return (
      <div className="min-h-screen">
        <PracticeMode
          words={getTwiWords('all')}
          selectedCategory={selectedCategory}
          onClose={() => setAppFlow('modeSelector')}
          onEarnPoints={() => {}}
          onPracticeComplete={handlePracticeStats}
        />
      </div>
    );
  }

  // Default fallback
  return (
    <div className="min-h-screen flex items-center justify-center">
      <p>Loading...</p>
    </div>
  );
}

export default App;
