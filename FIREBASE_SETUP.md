# 🔥 Firebase Authentication Setup Guide

## Overview

This guide will help you set up Firebase Authentication properly for your Property Finder app with real user accounts.

## Prerequisites

- Firebase project already created (✅ You have this)
- Firebase configuration in `app/config/firebase.ts` (✅ You have this)

## Step 1: Enable Authentication in Firebase Console

1. **Go to Firebase Console**: https://console.firebase.google.com
2. **Select your project**: `property-finder-a312c`
3. **Navigate to Authentication**: Click "Authentication" in the left sidebar
4. **Enable Email/Password**: 
   - Click "Get started" or "Sign-in method"
   - Enable "Email/Password" provider
   - Click "Save"

## Step 2: Set Up Environment Variables (Optional but Recommended)

Create a `.env` file in your project root:

```env
# Firebase Configuration
EXPO_PUBLIC_FIREBASE_API_KEY=AIzaSyBgC_mYF8df7TFT54iOzVfr_WJysmC_xwU
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=property-finder-a312c.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=property-finder-a312c
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=property-finder-a312c.firebasestorage.app
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=918725126994
EXPO_PUBLIC_FIREBASE_APP_ID=1:918725126994:web:0a4d6776ab2dd14a4ea88b

# RentCast API
EXPO_PUBLIC_RENTCAST_API_KEY=YOUR_RENTCAST_API_KEY
```

## Step 3: Create Your First User Account

### Option A: Use the App's Registration Screen

1. **Start your app**: `npx expo start`
2. **Navigate to Register screen**
3. **Enter your details**:
   - Full Name: Your name
   - Email: Your email address
   - Password: Create a strong password (min 6 characters)
   - Confirm Password: Same password
4. **Tap "Create Account"**
5. **Verify your email** (if email verification is enabled)

### Option B: Create User in Firebase Console

1. **Go to Firebase Console** → Authentication → Users
2. **Click "Add user"**
3. **Enter email and password**
4. **Click "Add user"**

## Step 4: Test Authentication

1. **Open your app**
2. **Go to Login screen**
3. **Enter your credentials**:
   - Email: Your email address
   - Password: Your password
4. **Tap "Sign In"**
5. **You should be logged in and see the main app**

## Step 5: Enable Additional Security Features (Recommended)

### Email Verification
1. **Firebase Console** → Authentication → Settings
2. **Enable "Email verification"**
3. **Users will need to verify their email before accessing the app**

### Password Reset
1. **Firebase Console** → Authentication → Settings
2. **Enable "Password reset"**
3. **Users can reset passwords via email**

## Step 6: Test All Features

Once logged in, test these features:

✅ **Home Screen** - Browse property listings  
✅ **Search Screen** - Use filters and search  
✅ **Favorites** - Save and manage properties  
✅ **Property Details** - View detailed information  
✅ **Profile** - User settings and logout  

## Troubleshooting

### Common Issues

**"User not found"**
- Make sure the user account exists in Firebase Console
- Check if email verification is required

**"Invalid password"**
- Ensure password meets minimum requirements (6+ characters)
- Check for typos in email/password

**"Network error"**
- Check your internet connection
- Verify Firebase configuration is correct

**"App not loading after login"**
- Check if navigation is working properly
- Verify Redux store is configured correctly

### Debug Mode

To see detailed Firebase logs, add this to your app:

```typescript
// In App.tsx or where you initialize Firebase
if (__DEV__) {
  console.log('Firebase Auth State:', auth.currentUser);
}
```

## Security Best Practices

1. **Use strong passwords** (8+ characters, mix of letters/numbers/symbols)
2. **Enable email verification** for production apps
3. **Implement password reset** functionality
4. **Use environment variables** for sensitive configuration
5. **Regular security audits** of your Firebase project

## Next Steps

- [ ] Set up user profile management
- [ ] Implement password reset functionality
- [ ] Add social authentication (Google, Facebook, etc.)
- [ ] Set up user data in Firestore
- [ ] Implement user preferences and settings

---

**Your Firebase Authentication is now ready! 🎉**

You can create real user accounts and login with your own email and password. 