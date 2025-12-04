// Gemini Enhancement Service
// Adds example sentences to Twi words for better context and learning

const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;

const callGemini = async (prompt) => {
  if (!GOOGLE_API_KEY) {
    throw new Error('Google Gemini API key not configured. Add VITE_GOOGLE_API_KEY to .env');
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GOOGLE_API_KEY}`,
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
    throw new Error(`Gemini API error: ${error.error?.message || 'Unknown error'}`);
  }

  const data = await response.json();
  return data.candidates[0].content.parts[0].text;
};

// Generate an example sentence for a Twi word
export const generateExampleSentence = async (twiWord) => {
  try {
    const prompt = `You are a Twi language expert. Create ONE simple example sentence in Twi using the word "${twiWord.word}" (${twiWord.definition}). 
The sentence should be simple, practical, and show how the word is used in context.
Respond with ONLY the sentence in Twi, nothing else. No explanations, no JSON, just the sentence.
Example format: "Me din de Kwaku. Me dɔ su." (My name is Kwaku. I like water.)`;

    const exampleSentence = await callGemini(prompt);
    
    return {
      ...twiWord,
      example: exampleSentence.trim()
    };
  } catch (error) {
    console.error(`Failed to generate example for ${twiWord.word}:`, error);
    // Return word without example if generation fails
    return {
      ...twiWord,
      example: null
    };
  }
};

// Generate examples for multiple words
export const generateExamples = async (twiWords, onProgress = null) => {
  const enrichedWords = [];
  
  for (let i = 0; i < twiWords.length; i++) {
    try {
      const word = twiWords[i];
      
      // Skip if word already has an example
      if (word.example) {
        enrichedWords.push(word);
      } else {
        const enrichedWord = await generateExampleSentence(word);
        enrichedWords.push(enrichedWord);
      }
      
      // Call progress callback if provided
      if (onProgress) {
        onProgress({
          current: i + 1,
          total: twiWords.length,
          word: twiWords[i].word
        });
      }
      
      // Add small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 300));
    } catch (error) {
      console.error(`Error processing word ${i}:`, error);
      // Add word without example and continue
      enrichedWords.push({
        ...twiWords[i],
        example: null
      });
    }
  }
  
  return enrichedWords;
};

// Cache enriched words to localStorage
export const cacheEnrichedWords = (words) => {
  localStorage.setItem('enrichedTwiWords', JSON.stringify(words));
};

// Get cached enriched words
export const getCachedEnrichedWords = () => {
  const cached = localStorage.getItem('enrichedTwiWords');
  return cached ? JSON.parse(cached) : null;
};

// Clear enriched words cache
export const clearEnrichedWordsCache = () => {
  localStorage.removeItem('enrichedTwiWords');
};

export default {
  generateExampleSentence,
  generateExamples,
  cacheEnrichedWords,
  getCachedEnrichedWords,
  clearEnrichedWordsCache,
};
