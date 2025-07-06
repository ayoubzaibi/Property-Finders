# Configuration Guide

## Environment Setup

To use the RentCast API and other features, you need to set up environment variables.

### 1. Create Environment File

Create a `.env` file in the root directory of your project with the following content:

```env
# RentCast API Configuration
# Get your free API key from: https://rapidapi.com/rentcast/api/rentcast
EXPO_PUBLIC_RENTCAST_API_KEY=your_rentcast_api_key_here

# Firebase Configuration (optional - already configured in firebase.ts)
EXPO_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key_here
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id

# Feature Flags
ENABLE_MOCK_DATA=false
ENABLE_ANALYTICS=false
```

### 2. Get Your RentCast API Key

1. Go to [RapidAPI RentCast](https://rapidapi.com/rentcast/api/rentcast)
2. Sign up for a free account
3. Subscribe to the RentCast API (free tier: 50 requests/month)
4. Copy your API key
5. Replace `your_rentcast_api_key_here` in your `.env` file

### 3. Update the API Service

Once you have your API key, update the `services/rentcastApi.ts` file:

```typescript
// Replace this line:
const RENTCAST_API_KEY = ENV.RENTCAST_API_KEY;

// With your actual API key (for testing):
const RENTCAST_API_KEY = 'your_actual_api_key_here';
```

### 4. Test the Integration

After setting up your API key:

1. Start the development server: `npx expo start`
2. Navigate to the Search screen
3. Try searching for properties in a real city (e.g., "Chicago, IL")
4. Check the console logs to see API responses

### 5. API Usage Limits

- **Free Tier**: 50 requests per month
- **Paid Plans**: Available for higher usage
- **Rate Limiting**: Be mindful of API calls during development

### 6. Fallback to Mock Data

If the API is unavailable or you exceed limits, the app will automatically fall back to mock data. You can also force mock data by setting:

```env
ENABLE_MOCK_DATA=true
```

### 7. Troubleshooting

**API Not Working?**
- Check your API key is correct
- Verify you haven't exceeded your monthly limit
- Check the console for error messages
- Ensure your `.env` file is in the root directory

**Properties Not Loading?**
- Try searching for a different location
- Check if the location format is correct (e.g., "City, State")
- Verify your internet connection

**Firebase Issues?**
- Your existing Firebase configuration should work
- The environment variables are optional for Firebase

## Next Steps

Once your API is configured:

1. **Test Real Data**: Search for properties in your area
2. **Enhance Features**: Add more filtering options
3. **Optimize Performance**: Implement caching and pagination
4. **Add Analytics**: Track user behavior and popular searches

## Security Notes

- Never commit your `.env` file to version control
- The `.env` file is already in `.gitignore`
- Use environment variables for all sensitive data
- Consider using a secrets management service for production 