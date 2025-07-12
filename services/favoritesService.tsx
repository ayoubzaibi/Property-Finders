import { collection, deleteDoc, doc, DocumentData, getDoc, onSnapshot, query, setDoc, where } from 'firebase/firestore';
import { db } from '../app/config/firebase';
import { Property } from './propertyService';

// Add a property to favorites
export async function addToFavorites(userId: string, property: Property): Promise<boolean> {
  try {
    console.log('❤️ Adding property to favorites:', property.id, 'for user:', userId);
    
    // Use property.id as the document ID for easier management
    const favoriteRef = doc(db, 'favorites', property.id);
    await setDoc(favoriteRef, {
      userId,
      propertyId: property.id,
      property,
      createdAt: new Date(),
    });
    
    console.log('✅ Property added to favorites successfully');
    return true;
  } catch (error) {
    console.error('❌ Error adding to favorites:', error);
    return false;
  }
}

// Remove a property from favorites
export async function removeFromFavorites(userId: string, propertyId: string): Promise<boolean> {
  try {
    console.log('💔 Removing property from favorites:', propertyId, 'for user:', userId);
    
    // Delete using propertyId as document ID
    const favoriteRef = doc(db, 'favorites', propertyId);
    await deleteDoc(favoriteRef);
    
    console.log('✅ Property removed from favorites successfully');
    return true;
  } catch (error) {
    console.error('❌ Error removing from favorites:', error);
    return false;
  }
}

// Check if a property is in favorites
export async function isFavorite(userId: string, propertyId: string): Promise<boolean> {
  try {
    console.log('🔍 Checking if property is favorite:', propertyId, 'for user:', userId);
    
    const favoriteRef = doc(db, 'favorites', propertyId);
    const docSnap = await getDoc(favoriteRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      const isFav = data.userId === userId;
      console.log('🔍 Property favorite status:', isFav);
      return isFav;
    }
    
    console.log('🔍 Property not found in favorites');
    return false;
  } catch (error) {
    console.error('❌ Error checking favorite status:', error);
    return false;
  }
}

// Get all favorites for a user
export function subscribeToFavorites(userId: string, callback: (favorites: Property[]) => void) {
  console.log('👂 Subscribing to favorites for user:', userId);
  
  const q = query(
    collection(db, 'favorites'),
    where('userId', '==', userId)
  );
  
  return onSnapshot(q, (snapshot) => {
    try {
      const favorites: Property[] = snapshot.docs.map(doc => {
        const data = doc.data() as DocumentData;
        // Use the original property data
        return data.property as Property;
      });
      
      console.log('📱 Favorites updated:', favorites.length, 'items');
      callback(favorites);
    } catch (error) {
      console.error('❌ Error processing favorites:', error);
      callback([]);
    }
  }, (error) => {
    console.error('❌ Firestore subscription error:', error);
    callback([]);
  });
}

// Toggle favorite status
export async function toggleFavorite(userId: string, property: Property): Promise<boolean> {
  try {
    const isFav = await isFavorite(userId, property.id);
    
    if (isFav) {
      return await removeFromFavorites(userId, property.id);
    } else {
      return await addToFavorites(userId, property);
    }
  } catch (error) {
    console.error('❌ Error toggling favorite:', error);
    return false;
  }
} 