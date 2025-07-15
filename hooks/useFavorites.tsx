import { useEffect, useState } from 'react';
import { useSession } from '../app/context';
import { addToFavorites, removeFromFavorites, subscribeToFavorites } from '../services/favoritesService';
import { Property } from '../services/propertyService';
export function useFavorites() {
  const { user } = useSession();
  const [favorites, setFavorites] = useState<Property[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const [loadingStates, setLoadingStates] = useState<Set<string>>(new Set());
 
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

  
  const addFavorite = async (property: Property): Promise<boolean> => {
    if (!user?.uid) {
      console.log('❌ No user logged in, cannot add to favorites');
      return false;
    }

    setLoadingStates(prev => new Set([...prev, property.id]));
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
      setLoadingStates(prev => {
        const newSet = new Set(prev);
        newSet.delete(property.id);
        return newSet;
      });
    }
  };

  // Remove from favorites
  const removeFavorite = async (propertyId: string): Promise<boolean> => {
    if (!user?.uid) {
      console.log('❌ No user logged in, cannot remove from favorites');
      return false;
    }

    setLoadingStates(prev => new Set([...prev, propertyId]));
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
      setLoadingStates(prev => {
        const newSet = new Set(prev);
        newSet.delete(propertyId);
        return newSet;
      });
    }
  };

  // Toggle favorite
  const toggleFavorite = async (property: Property): Promise<boolean> => {
    if (!user?.uid) {
      console.log('❌ No user logged in, cannot toggle favorite');
      return false;
    }

    setLoadingStates(prev => new Set([...prev, property.id]));
    const isFav = favoriteIds.has(property.id);

    try {
      if (isFav) {
        return await removeFavorite(property.id);
      } else {
        return await addFavorite(property);
      }
    } catch (error) {
      console.error('❌ Error toggling favorite:', error);
      return false;
    } finally {
      setLoadingStates(prev => {
        const newSet = new Set(prev);
        newSet.delete(property.id);
        return newSet;
      });
    }
  };

 
  const checkIsFavorite = (propertyId: string): boolean => {
    return favoriteIds.has(propertyId);
  };

  // Check if a specific property is loading
  const isLoading = (propertyId: string): boolean => {
    return loadingStates.has(propertyId);
  };

  return {
    favorites,
    favoriteIds,
    loading: loadingStates.size > 0,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    checkIsFavorite,
    isLoading,
  };
} 