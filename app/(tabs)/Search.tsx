import React, { useState } from 'react';
import { ActivityIndicator, FlatList, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

// Mock data for demonstration
const mockProperties = [
  {
    id: '1',
    title: 'Modern Apartment',
    location: 'Downtown',
    price: 450000,
    bedrooms: 2,
    bathrooms: 2,
    propertyType: 'Apartment',
    photos: ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400'],
  },
  // ... more mock properties
];

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(mockProperties);
  const [loading, setLoading] = useState(false);

  const handleSearch = () => {
    setLoading(true);
    setTimeout(() => {
      setResults(
        mockProperties.filter(
          (item) =>
            item.title.toLowerCase().includes(query.toLowerCase()) ||
            item.location.toLowerCase().includes(query.toLowerCase())
        )
      );
      setLoading(false);
    }, 500);
  };

  const renderItem = ({ item }: { item: typeof mockProperties[0] }) => (
    <View style={styles.card}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: item.photos[0] }} style={styles.image} />
        <TouchableOpacity style={styles.favoriteIcon} onPress={() => {}}>
          <Ionicons name="heart-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
      <View style={styles.info}>
        <Text style={styles.price}>${item.price.toLocaleString()}</Text>
        <View style={styles.addressRow}>
          <Ionicons name="location-outline" size={16} color="#764ba2" style={{ marginRight: 4 }} />
          <Text style={styles.location}>{item.location}</Text>
        </View>
        <TouchableOpacity style={styles.detailsButton}>
          <Text style={styles.detailsButtonText}>View Details</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <LinearGradient
      colors={["#667eea", "#764ba2"]}
      style={styles.gradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>Search Properties</Text>
          <Text style={styles.headerSubtitle}>Find your next home</Text>
        </View>
        <Ionicons name="person-circle" size={36} color="#fff" style={styles.headerAvatar} />
      </View>
      <TextInput
        style={styles.input}
        placeholder="Search by location or title"
        value={query}
        onChangeText={setQuery}
        onSubmitEditing={handleSearch}
      />
      <TouchableOpacity style={styles.button} onPress={handleSearch}>
        <Text style={styles.buttonText}>Search</Text>
      </TouchableOpacity>
      {loading ? (
        <ActivityIndicator style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingVertical: 30 }}
        />
      )}
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
  input: {
    backgroundColor: '#f0f1f6',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 10,
    marginHorizontal: 16,
    marginTop: 24,
  },
  button: {
    backgroundColor: '#764ba2',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginBottom: 10,
    marginHorizontal: 16,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
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
  location: {
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
});
