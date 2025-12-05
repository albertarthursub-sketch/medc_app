# 🚀 Quick Start Guide - Twi Learning App

## For Users

### First Time Using the App

1. **Visit:** http://localhost:5174 (local) or https://medc-app.vercel.app/ (live)

2. **Sign Up:**
   - Click "Sign Up" 
   - Enter your name
   - Enter your email
   - Create a password (minimum 6 characters)
   - Click "Create Account"

3. **Complete Jollof Quiz:**
   - Choose Ghana or Nigeria Jollof (fun question!)
   - Earn initial 50 Ghana Cedis

4. **Start Learning:**
   - Browse 300+ verified Twi words
   - Click "Hear it!" to hear pronunciation
   - Use "→ Next" to browse words
   - Click "Practice" to start practice mode

5. **Practice Mode:**
   - Read the Twi word
   - Type English meaning
   - Press Enter or click "Check"
   - Get instant feedback
   - +10 Ghana Cedis per correct answer
   - Progress tracked and saved to cloud

6. **View Achievements:**
   - After practice, see your stats
   - View current badge (Silver 🥈 → Bronze 🥉 → Gold 🏆 → Legend 👑)
   - See total points and words practiced
   - Celebrate badge unlocks!

7. **Return Anytime:**
   - Log back in with your email/password
   - All your progress is saved in the cloud
   - Continue from where you left off

---

## For Developers

### Local Development Setup

**Prerequisites:**
- Node.js 16+ installed
- Firebase credentials (see FIREBASE_SETUP.md)
- Text editor/IDE

**Steps:**

1. **Clone & Install:**
   ```bash
   git clone https://github.com/albertarthursub-sketch/medc_app.git
   cd medc_app
   npm install
   ```

2. **Add Firebase Credentials:**
   - Open `.env` file
   - Add your Firebase config values:
     ```
     VITE_FIREBASE_API_KEY=your_key
     VITE_FIREBASE_AUTH_DOMAIN=your_domain
     VITE_FIREBASE_PROJECT_ID=your_project
     # ... other Firebase vars
     ```

3. **Start Dev Server:**
   ```bash
   npm run dev
   ```
   - Opens on http://localhost:5174
   - Hot reload enabled

4. **Make Changes:**
   - Edit files in `src/`
   - Browser auto-updates
   - Check console for errors

5. **Test Sign Up/Login:**
   - Create test account
   - Verify profile appears in Firestore
   - Test practice & achievements

### Project Structure

```
medc_app/
├── src/
│   ├── components/          # React components
│   │   ├── AuthScreen.jsx   # Login/signup
│   │   ├── AchievementScreen.jsx  # Post-practice
│   │   ├── PracticeMode.jsx       # Practice quiz
│   │   ├── WordCard.jsx     # Word display
│   │   ├── Navigation.jsx   # Bottom nav
│   │   └── ... (other components)
│   ├── services/
│   │   ├── firebaseService.js  # Firebase functions
│   │   ├── llmService.js       # AI content generation
│   │   └── userService.js      # Local profile mgmt
│   ├── contexts/
│   │   └── AuthContext.jsx  # Global auth state
│   ├── data/
│   │   └── twiWords.js      # 300+ words database
│   ├── App.jsx              # Main app component
│   ├── main.jsx             # Entry point
│   └── index.css            # Tailwind CSS
├── .env                     # Environment variables
├── vite.config.js           # Vite configuration
├── tailwind.config.js       # Tailwind configuration
├── FIREBASE_SETUP.md        # Firebase setup guide
├── FEATURE_SUMMARY.md       # Complete feature list
└── README.md                # Project overview
```

### Key Technologies

- **React 18** - UI framework
- **Vite 5** - Fast dev server
- **Tailwind CSS** - Styling
- **Firebase Auth** - User authentication
- **Firestore** - Cloud database
- **Gemini AI** - Example sentence generation
- **Web Speech API** - Pronunciation audio

### Important Endpoints

- **Development:** http://localhost:5174
- **Production:** https://medc-app.vercel.app
- **Firebase Console:** https://console.firebase.google.com
- **GitHub Repo:** https://github.com/albertarthursub-sketch/medc_app

### Common Tasks

**Add a New Word:**
1. Edit `src/data/verifiedTwiDictionary.js`
2. Add word object with properties: word, pronunciation, definition, category, region, example
3. App auto-loads on save

**Change Styling:**
1. Edit `src/index.css` or component className
2. Use Tailwind utilities
3. Hot reload applies changes

**Fix a Bug:**
1. Check browser console (F12)
2. Look at terminal output
3. Use React DevTools for component inspection
4. Check Firestore for data issues

**Deploy to Vercel:**
1. Commit changes: `git commit -m "message"`
2. Push to GitHub: `git push origin main`
3. Vercel auto-deploys
4. Check deployment at vercel.com dashboard

### Debugging

**Firebase Issues:**
- Check `.env` variables are set
- Verify Firestore database in Test mode
- Check Firestore security rules
- Look at Firebase Console → Logs

**Auth Issues:**
- Test account creation in Firebase Console
- Check browser console for Firebase errors
- Verify email format (lowercase, valid)
- Check password length (min 6 chars)

**Audio Not Playing:**
- Check browser console for Web Speech API errors
- Verify microphone permissions
- Test with different browser

**Words Not Loading:**
- Check `verifiedTwiDictionary.js` file
- Verify Gemini API key in `.env`
- Check browser console for fetch errors

### Performance Tips

- Use React DevTools Profiler to check renders
- Monitor network requests (DevTools → Network)
- Check bundle size: `npm run build`
- Use Lighthouse for performance audit

---

## Troubleshooting

### "Can't connect to Firebase"
- Verify Firebase config in `.env`
- Check Firebase project is active
- Restart dev server

### "Sign up not working"
- Check Firestore database is created
- Verify Email/Password auth is enabled
- Check browser console for specific errors

### "Progress not saving"
- Check user is logged in (Auth context)
- Verify Firestore rules allow writes
- Check network tab for failed requests

### "Words not displaying"
- Check `verifiedTwiDictionary.js` exists
- Verify Gemini API key is valid
- Check browser console for errors

### "Audio not playing"
- Check volume is not muted
- Allow microphone permissions
- Try different browser
- Check Web Speech API support

---

## Support & Resources

**Documentation:**
- FIREBASE_SETUP.md - Firebase configuration
- FEATURE_SUMMARY.md - Complete feature list
- README.md - Project overview
- LLM_SETUP.md - AI configuration

**External Resources:**
- [React Docs](https://react.dev)
- [Vite Guide](https://vitejs.dev)
- [Firebase Docs](https://firebase.google.com/docs)
- [Tailwind CSS](https://tailwindcss.com)

**Contact:**
- GitHub Issues: Report bugs
- GitHub Discussions: Ask questions

---

## Next Steps

1. ✅ Set up Firebase credentials
2. ✅ Run `npm install && npm run dev`
3. ✅ Create test account
4. ✅ Complete practice session
5. ✅ View achievements & badges
6. ✅ Share feedback!

Happy learning! 🎓📚

---

*Last Updated: December 5, 2025*
