import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { ActivityIndicator, FlatList, Image, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';



const mockProperties = [
  {
    id: '1',
    price: 450000,
    address: '123 Main St, Downtown',
    photos: ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400'],
  },
  {
    id: '2',
    price: 650000,
    address: '456 Oak Ave, Suburbs',
    photos: ['https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400'],
  },
  {
    id: '3',
    price: 350000,
    address: '789 Pine Rd, City Center',
    photos: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400'],
  },
];

export default function HomeScreen() {
  const [properties,] = useState(mockProperties);
  const [loading, setLoading] = useState(false);

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
  };

  const renderItem = ({ item }: { item: typeof mockProperties[0] }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.9}
      onPress={() => {
        // Navigate to details - you can implement this later
        console.log('Navigate to property details:', item.id);
      }}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: item.photos[0] }}
          style={styles.image}
          resizeMode="cover"
        />
        <TouchableOpacity style={styles.favoriteIcon} onPress={() => {}}>
          <Ionicons name="heart-outline" size={24} color="#fff" />
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
    </TouchableOpacity>
  );

  if (loading) {
    return <ActivityIndicator style={{ flex: 1 }} size="large" />;
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
          <Text style={styles.headerTitle}>Discover Properties</Text>
          <Text style={styles.headerSubtitle}>Find your dream home today</Text>
        </View>
        <Ionicons name="person-circle" size={36} color="#fff" style={styles.headerAvatar} />
      </View>
      <FlatList
        data={properties}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingVertical: 30, paddingTop: 0 }}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={handleRefresh} />
        }
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
});
