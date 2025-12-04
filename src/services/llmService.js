// LLM Service for generating Twi words dynamically
// Uses verified dictionary first, then OpenAI for variations
// Supports OpenAI, Anthropic Claude, and Google Gemini

import { VERIFIED_TWI_DICTIONARY, getRandomWords } from '../data/verifiedTwiDictionary';
import { generateExampleSentence } from './geminiEnhancementService';

// Track which words have been used in current session
const usedWordIds = new Set();

const API_KEYS = {
  openai: import.meta.env.VITE_OPENAI_API_KEY,
  anthropic: import.meta.env.VITE_ANTHROPIC_API_KEY,
  google: import.meta.env.VITE_GOOGLE_API_KEY,
};

const LLM_PROVIDER = import.meta.env.VITE_LLM_PROVIDER || 'openai';

// Prompts for different categories with verified Twi words
const GENERATION_PROMPTS = {
  easy: `You are a Twi language expert. Generate ONE authentic Akan Twi word that is exactly 2 letters long. 
CRITICAL: Only use VERIFIED Twi words from this list: Me, Wo, No, So, Se, Bi, Ni, De, Te, Ha, Ka, Ma, Pa, Oo, Ee, Aa.
Choose one NOT yet used frequently. Return ONLY valid JSON with NO extra text:
{
  "word": "authentic 2-letter Twi word",
  "pronunciation": "phonetic IPA or simple pronunciation like 'meh' or 'woh'",
  "definition": "precise English meaning",
  "category": "easy"
}`,
  
  intermediate: `You are a Twi language expert. Generate ONE authentic Akan Twi word that is 3-4 letters long.
CRITICAL: Only use VERIFIED real Twi words like: Kɔ (go), Nom (eat), Odɔ (love), Ani (come), Dua (sleep), Kɔm (hold), Pa (hide), Pem (push), Tsi (buy), Soa (pull), Gyina (stand), Fata (finish), Wɔ (be), Nya (know), Tumi (able).
Choose one NOT yet used. Return ONLY valid JSON with NO extra text:
{
  "word": "authentic 3-4 letter Twi word",
  "pronunciation": "phonetic pronunciation like 'kaw' or 'nohm'",
  "definition": "precise English meaning",
  "category": "intermediate"
}`,
  
  difficult: `You are a Twi language expert. Generate ONE authentic everyday Twi greeting, phrase or short sentence (2-4 words).
CRITICAL: Only use VERIFIED real Twi phrases like: Maakye (good morning), Meakye (I'm fine), Akwaaba (welcome), Medaase (thank you), Ɛte sɛn (how are you?), Me din de (my name is), Wo din sɛn (what is your name?), Me dɔ wo (I love you), Oo, eye (yes, okay), Daabi (no).
Choose one NOT yet used. Return ONLY valid JSON with NO extra text:
{
  "word": "authentic Twi phrase or greeting (2-4 words)",
  "pronunciation": "phonetic pronunciation like 'mah-kyeh' or 'ah-kwah-bah'",
  "definition": "accurate English translation of entire phrase",
  "category": "difficult"
}`
};

// Call OpenAI API
const callOpenAI = async (prompt) => {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEYS.openai}`,
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 300,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`OpenAI API error: ${error.error?.message || 'Unknown error'}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
};

// Call Anthropic Claude API
const callAnthropic = async (prompt) => {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': API_KEYS.anthropic,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-3-haiku-20240307',
      max_tokens: 300,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Anthropic API error: ${error.error?.message || 'Unknown error'}`);
  }

  const data = await response.json();
  return data.content[0].text;
};

// Call Google Gemini API
const callGoogle = async (prompt) => {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEYS.google}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
      }),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Google API error: ${error.error?.message || 'Unknown error'}`);
  }

  const data = await response.json();
  return data.candidates[0].content.parts[0].text;
};

// Main function to generate a Twi word - uses verified dictionary first
export const generateTwiWord = async (id, category = 'intermediate') => {
  try {
    // PRIORITY 1: Use verified dictionary (100% accurate)
    const verifiedWords = VERIFIED_TWI_DICTIONARY[category] || VERIFIED_TWI_DICTIONARY.intermediate;
    
    if (verifiedWords && verifiedWords.length > 0) {
      // Find a word we haven't used yet in this session
      let availableWords = verifiedWords.filter((word, idx) => !usedWordIds.has(`${category}-${idx}`));
      
      // If we've used all words, reset and start over
      if (availableWords.length === 0) {
        usedWordIds.clear();
        availableWords = verifiedWords;
      }
      
      // Pick random word from available ones
      const randomWord = availableWords[Math.floor(Math.random() * availableWords.length)];
      const wordIndex = verifiedWords.indexOf(randomWord);
      usedWordIds.add(`${category}-${wordIndex}`);
      
      // Try to generate an example if not present
      let example = randomWord.example || null;
      if (!example) {
        try {
          const enriched = await generateExampleSentence(randomWord);
          example = enriched.example;
        } catch (err) {
          console.warn(`Could not generate example for ${randomWord.word}:`, err);
        }
      }
      
      return {
        id,
        ...randomWord,
        category: category,
        example: example,
        audioFile: null,
        generatedAt: new Date().toISOString(),
        source: 'verified_dictionary'
      };
    }

    // FALLBACK: If no verified words, try OpenAI (for advanced use cases)
    if (!API_KEYS[LLM_PROVIDER]) {
      throw new Error(
        `No API key configured for ${LLM_PROVIDER}. Please add your key to .env file.`
      );
    }

    const prompt = GENERATION_PROMPTS[category] || GENERATION_PROMPTS.intermediate;

    let content;
    switch (LLM_PROVIDER) {
      case 'anthropic':
        content = await callAnthropic(prompt);
        break;
      case 'google':
        content = await callGoogle(prompt);
        break;
      case 'openai':
      default:
        content = await callOpenAI(prompt);
    }

    // Extract JSON from response (in case there's extra text)
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Could not parse JSON response from LLM');
    }

    const wordData = JSON.parse(jsonMatch[0]);

    return {
      id,
      ...wordData,
      category: category,
      audioFile: null,
      generatedAt: new Date().toISOString(),
      source: 'llm_generated'
    };
  } catch (error) {
    console.error('Error generating Twi word:', error);
    throw error;
  }
};

// Generate multiple words at once - uses verified dictionary with NO repeats
export const generateMultipleTwiWords = async (count, category = 'intermediate', startId = 1) => {
  const verifiedWords = VERIFIED_TWI_DICTIONARY[category] || [];
  
  // If we have verified words, use them directly (much faster and accurate)
  if (verifiedWords.length > 0) {
    // Shuffle while avoiding repeats
    let availableWords = verifiedWords.filter((word, idx) => !usedWordIds.has(`${category}-${idx}`));
    
    // If we've used all words, reset
    if (availableWords.length === 0) {
      usedWordIds.clear();
      availableWords = [...verifiedWords];
    }
    
    const shuffled = availableWords.sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, Math.min(count, availableWords.length));
    
    // Mark these as used
    selected.forEach(word => {
      const idx = verifiedWords.indexOf(word);
      usedWordIds.add(`${category}-${idx}`);
    });
    
    // Enrich with examples where missing
    const enrichedWords = [];
    for (const word of selected) {
      let example = word.example || null;
      
      // Try to generate example if not present
      if (!example) {
        try {
          const enriched = await generateExampleSentence(word);
          example = enriched.example;
          // Small delay to avoid rate limiting
          await new Promise(resolve => setTimeout(resolve, 200));
        } catch (err) {
          console.warn(`Could not generate example for ${word.word}:`, err);
        }
      }
      
      enrichedWords.push({
        id: startId + enrichedWords.length,
        ...word,
        category: category,
        example: example,
        audioFile: null,
        generatedAt: new Date().toISOString(),
        source: 'verified_dictionary'
      });
    }
    
    return enrichedWords;
  }

  // Fallback to LLM if needed
  const words = [];
  for (let i = 0; i < count; i++) {
    try {
      const word = await generateTwiWord(startId + i, category);
      words.push(word);
      // Add delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error(`Failed to generate word ${startId + i}:`, error);
    }
  }
  return words;
};

// Cache generated words in localStorage
export const cacheWord = (word) => {
  const cached = JSON.parse(localStorage.getItem('generatedWords') || '{}');
  cached[word.id] = word;
  localStorage.setItem('generatedWords', JSON.stringify(cached));
};

export const getCachedWord = (id) => {
  const cached = JSON.parse(localStorage.getItem('generatedWords') || '{}');
  return cached[id] || null;
};

export const clearCache = () => {
  localStorage.removeItem('generatedWords');
};

// Reset used words tracker (for new sessions or when user wants fresh start)
export const resetUsedWords = () => {
  usedWordIds.clear();
};
