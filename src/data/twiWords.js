// Fully AI-Generated Twi words database
// All words are generated dynamically from LLM

// Initially empty - words are generated on demand
export let dynamicTwiWords = [];

// Category definitions
export const WORD_CATEGORIES = {
  twoLetter: { label: "2-Letter Words", emoji: "🔤", description: "Short Twi words (2 letters)" },
  threeLetter: { label: "3-Letter Words", emoji: "📝", description: "Medium Twi words (3 letters)" },
  sentence: { label: "Sentences", emoji: "📖", description: "Full phrases and sentences" }
};

// Get all words or filter by category
export const getTwiWords = (categoryFilter = null) => {
  if (categoryFilter && categoryFilter !== 'all') {
    return dynamicTwiWords.filter(word => word.category === categoryFilter);
  }
  return dynamicTwiWords;
};

// Add a dynamic word to the collection
export const addDynamicWord = (word) => {
  // Avoid duplicates
  if (!dynamicTwiWords.find(w => w.id === word.id)) {
    dynamicTwiWords.push(word);
  }
};

// Add multiple words at once
export const addMultipleDynamicWords = (words) => {
  words.forEach(word => addDynamicWord(word));
};

// Clear all dynamic words
export const clearDynamicWords = () => {
  dynamicTwiWords = [];
};

// Get word count for a specific category
export const getWordCountByCategory = (category) => {
  return getTwiWords(category).length;
};

// For backward compatibility
export const staticTwiWords = [];
export const twiWords = dynamicTwiWords;

// Goofy/romantic messages that show with the photo
export const goofyMessages = [
  "Learning Twi to impress you... and maybe order food 😄",
  "Guess what? Another day, another word, another reason to smile!",
  "Our dog says 'woof', our cat says 'meow', but I say 'I love you' 💕",
  "Warning: Daily dose of Twi and cuteness ahead!",
  "Me dɔ wo! (That's Twi for 'you're stuck with me') 😘",
  "The dog ate my homework, but not this Twi lesson!",
  "Powered by love, caffeine, and questionable dance moves 💃",
  "Fun fact: You're learning Twi AND looking gorgeous today!",
  "Our pets approved this word. Trust them, they're very wise 🐕🐱",
  "Plot twist: You're getting smarter every day! 🌟",
  "The secret ingredient is... always love (and treats for the pets)",
  "Roses are red, violets are blue, here's a Twi word, just for you!",
  "Breaking news: You're amazing. Here's today's word!",
  "This app was made with 99% love, 1% coding, and lots of pet interruptions",
  "Certified by our dog and cat as '10/10 would recommend' 🐾"
];
