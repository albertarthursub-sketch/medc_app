# Twi Learning PWA 💕

A beautiful, mobile-friendly Progressive Web App for learning Akan Twi vocabulary, made with love!

## Features

- 📱 **Mobile-First Design** - Optimized for phones and iPad
- 💝 **Personal Touch** - Welcome screen with your photo and goofy messages
- 🎯 **Daily Words** - Automatically shows a different word each day
- 🔊 **Audio Pronunciation** - Supports both TTS and custom audio files
- 📚 **Word Archive** - Browse all words anytime
- 🌐 **PWA Support** - Install on home screen, works offline
- 💬 **Example Sentences** - Learn words in context
- 🎨 **Beautiful UI** - Modern gradient design with smooth animations

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Add Your Photos & Customize

#### Add Your Couple Photo
1. Save your photo (with pets!) as `couple-photo.jpg`
2. Place it in the `/public` folder
3. Uncomment lines in `src/components/WelcomeScreen.jsx`:

```jsx
// Find this section and uncomment:
<img
  src="/couple-photo.jpg"
  alt="Us with our pets"
  className="w-full h-full object-cover"
/>
```

#### Add App Icons (Optional)
Create icons for PWA installation:
- `icon-192.png` (192x192px)
- `icon-512.png` (512x512px)
Place them in the `/public` folder

### 3. Customize Messages

Edit `src/data/twiWords.js`:
- Add more **goofy messages** to the `goofyMessages` array
- Make them personal, funny, romantic - whatever suits you!

### 4. Add More Twi Words

Edit `src/data/twiWords.js` to expand the word database:

```javascript
{
  id: 8,
  word: "Your Twi Word",
  pronunciation: "how-to-say-it",
  definition: "English meaning",
  example: {
    twi: "Example in Twi",
    english: "Example in English"
  },
  audioFile: null  // or "/audio/yourword.mp3"
}
```

### 5. Add Custom Audio Recordings

To add your own voice recordings:

1. Record your pronunciation as MP3 or WAV files
2. Place them in `/public/audio/` folder
3. Update the word in `twiWords.js`:

```javascript
{
  id: 1,
  word: "Akwaaba",
  // ... other fields
  audioFile: "/audio/akwaaba.mp3"
}
```

If `audioFile` is `null`, the app will use text-to-speech automatically.

## Running the App

### Development Mode

```bash
npm run dev
```

Visit `http://localhost:5173` in your browser.

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Testing on Mobile Devices

### Local Network Testing

1. Start the dev server: `npm run dev`
2. Find your computer's local IP (e.g., `192.168.1.100`)
3. On your phone/tablet, visit `http://YOUR-IP:5173`
4. Test the mobile experience!

### Install as PWA

Once deployed or running locally:
1. Open the app in mobile browser
2. Tap "Add to Home Screen"
3. App will work like a native app with offline support!

## Customization Tips

### Change Colors

Edit `tailwind.config.js`:

```javascript
colors: {
  primary: '#FF6B9D',    // Change to your preferred color
  secondary: '#FFA07A',  // Secondary color
  accent: '#FFD700',     // Accent color
}
```

### Change App Name

Update in these files:
- `index.html` - Page title
- `vite.config.js` - PWA manifest
- `public/manifest.json` - App metadata

### Add More Features

Ideas for expansion:
- Quiz mode
- Favorites list
- Progress tracking
- Multiple languages
- Streak counter
- Share words feature

## Deployment

### Deploy to Vercel (Free)

```bash
npm install -g vercel
vercel
```

### Deploy to Netlify (Free)

1. Push code to GitHub
2. Connect repository to Netlify
3. Build command: `npm run build`
4. Publish directory: `dist`

## Browser Support

- ✅ Chrome/Edge (Android & iOS)
- ✅ Safari (iOS)
- ✅ Firefox
- ✅ Samsung Internet

## Tips for Best Experience

- Use on mobile for the best experience
- Enable audio permissions for pronunciation
- Install as PWA for offline access
- Works great on iPad too!

## File Structure

```
LOVE APP/
├── public/
│   ├── couple-photo.jpg      # Your photo goes here
│   ├── icon-192.png          # PWA icons
│   ├── icon-512.png
│   ├── manifest.json         # PWA manifest
│   └── audio/                # Optional: custom audio files
├── src/
│   ├── components/
│   │   ├── WelcomeScreen.jsx # Welcome screen with photo
│   │   ├── WordCard.jsx      # Daily word card
│   │   ├── Navigation.jsx    # Bottom navigation
│   │   └── WordHistory.jsx   # Word archive
│   ├── data/
│   │   └── twiWords.js       # Word database & messages
│   ├── App.jsx               # Main app component
│   ├── index.css             # Global styles
│   └── main.jsx              # App entry point
├── index.html
├── vite.config.js            # Vite & PWA config
└── tailwind.config.js        # Styling config
```

## Troubleshooting

**Audio not working?**
- Check browser audio permissions
- Try different browser
- Make sure audio files are in `/public` folder

**PWA not installing?**
- Must use HTTPS (or localhost)
- Check manifest.json is valid
- Try different browser

**Photo not showing?**
- Check file name is exactly `couple-photo.jpg`
- Check it's in `/public` folder
- Clear browser cache

## Made with Love

Built with React, Vite, Tailwind CSS, and lots of ❤️

Enjoy your language learning journey together! 🚀
