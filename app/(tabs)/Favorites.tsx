import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { collection, DocumentData, onSnapshot, query, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { db } from '../config/firebase';
import { useSession } from '../context';

export type Property = {
  id: string;
  address: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  size: number;
  amenities: string[];
  photos: string[];
};

export default function FavoritesScreen() {
  const { user } = useSession();
  const [favorites, setFavorites] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid) {
      setLoading(false);
      return;
    }
    const q = query(
      collection(db, 'favorites'),
      where('userId', '==', user.uid)
    );
    const unsubscribe = onSnapshot(q, snapshot => {
      const items: Property[] = snapshot.docs.map(doc => {
        const data = doc.data() as DocumentData;
        const { id, ...propertyWithoutId } = data.property as Property;
        return { id: doc.id, ...propertyWithoutId };
      });
      setFavorites(items);
      setLoading(false);
    }, (error) => {
      setLoading(false);
    });
    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, [user?.email, user?.uid]);

  const renderItem = ({ item }: { item: Property }) => (
    <View style={styles.card}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: item.photos[0] }} style={styles.image} />
        <TouchableOpacity style={styles.favoriteIcon} onPress={() => {}}>
          <Ionicons name="heart" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
      <View style={styles.info}>
        <Text style={styles.price}>${item.price.toLocaleString()}</Text>
        <View style={styles.addressRow}>
          <Ionicons name="location-outline" size={16} color="#764ba2" style={{ marginRight: 4 }} />
          <Text style={styles.address}>{item.address}</Text>
        </View>
        <TouchableOpacity style={styles.detailsButton}>
          <Text style={styles.detailsButtonText}>View Details</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return <ActivityIndicator style={{ flex: 1 }} size="large" />;
  }

  if (!user) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>Please log in to view favorites.</Text>
      </View>
    );
  }

  if (!favorites.length) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>No favorites yet.</Text>
      </View>
    );
  }

  return (
    <LinearGradient
      colors={["#667eea", "#764ba2"]}
      style={styles.gradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>Favorites</Text>
          <Text style={styles.headerSubtitle}>Your saved properties</Text>
        </View>
        <Ionicons name="person-circle" size={36} color="#fff" style={styles.headerAvatar} />
      </View>
      <FlatList
        data={favorites}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingVertical: 30 }}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 28,
    paddingBottom: 12,
    paddingHorizontal: 18,
    backgroundColor: 'transparent',
  },
  headerLeft: {
    flex: 1,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 2,
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 13,
    fontWeight: '500',
  },
  headerAvatar: {
    marginLeft: 16,
    fontSize: 36,
  },
  card: {
    width: '100%',
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: '#fff',
    marginBottom: 28,
    elevation: 6,
    shadowColor: '#764ba2',
    shadowOpacity: 0.13,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
  },
  imageContainer: {
    width: '100%',
    height: 160,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  favoriteIcon: {
    position: 'absolute',
    top: 14,
    right: 14,
    backgroundColor: 'rgba(118,75,162,0.7)',
    borderRadius: 20,
    padding: 6,
    zIndex: 2,
  },
  info: {
    padding: 18,
    paddingTop: 12,
  },
  price: {
    fontSize: 22,
    fontWeight: '700',
    color: '#764ba2',
    marginBottom: 8,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  address: {
    fontSize: 15,
    color: '#444',
    fontWeight: '500',
  },
  detailsButton: {
    backgroundColor: '#667eea',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 4,
  },
  detailsButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
    letterSpacing: 0.5,
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#fff',
    fontSize: 16,
    backgroundColor: 'rgba(0,0,0,0.2)',
    padding: 16,
    borderRadius: 8,
  },
});