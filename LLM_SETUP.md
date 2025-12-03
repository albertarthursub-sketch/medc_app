# LLM Integration Setup Guide

This app now combines **static Twi words** with **AI-generated words** using your choice of LLM API.

## Setup Instructions

### 1. Copy Environment Variables

```bash
cp .env.example .env
```

### 2. Choose Your LLM Provider

You can use **one** of the following:

#### Option A: OpenAI (Recommended for Quality)

1. Get your API key from: https://platform.openai.com/api-keys
2. In `.env`, set:
```
VITE_OPENAI_API_KEY=your_key_here
VITE_LLM_PROVIDER=openai
```

#### Option B: Anthropic Claude

1. Get your API key from: https://console.anthropic.com/
2. In `.env`, set:
```
VITE_ANTHROPIC_API_KEY=your_key_here
VITE_LLM_PROVIDER=anthropic
```

#### Option C: Google Gemini

1. Get your API key from: https://makersuite.google.com/app/apikey
2. In `.env`, set:
```
VITE_GOOGLE_API_KEY=your_key_here
VITE_LLM_PROVIDER=google
```

### 3. Start the App

```bash
npm run dev
```

## How It Works

- **Static Words**: 10 core Twi words are always available
- **Dynamic Words**: Click "Generate New Word" to create AI-generated Twi words
- **Caching**: Generated words are cached in browser localStorage, so you won't generate duplicates
- **Daily Words**: The daily word rotates based on the day of the year

## Features

✅ 10 static Twi words with examples  
✅ AI-powered word generation (definitions, pronunciations, examples)  
✅ Support for OpenAI, Anthropic, and Google APIs  
✅ Browser-based caching (no backend needed)  
✅ Works on local network for phone/tablet testing  

## API Costs

- **OpenAI**: ~$0.002 per generated word (gpt-3.5-turbo)
- **Anthropic**: ~$0.001 per generated word (Claude Haiku)
- **Google Gemini**: Free tier available (limited)

## Troubleshooting

### "No API key configured"
- Make sure you added your API key to `.env`
- Check that `VITE_LLM_PROVIDER` matches your chosen provider

### "API error"
- Verify your API key is correct and has credits/quota
- Check browser console for detailed error messages

### Words not generating
- Ensure you're on the same network (for local network access)
- Check if rate limiting is occurring (add delays between requests)
