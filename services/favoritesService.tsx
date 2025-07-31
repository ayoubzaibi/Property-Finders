import {
  addDoc,
  collection,
  deleteDoc,
  DocumentData,
  getDocs,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { db } from "../app/config/firebase";
import { Property } from "./propertyService";

export async function addToFavorites(
  userId: string,
  property: Property
): Promise<boolean> {
  try {
    console.log("***************Adding to favorites:", property.id);
    await addDoc(collection(db, "favorites"), {
      userId,
      propertyId: property.id,
      property,
      createdAt: new Date(),
    });
    return true;
  } catch (error) {
    console.error("❌ Error adding to favorites:", error);
    return false;
  }
}

export async function removeFromFavorites(
  userId: string,
  propertyId: string
): Promise<boolean> {
  try {
    const q = query(
      collection(db, "favorites"),
      where("userId", "==", userId),
      where("propertyId", "==", propertyId)
    );
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      await deleteDoc(snapshot.docs[0].ref);
      return true;
    }
    return false;
  } catch (error) {
    console.error("❌ Error removing from favorites:", error);
    return false;
  }
}

export async function isFavorite(
  userId: string,
  propertyId: string
): Promise<boolean> {
  try {
    const q = query(
      collection(db, "favorites"),
      where("userId", "==", userId),
      where("propertyId", "==", propertyId)
    );
    const snapshot = await getDocs(q);
    return !snapshot.empty;
  } catch (error) {
    console.error("❌ Error checking favorite status:", error);
    return false;
  }
}

export function subscribeToFavorites(
  userId: string,
  callback: (favorites: Property[]) => void
) {
  const q = query(collection(db, "favorites"), where("userId", "==", userId));
  return onSnapshot(
    q,
    (snapshot) => {
      try {
        const favorites: Property[] = snapshot.docs.map((doc) => {
          const data = doc.data() as DocumentData;
          return data.property as Property;
        });
        callback(favorites);
      } catch (error) {
        console.error("❌ Error processing favorites:", error);
        callback([]);
      }
    },
    (error) => {
      // Improved error logging for Firestore transport errors
      console.error(
        "❌ Firestore subscription error:",
        error.code,
        error.message,
        error
      );
      callback([]);
    }
  );
}

export async function toggleFavorite(
  userId: string,
  property: Property
): Promise<boolean> {
  try {
    const isFav = await isFavorite(userId, property.id);
    if (isFav) {
      return await removeFromFavorites(userId, property.id);
    } else {
      return await addToFavorites(userId, property);
    }
  } catch (error) {
    console.error("❌ Error toggling favorite:", error);
    return false;
  }
}
