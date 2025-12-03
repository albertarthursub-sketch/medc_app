import { useState, useEffect } from 'react';
import WelcomeScreen from './components/WelcomeScreen';
import WordCard from './components/WordCard';
import Navigation from './components/Navigation';
import WordHistory from './components/WordHistory';
import { staticTwiWords, getTwiWords, addDynamicWord } from './data/twiWords';
import { generateTwiWord, getCachedWord, cacheWord } from './services/llmService';

function App() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [showHistory, setShowHistory] = useState(false);
  const [twiWords, setTwiWords] = useState(staticTwiWords);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Load cached dynamic words on mount
  useEffect(() => {
    const loadCachedWords = () => {
      const cached = JSON.parse(localStorage.getItem('generatedWords') || '{}');
      Object.values(cached).forEach(word => {
        addDynamicWord(word);
      });
      setTwiWords(getTwiWords());
    };
    loadCachedWords();
  }, []);

  // Get today's word based on the day of year (so it's "daily")
  useEffect(() => {
    if (!showWelcome) {
      const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
      const dailyWordIndex = dayOfYear % twiWords.length;
      setCurrentWordIndex(dailyWordIndex);
    }
  }, [showWelcome, twiWords]);

  const handlePlayAudio = (word) => {
    // Check if there's a custom audio file
    if (word.audioFile) {
      const audio = new Audio(word.audioFile);
      audio.play().catch(err => console.error('Audio playback failed:', err));
    } else {
      // Use Web Speech API for text-to-speech
      if ('speechSynthesis' in window) {
        // Cancel any ongoing speech
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(word.word);

        // Try to find a suitable voice (prefer female voice or any available voice)
        const voices = window.speechSynthesis.getVoices();
        const preferredVoice = voices.find(voice =>
          voice.lang.startsWith('en') || voice.lang.startsWith('af')
        );

        if (preferredVoice) {
          utterance.voice = preferredVoice;
        }

        utterance.rate = 0.8; // Slower for learning
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

  // Generate a new word dynamically
  const handleGenerateNewWord = async () => {
    setIsLoadingMore(true);
    try {
      const nextId = Math.max(...twiWords.map(w => w.id), 0) + 1;
      
      // Check if word is cached
      let newWord = getCachedWord(nextId);
      
      if (!newWord) {
        // Generate new word from LLM
        newWord = await generateTwiWord(nextId);
        cacheWord(newWord);
      }
      
      addDynamicWord(newWord);
      setTwiWords(getTwiWords());
    } catch (error) {
      alert(`Failed to generate word: ${error.message}`);
    } finally {
      setIsLoadingMore(false);
    }
  };

  if (showWelcome) {
    return <WelcomeScreen onContinue={() => setShowWelcome(false)} />;
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

      {/* Main Content */}
      <main className="pt-8">
        {twiWords.length > 0 ? (
          <WordCard
            word={twiWords[currentWordIndex]}
            onPlayAudio={handlePlayAudio}
          />
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading words...</p>
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
