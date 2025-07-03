import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';

import Ionicons from 'react-native-vector-icons/Ionicons';
import { auth, db } from '../config/firebase';
import { collection, addDoc } from 'firebase/firestore';


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

type Params = {
  Details: { property: Property };
};

const { width } = Dimensions.get('window');

export default function Details() {
  const route = useRoute<RouteProp<Params, 'Details'>>();
  const { property } = route.params;

  const saveFavorite = async () => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;
    try {
      await addDoc(collection(db, 'favorites'), {
        userId: uid,
        property,
        createdAt: Date.now(),
      });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <ScrollView horizontal pagingEnabled>
        {property.photos.map((uri, i) => (
          <Image key={i} source={{ uri }} style={styles.photo} />
        ))}
      </ScrollView>
      <View style={styles.info}>
        <Text style={styles.price}>${property.price.toLocaleString()}</Text>
        <TouchableOpacity onPress={saveFavorite} style={styles.favoriteBtn}>
          <Ionicons name="heart" size={28} color="#ff8c00" />
        </TouchableOpacity>
      </View>
      <View style={styles.details}>
        <Text style={styles.label}>Address</Text>
        <Text style={styles.text}>{property.address}</Text>

        <Text style={styles.label}>Features</Text>
        <Text style={styles.text}>
          {property.bedrooms} bd · {property.bathrooms} ba ·{' '}
          {property.size} sqft
        </Text>

        <Text style={styles.label}>Amenities</Text>
        <Text style={styles.text}>{property.amenities.join(', ')}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  photo: { width, height: 250 },
  info: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: 15,
  },
  price: { fontSize: 24, fontWeight: '700' },
  favoriteBtn: { padding: 5 },
  details: { paddingHorizontal: 15, paddingBottom: 30 },
  label: { fontSize: 16, fontWeight: '600', marginTop: 15 },
  text: { fontSize: 14, color: '#555', marginTop: 5 },
});