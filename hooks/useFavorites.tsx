import { useEffect, useState } from 'react';
import { useSession } from '../app/context';
import { addToFavorites, removeFromFavorites, subscribeToFavorites } from '../services/favoritesService';
import { Property } from '../services/propertyService';

export function useFavorites() {
  const { user } = useSession();
  const [favorites, setFavorites] = useState<Property[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);

  // Subscribe to favorites changes
  useEffect(() => {
    if (!user?.uid) {
      setFavorites([]);
      setFavoriteIds(new Set());
      return;
    }

    console.log('🔄 Setting up favorites subscription for user:', user.uid);
    
    const unsubscribe = subscribeToFavorites(user.uid, (newFavorites) => {
      setFavorites(newFavorites);
      setFavoriteIds(new Set(newFavorites.map(fav => fav.id)));
    });

    return () => {
      console.log('🔄 Cleaning up favorites subscription');
      unsubscribe();
    };
  }, [user?.uid]);

  // Add to favorites
  const addFavorite = async (property: Property): Promise<boolean> => {
    if (!user?.uid) {
      console.log('❌ No user logged in, cannot add to favorites');
      return false;
    }

    setLoading(true);
    try {
      const success = await addToFavorites(user.uid, property);
      if (success) {
        console.log('✅ Added to favorites successfully');
      }
      return success;
    } catch (error) {
      console.error('❌ Error adding to favorites:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Remove from favorites
  const removeFavorite = async (propertyId: string): Promise<boolean> => {
    if (!user?.uid) {
      console.log('❌ No user logged in, cannot remove from favorites');
      return false;
    }

    setLoading(true);
    try {
      const success = await removeFromFavorites(user.uid, propertyId);
      if (success) {
        console.log('✅ Removed from favorites successfully');
      }
      return success;
    } catch (error) {
      console.error('❌ Error removing from favorites:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Toggle favorite
  const toggleFavorite = async (property: Property): Promise<boolean> => {
    if (!user?.uid) {
      console.log('❌ No user logged in, cannot toggle favorite');
      return false;
    }

    setLoading(true);
    try {
      const isFav = favoriteIds.has(property.id);
      
      if (isFav) {
        return await removeFavorite(property.id);
      } else {
        return await addFavorite(property);
      }
    } catch (error) {
      console.error('❌ Error toggling favorite:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Check if property is favorite
  const checkIsFavorite = (propertyId: string): boolean => {
    return favoriteIds.has(propertyId);
  };

  return {
    favorites,
    favoriteIds,
    loading,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    checkIsFavorite,
  };
} 