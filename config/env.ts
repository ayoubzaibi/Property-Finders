// Environment Configuration
// Create a .env file in the root directory with your API keys

export const ENV = {
  // Firebase Configuration (already in firebase.ts)
  FIREBASE_API_KEY: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  FIREBASE_AUTH_DOMAIN: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  FIREBASE_PROJECT_ID: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  FIREBASE_STORAGE_BUCKET: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  FIREBASE_MESSAGING_SENDER_ID: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  FIREBASE_APP_ID: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  
  // App Configuration
  APP_NAME: 'Property Finder',
  APP_VERSION: '1.0.0',
  
  // API Configuration
  API_TIMEOUT: 10000, // 10 seconds
  MAX_PROPERTIES_PER_REQUEST: 20,
  
  // Feature Flags
  ENABLE_MOCK_DATA: false,
  ENABLE_ANALYTICS: false,
};

// Environment variable validation
const requiredEnvVars = [
  'EXPO_PUBLIC_FIREBASE_API_KEY',
  'EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'EXPO_PUBLIC_FIREBASE_PROJECT_ID',
  'EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET',
  'EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'EXPO_PUBLIC_FIREBASE_APP_ID',
];

// Check for missing environment variables
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.warn('⚠️ Missing environment variables:', missingVars);
  console.warn('Please check your .env file');
}

// Helper function to check if we should use mock data
export const useMockData = ENV.ENABLE_MOCK_DATA; 