import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import favoritesReducer from './slices/favoritesSlice';
import propertiesReducer from './slices/propertiesSlice';
import userReducer from './slices/userSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    properties: propertiesReducer,
    favorites: favoritesReducer,
    user: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 