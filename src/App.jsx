import { useState, useEffect } from 'react';
import WelcomeScreen from './components/WelcomeScreen';
import WordCard from './components/WordCard';
import Navigation from './components/Navigation';
import WordHistory from './components/WordHistory';
import CategorySelector from './components/CategorySelector';
import { getTwiWords, addDynamicWord, addMultipleDynamicWords, WORD_CATEGORIES } from './data/twiWords';
import { generateTwiWord, generateMultipleTwiWords, getCachedWord, cacheWord } from './services/llmService';

function App() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [showHistory, setShowHistory] = useState(false);
  const [twiWords, setTwiWords] = useState([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('sentence');
  const [showCategorySelector, setShowCategorySelector] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  // Generate initial batch of words on app load
  useEffect(() => {
    const initializeWords = async () => {
      setIsInitializing(true);
      try {
        // Load cached words first
        const cached = JSON.parse(localStorage.getItem('generatedWords') || '{}');
        const cachedWords = Object.values(cached);
        
        if (cachedWords.length > 0) {
          addMultipleDynamicWords(cachedWords);
          const filteredWords = getTwiWords(selectedCategory);
          setTwiWords(filteredWords);
        } else {
          // Generate initial batch of 5 words per category
          console.log('Generating initial words...');
          const twoLetterWords = await generateMultipleTwiWords(3, 'twoLetter', 1);
          const threeLetterWords = await generateMultipleTwiWords(3, 'threeLetter', 100);
          const sentenceWords = await generateMultipleTwiWords(3, 'sentence', 200);
          
          const allNewWords = [...twoLetterWords, ...threeLetterWords, ...sentenceWords];
          
          // Cache all generated words
          allNewWords.forEach(word => cacheWord(word));
          
          // Add to state
          addMultipleDynamicWords(allNewWords);
          const filteredWords = getTwiWords(selectedCategory);
          setTwiWords(filteredWords);
        }
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
    if (word.audioFile) {
      const audio = new Audio(word.audioFile);
      audio.play().catch(err => console.error('Audio playback failed:', err));
    } else {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(word.word);
        const voices = window.speechSynthesis.getVoices();
        const preferredVoice = voices.find(voice =>
          voice.lang.startsWith('en') || voice.lang.startsWith('af')
        );
        if (preferredVoice) {
          utterance.voice = preferredVoice;
        }
        utterance.rate = 0.8;
        utterance.pitch = 1.0;
        utterance.volume = 1.0;
        window.speechSynthesis.speak(utterance);
      } else {
        alert('Sorry, your browser doesn\'t support audio playback. Try a different browser!');
      }
    }
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

  if (showWelcome) {
    return <WelcomeScreen onContinue={() => setShowWelcome(false)} />;
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
    <div className="min-h-screen pb-32">
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
      />

      {/* Word History Modal */}
      {showHistory && (
        <WordHistory
          words={twiWords}
          onSelectWord={handleSelectWord}
          onClose={() => setShowHistory(false)}
        />
      )}
    </div>
  );
}

export default App;
