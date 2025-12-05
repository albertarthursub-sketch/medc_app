# Firebase Setup Guide

This app now uses Firebase for:
- User authentication (email/password)
- Cloud storage for user profiles
- Real-time progress tracking
- Badge and achievement storage

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Add project"
3. Enter project name: `medc_app` (or your preferred name)
4. Disable Google Analytics (optional)
5. Click "Create project"

## Step 2: Enable Authentication

1. In Firebase Console, go to **Authentication** → **Sign-in method**
2. Enable **Email/Password** provider
3. Click **Save**

## Step 3: Create Firestore Database

1. Go to **Firestore Database**
2. Click **Create database**
3. Start in **Test mode** (for development)
4. Choose region (e.g., `us-central1`)
5. Click **Create**

**Security Rules** (for production, update in Firestore):
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
  }
}
```

## Step 4: Get Firebase Configuration

1. In Firebase Console, go to **Project Settings** (gear icon)
2. Scroll to **Your apps** section
3. Click the web icon to create a web app (if not already done)
4. Copy the Firebase config object

## Step 5: Setup Environment Variables

1. Copy `.env.local.example` to `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```

2. Fill in your Firebase config values in `.env.local`:
   ```
   VITE_FIREBASE_API_KEY=xxxxx
   VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=xxxxx
   VITE_FIREBASE_APP_ID=xxxxx
   ```

3. **Important**: Never commit `.env.local` to git (it's already in `.gitignore`)

## Step 6: Restart Dev Server

```bash
npm run dev
```

The app will now show an authentication screen on first load.

## User Flow

1. **First Time**: User sees sign-up screen
2. **Register**: Enter name, email, password
3. **Authenticated**: Welcome screen appears
4. **Profile Created**: User profile stored in Firestore with:
   - Email
   - Display Name
   - Initial badges (Silver)
   - Empty practice history

## Practice & Progress

When user completes practice:
- Points and words practiced are stored in Firestore
- Badges are updated based on words practiced:
  - **Silver**: 0-20 words
  - **Bronze**: 21-99 words
  - **Gold**: 100-199 words
  - **Legend**: 200+ words
- Practice history is tracked with timestamps
- User can log back in from any device and see their progress

## Firestore Database Schema

```
users/
  {uid}/
    - email: string
    - displayName: string
    - createdAt: timestamp
    - totalPointsEarned: number
    - totalWordsPracticed: number
    - currentBadge: string
    - badgesEarned: array
    - practiceHistory: array of {
        date: timestamp
        category: string
        wordsPracticed: number
        pointsEarned: number
      }
    - lastPracticeDate: timestamp
    - practiceStreak: number
    - totalPracticeSessions: number
```

## Troubleshooting

### "Firebase configuration is missing"
- Check `.env.local` file exists and has all values
- Restart dev server after adding `.env.local`

### "Cannot sign up"
- Check Firestore Database is in Test mode
- Ensure Email/Password auth is enabled

### "Progress not saving"
- Check browser console for Firebase errors
- Verify Firestore Database rules allow writes to user document
- Check user UID in Firestore matches authenticated user

## Deployment to Vercel

When deploying to Vercel:

1. Go to Vercel Project Settings → Environment Variables
2. Add all Firebase env variables:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`

3. In Firebase Console, add Vercel domain to authorized domains:
   - Project Settings → Authorized domains
   - Add `your-app.vercel.app`

## Next Steps

- Add leaderboards
- Add progress dashboard
- Add offline support
- Add Google/GitHub authentication
