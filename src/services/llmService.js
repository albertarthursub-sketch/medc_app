// LLM Service for generating Twi words dynamically
// Supports OpenAI, Anthropic Claude, and Google Gemini

const API_KEYS = {
  openai: import.meta.env.VITE_OPENAI_API_KEY,
  anthropic: import.meta.env.VITE_ANTHROPIC_API_KEY,
  google: import.meta.env.VITE_GOOGLE_API_KEY,
};

const LLM_PROVIDER = import.meta.env.VITE_LLM_PROVIDER || 'openai';

// Prompt for generating Twi words
const GENERATION_PROMPT = `Generate a random Akan Twi word with the following JSON structure. Return ONLY valid JSON, no other text:
{
  "word": "Twi word here",
  "pronunciation": "phonetic pronunciation",
  "definition": "English meaning",
  "example": {
    "twi": "Example sentence in Twi",
    "english": "English translation of the example"
  }
}

Important: The word should be commonly used in Akan language. Make sure pronunciation is easy to understand.`;

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

// Main function to generate a Twi word
export const generateTwiWord = async (id) => {
  try {
    if (!API_KEYS[LLM_PROVIDER]) {
      throw new Error(
        `No API key configured for ${LLM_PROVIDER}. Please add your key to .env file.`
      );
    }

    let content;
    switch (LLM_PROVIDER) {
      case 'anthropic':
        content = await callAnthropic(GENERATION_PROMPT);
        break;
      case 'google':
        content = await callGoogle(GENERATION_PROMPT);
        break;
      case 'openai':
      default:
        content = await callOpenAI(GENERATION_PROMPT);
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
      audioFile: null,
      generatedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error generating Twi word:', error);
    throw error;
  }
};

// Generate multiple words at once
export const generateMultipleTwiWords = async (count, startId = 1) => {
  const words = [];
  for (let i = 0; i < count; i++) {
    try {
      const word = await generateTwiWord(startId + i);
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
