import { useNavigation } from '@react-navigation/native';
import { collection, DocumentData, onSnapshot, query, where, } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View, } from 'react-native';
import { useAuth } from '../../services/authContext';
import { db } from '../config/firebase';

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
  const navigation = useNavigation<any>();
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid) {
      setLoading(false);
      return;
    }

    console.log('Loading favorites for user:', user.email);

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
      console.log('Favorites loaded:', items.length);
    }, (error) => {
      console.error('Error loading favorites:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user?.uid]);

  const renderItem = ({ item }: { item: Property }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        navigation.navigate('PropertyDetails', { property: item })
      }
    >
      <Text style={styles.price}>${item.price.toLocaleString()}</Text>
      <Text style={styles.address}>{item.address}</Text>
    </TouchableOpacity>
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
    <FlatList
      data={favorites}
      keyExtractor={item => item.id}
      renderItem={renderItem}
      contentContainerStyle={{ padding: 20 }}
    />
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  price: {
    fontSize: 18,
    fontWeight: '600',
  },
  address: {
    fontSize: 14,
    color: '#666',
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#999',
    fontSize: 16,
  },
});