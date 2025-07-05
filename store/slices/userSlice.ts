import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../../app/config/firebase';

export interface UserPreferences {
  notifications: boolean;
  emailUpdates: boolean;
  preferredLocations: string[];
  priceRange: {
    min: number;
    max: number;
  };
  propertyTypes: string[];
  bedrooms: number;
  bathrooms: number;
  amenities: string[];
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  phoneNumber?: string;
  preferences: UserPreferences;
  createdAt: number;
  lastLogin: number;
}

interface UserState {
  profile: UserProfile | null;
  preferences: UserPreferences;
  loading: boolean;
  error: string | null;
}

const defaultPreferences: UserPreferences = {
  notifications: true,
  emailUpdates: true,
  preferredLocations: [],
  priceRange: {
    min: 0,
    max: 1000000,
  },
  propertyTypes: [],
  bedrooms: 0,
  bathrooms: 0,
  amenities: [],
};

const initialState: UserState = {
  profile: null,
  preferences: defaultPreferences,
  loading: false,
  error: null,
};

export const fetchUserProfile = createAsyncThunk(
  'user/fetchUserProfile',
  async () => {
    const user = auth.currentUser;
    if (!user) throw new Error('User not authenticated');

    const userDoc = await getDoc(doc(db, 'users', user.uid));
    
    if (userDoc.exists()) {
      return userDoc.data() as UserProfile;
    } else {
      // Create new user profile
      const newProfile: UserProfile = {
        uid: user.uid,
        email: user.email || '',
        preferences: defaultPreferences,
        createdAt: Date.now(),
        lastLogin: Date.now(),
      };
      
      await setDoc(doc(db, 'users', user.uid), newProfile);
      return newProfile;
    }
  }
);

export const updateUserPreferences = createAsyncThunk(
  'user/updateUserPreferences',
  async (preferences: Partial<UserPreferences>) => {
    const user = auth.currentUser;
    if (!user) throw new Error('User not authenticated');

    await updateDoc(doc(db, 'users', user.uid), {
      preferences,
      lastLogin: Date.now(),
    });

    // Also save to AsyncStorage for offline access
    await AsyncStorage.setItem('userPreferences', JSON.stringify(preferences));

    return preferences;
  }
);

export const loadPreferencesFromStorage = createAsyncThunk(
  'user/loadPreferencesFromStorage',
  async () => {
    const stored = await AsyncStorage.getItem('userPreferences');
    if (stored) {
      return JSON.parse(stored) as UserPreferences;
    }
    return defaultPreferences;
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserProfile: (state, action: PayloadAction<UserProfile>) => {
      state.profile = action.payload;
      state.preferences = action.payload.preferences;
    },
    updatePreferences: (state, action: PayloadAction<Partial<UserPreferences>>) => {
      state.preferences = { ...state.preferences, ...action.payload };
    },
    clearUser: (state) => {
      state.profile = null;
      state.preferences = defaultPreferences;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
        state.preferences = action.payload.preferences;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch user profile';
      })
      .addCase(updateUserPreferences.fulfilled, (state, action) => {
        state.preferences = { ...state.preferences, ...action.payload };
        if (state.profile) {
          state.profile.preferences = state.preferences;
        }
      })
      .addCase(loadPreferencesFromStorage.fulfilled, (state, action) => {
        state.preferences = action.payload;
      });
  },
});

export const { setUserProfile, updatePreferences, clearUser } = userSlice.actions;

export default userSlice.reducer; 