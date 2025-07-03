import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, ActivityIndicator, StyleSheet,} from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { fetchProperties } from '@/services/propertyService';

export type Property = {
    id: string;
    address: string;
    price: number;
    bedrooms?: number;
    bathrooms?: number;
    size?: number;
    amenities?: string[];
    photos: string[];
}

type RootStackParamList = {
  Details: { property: Property };
  
};

export default function SearchScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [location, setLocation] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [results, setResults] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);

  const applyFilters = async () => {
    setLoading(true);
    try {
      const data = await fetchProperties({location,minPrice: Number(minPrice) || 0, maxPrice: Number(maxPrice) || Infinity,});

      setResults(data);
      console.error('Search failed:', Error);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }: { item: Property }) => (
    <TouchableOpacity
      style={styles.resultCard}
      onPress={() =>
        navigation.navigate('Details', { property: item })
      }
    >
      <Text style={styles.resultText}>
        ${item.price.toLocaleString()} · {item.bedrooms} bd · {item.bathrooms} ba
      </Text>
      <Text style={styles.resultText}>{item.address}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.filters}>
        <TextInput
          style={styles.input}
          placeholder="Location"
          value={location}
          onChangeText={setLocation}
        />
        <View style={styles.row}>
          <TextInput
            style={[styles.input, styles.halfInput]}
            placeholder="Min Price"
            keyboardType="numeric"
            value={minPrice}
            onChangeText={setMinPrice}
          />
          <TextInput
            style={[styles.input, styles.halfInput]}
            placeholder="Max Price"
            keyboardType="numeric"
            value={maxPrice}
            onChangeText={setMaxPrice}
          />
        </View>
        <TouchableOpacity style={styles.button} onPress={applyFilters}>
          <Text style={styles.buttonText}>Search</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" style={{ marginTop: 20 }} />
      ) : results.length > 0 ? (
        <FlatList
          data={results}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingTop: 20 }}
        />
      ) : (
        <Text style={styles.noResults}>No results found.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  filters: { marginBottom: 15 },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  halfInput: { width: '48%' },
  button: {
    backgroundColor: '#ff8c00',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontWeight: '600' },
  resultCard: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  resultText: { fontSize: 16 },
  noResults: {
    textAlign: 'center',
    marginTop: 30,
    color: '#666',
    fontSize: 16,
  },
});