import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { addDoc, collection, deleteDoc, doc, getDocs, query, where } from 'firebase/firestore';
import { auth, db } from '../../app/config/firebase';
import { Property } from '../../services/propertyService';

interface FavoriteProperty {
  id: string;
  property: Property;
  addedAt: number;
}

interface FavoritesState {
  favorites: FavoriteProperty[];
  loading: boolean;
  error: string | null;
}

const initialState: FavoritesState = {
  favorites: [],
  loading: false,
  error: null,
};

export const fetchFavorites = createAsyncThunk(
  'favorites/fetchFavorites',
  async () => {
    const uid = auth.currentUser?.uid;
    if (!uid) throw new Error('User not authenticated');

    const q = query(
      collection(db, 'favorites'),
      where('userId', '==', uid)
    );

    const snapshot = await getDocs(q);
    const favorites: FavoriteProperty[] = snapshot.docs.map(doc => ({
      id: doc.id,
      property: doc.data().property as Property,
      addedAt: doc.data().createdAt || Date.now(),
    }));

    return favorites;
  }
);

export const addToFavorites = createAsyncThunk(
  'favorites/addToFavorites',
  async (property: Property) => {
    const uid = auth.currentUser?.uid;
    if (!uid) throw new Error('User not authenticated');

    const docRef = await addDoc(collection(db, 'favorites'), {
      userId: uid,
      property,
      createdAt: Date.now(),
    });

    return {
      id: docRef.id,
      property,
      addedAt: Date.now(),
    };
  }
);

export const removeFromFavorites = createAsyncThunk(
  'favorites/removeFromFavorites',
  async (favoriteId: string) => {
    await deleteDoc(doc(db, 'favorites', favoriteId));
    return favoriteId;
  }
);

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    clearFavorites: (state) => {
      state.favorites = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch favorites
      .addCase(fetchFavorites.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        state.loading = false;
        state.favorites = action.payload;
      })
      .addCase(fetchFavorites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch favorites';
      })
      // Add to favorites
      .addCase(addToFavorites.fulfilled, (state, action) => {
        state.favorites.push(action.payload);
      })
      .addCase(addToFavorites.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to add to favorites';
      })
      // Remove from favorites
      .addCase(removeFromFavorites.fulfilled, (state, action) => {
        state.favorites = state.favorites.filter(fav => fav.id !== action.payload);
      })
      .addCase(removeFromFavorites.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to remove from favorites';
      });
  },
});

export const { clearFavorites } = favoritesSlice.actions;

export default favoritesSlice.reducer; 