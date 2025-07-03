import { fetchProperties } from '@/services/propertyService';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, FlatList, Image, StyleSheet, Text, TouchableOpacity, View, } from 'react-native';

type Property = {
  id: string;
  price: number;
  address: string;
  photos: string[];
};



type RootStackParamList = {
  PropertyDetails: { property: Property };
  
};
const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.9;
const CARD_HEIGHT = 200;

export default function HomeScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchProperties({
          location: '',
          minPrice: 0,
          maxPrice: Infinity,
        });
        setProperties(data);
      } catch (e) {
        console.error('Failed loading properties:', e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const renderItem = ({ item }: { item: Property }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        navigation.navigate('PropertyDetails', { property: item })
      }
    >
      <Image
        source={{ uri: item.photos[0] }}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.info}>
        <Text style={styles.price}>
          ${item.price.toLocaleString()}
        </Text>
        <Text style={styles.address}>{item.address}</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return <ActivityIndicator style={{ flex: 1 }} size="large" />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={properties}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingVertical: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    marginBottom: 20,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#f8f8f8',
    elevation: 2,
  },
  image: {
    width: '100%',
    height: '65%',
  },
  info: {
    padding: 10,
  },
  price: {
    fontSize: 18,
    fontWeight: '600',
  },
  address: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
});
