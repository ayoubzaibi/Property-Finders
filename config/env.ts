// Environment Configuration
// Create a .env file in the root directory with your API keys

export const ENV = {
  // RentCast API Configuration
  RENTCAST_API_KEY: process.env.EXPO_PUBLIC_RENTCAST_API_KEY || '5fc2adbae79a4f378ee9f01e5237b1c8',
  
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
  ENABLE_RENTCAST_API: true,
  ENABLE_MOCK_DATA: false,
  ENABLE_ANALYTICS: false,
};

// Validate required environment variables
export function validateEnvironment() {
  const requiredVars = [
    'EXPO_PUBLIC_RENTCAST_API_KEY',
    'EXPO_PUBLIC_FIREBASE_API_KEY',
    'EXPO_PUBLIC_FIREBASE_PROJECT_ID',
  ];

  const missingVars = requiredVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.warn('Missing environment variables:', missingVars);
    console.warn('Please create a .env file with the required variables');
  }
}

// Check if we're in development mode
export const isDevelopment = __DEV__;

// Check if we're using mock data
export const useMockData = ENV.ENABLE_MOCK_DATA || ENV.RENTCAST_API_KEY === '5fc2adbae79a4f378ee9f01e5237b1c8'; 