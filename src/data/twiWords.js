// Static Twi words database - combined with AI-generated words
// Core vocabulary that's always available
export const staticTwiWords = [
  {
    id: 1,
    word: "Akwaaba",
    pronunciation: "ah-kwah-bah",
    definition: "Welcome",
    example: {
      twi: "Akwaaba fi kwan so",
      english: "Welcome from your journey"
    },
    audioFile: null,
    isStatic: true,
    category: "sentence"
  },
  {
    id: 2,
    word: "Medaase",
    pronunciation: "meh-dah-seh",
    definition: "Thank you",
    example: {
      twi: "Medaase paa!",
      english: "Thank you very much!"
    },
    audioFile: null,
    isStatic: true,
    category: "sentence"
  },
  {
    id: 3,
    word: "Ɔdɔ",
    pronunciation: "aw-daw",
    definition: "Love",
    example: {
      twi: "Me dɔ wo",
      english: "I love you"
    },
    audioFile: null,
    isStatic: true,
    category: "threeLetter"
  },
  {
    id: 4,
    word: "Ɛte sɛn",
    pronunciation: "eh-teh-sen",
    definition: "How are you?",
    example: {
      twi: "Maakye, ɛte sɛn?",
      english: "Good morning, how are you?"
    },
    audioFile: null,
    isStatic: true,
    category: "sentence"
  },
  {
    id: 5,
    word: "Me ho yɛ",
    pronunciation: "meh-ho-yeh",
    definition: "I am fine",
    example: {
      twi: "Me ho yɛ, medaase",
      english: "I am fine, thank you"
    },
    audioFile: null,
    isStatic: true,
    category: "sentence"
  },
  {
    id: 6,
    word: "Adesua",
    pronunciation: "ah-deh-soo-ah",
    definition: "Learning/Education",
    example: {
      twi: "Adesua yɛ adeɛ pa",
      english: "Education is a good thing"
    },
    audioFile: null,
    isStatic: true,
    category: "sentence"
  },
  {
    id: 7,
    word: "Ayekoo",
    pronunciation: "ah-yeh-koh",
    definition: "Well done! (congratulations)",
    example: {
      twi: "Ayekoo wɔ w'adwuma ho",
      english: "Well done on your work"
    },
    audioFile: null,
    isStatic: true,
    category: "sentence"
  },
  {
    id: 8,
    word: "Baabi",
    pronunciation: "bah-bee",
    definition: "Place",
    example: {
      twi: "Baabi a me din de",
      english: "The place where my name is"
    },
    audioFile: null,
    isStatic: true,
    category: "threeLetter"
  },
  {
    id: 9,
    word: "Ɔkwan",
    pronunciation: "aw-kwan",
    definition: "Way/Road",
    example: {
      twi: "Kɔ ɔkwan no so",
      english: "Go on the way/road"
    },
    audioFile: null,
    isStatic: true,
    category: "threeLetter"
  },
  {
    id: 10,
    word: "Yɛ dɔ",
    pronunciation: "yeh-daw",
    definition: "We love",
    example: {
      twi: "Yɛ dɔ ɔkwan no",
      english: "We love this way"
    },
    audioFile: null,
    isStatic: true,
    category: "threeLetter"
  }
];

// Dynamic words will be loaded from LLM or localStorage
export let dynamicTwiWords = [];

// Category definitions
export const WORD_CATEGORIES = {
  twoLetter: { label: "2-Letter Words", emoji: "🔤", description: "Short Twi words (2 letters)" },
  threeLetter: { label: "3-Letter Words", emoji: "📝", description: "Medium Twi words (3 letters)" },
  sentence: { label: "Sentences", emoji: "📖", description: "Full phrases and sentences" }
};

// Combined getter - returns static + dynamic words, optionally filtered by category
export const getTwiWords = (categoryFilter = null) => {
  const allWords = [...staticTwiWords, ...dynamicTwiWords];
  if (categoryFilter && categoryFilter !== 'all') {
    return allWords.filter(word => word.category === categoryFilter);
  }
  return allWords;
};

// Add a dynamic word to the collection
export const addDynamicWord = (word) => {
  dynamicTwiWords.push(word);
};

// Clear dynamic words
export const clearDynamicWords = () => {
  dynamicTwiWords = [];
};

// For backward compatibility
export const twiWords = staticTwiWords;

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
