# Test Credentials Setup

## Test Account for Development

**Email:** `test@example.com`  
**Password:** `test123456`  
**Display Name:** `Test User`

## Using Test Credentials

Both the **Login** and **Sign Up** screens have a green button:
- **"✓ Use Test Credentials"** - Click this button to auto-fill test credentials

## Creating the Test Account

If the test account doesn't exist yet, follow these steps:

### Option 1: Using Firebase Console
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Go to **Authentication** → **Users**
4. Click **"Add user"**
5. Enter:
   - Email: `test@example.com`
   - Password: `test123456`
6. Click **"Add user"**

### Option 2: Using the App's Sign-Up Flow
1. Load the app in your browser
2. Click on **"Create Account"** (or the sign-up link)
3. Click **"✓ Use Test Credentials (Test User)"** button
4. Click **"Sign Up"** button
5. The account will be created automatically in Firebase

## Verifying the Account

After creating the account:
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Navigate to **Authentication** → **Users**
3. You should see `test@example.com` listed with sign-in method: **Email/Password**

## Testing the App Flow

1. **Login Flow:**
   - Click "Use Test Credentials" button on Login screen
   - Click "Login"
   - Should proceed to Learning Mode Selector

2. **Sign-Up Flow:**
   - Click "Create Account" link
   - Click "Use Test Credentials" button
   - Click "Sign Up"
   - Should create account and proceed to Learning Mode Selector

## Note

- The test credentials are pre-filled in development for faster testing
- These are only for development and testing purposes
- The credentials are visible in the code and should never be used for production
