import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useFavorites } from '../../hooks/useFavorites';
import { Property } from '../../services/propertyService';
import { useSession } from '../context';
import PropertyCard from '@/components/PropertyCard';

export default function FavoritesScreen() {
  const router = useRouter();
  const { user } = useSession();
  const { favorites, toggleFavorite, checkIsFavorite, loading: favoritesLoading } = useFavorites();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Set loading to false after a short delay to show the favorites
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const handleFavoritePress = async (property: Property) => {
    try {
      const success = await toggleFavorite(property);
      if (success) {
        Alert.alert(
          'Removed from Favorites',
          'Property has been removed from your favorites.',
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert('Error', 'Failed to remove from favorites. Please try again.');
      }
    } catch (error) {
      console.error('Error removing favorite:', error);
      Alert.alert('Error', 'Failed to remove from favorites. Please try again.');
    }
  };

  const handlePropertyPress = (propertyId: string) => {
    router.push(`/Details?propertyId=${propertyId}`);
  };

  const renderItem = ({ item }: { item: Property }) => (
    <View style={styles.card}>
      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: item.photos[0] || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400' }} 
          style={styles.image} 
        />
        <TouchableOpacity 
          style={styles.favoriteIcon} 
          onPress={() => handleFavoritePress(item)}
          disabled={favoritesLoading}
        >
          <Text><Ionicons name="heart" size={24} color="#ff4757" /></Text>
        </TouchableOpacity>
      </View>
      <View style={styles.info}>
        <Text style={styles.price}>${item.price.toLocaleString()}</Text>
        <View style={styles.addressRow}>
          <Ionicons name="location-outline" size={16} color="#764ba2" />
          <Text style={styles.address}>{item.address}</Text>
        </View>
        {item.bedrooms && item.bathrooms && (
          <View style={styles.detailsRow}>
            <Text style={styles.detailsText}>{item.bedrooms} bed • {item.bathrooms} bath</Text>
            {item.squareFootage && (
              <Text style={styles.detailsText}> • {item.squareFootage.toLocaleString()} sq ft</Text>
            )}
          </View>
        )}
        <TouchableOpacity 
          style={styles.detailsButton}
          onPress={() => handlePropertyPress(item.id)}
        >
          <Text style={styles.detailsButtonText}>View Details</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <PropertyCard />
    );
  }

  if (!user) {
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
        <View style={styles.emptyContainer}>
          <Ionicons name="heart-outline" size={64} color="rgba(255,255,255,0.6)" />
          <Text style={styles.emptyText}>Please log in to view favorites</Text>
          <Text style={styles.emptySubtext}>Sign in to save and view your favorite properties</Text>
        </View>
      </LinearGradient>
    );
  }

  if (error) {
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
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={64} color="rgba(255,255,255,0.6)" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
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
      {favorites.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="heart-outline" size={64} color="rgba(255,255,255,0.6)" />
          <Text style={styles.emptyText}>No favorites yet</Text>
          <Text style={styles.emptySubtext}>Start exploring properties and save your favorites</Text>
        </View>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
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
    paddingTop: 20,
    paddingBottom: 10,
    paddingHorizontal: 16,
    backgroundColor: 'transparent',
  },
  headerLeft: {
    flex: 1,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 2,
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 12,
    fontWeight: '500',
  },
  headerAvatar: {
    marginLeft: 12,
    fontSize: 32,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    fontSize: 15,
    marginTop: 12,
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  emptyText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 6,
  },
  emptySubtext: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 13,
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  errorText: {
    color: '#fff',
    fontSize: 15,
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  card: {
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#fff',
    marginBottom: 20,
    elevation: 6,
    shadowColor: '#764ba2',
    shadowOpacity: 0.13,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
  },
  imageContainer: {
    width: '100%',
    height: 140,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  favoriteIcon: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(118,75,162,0.7)',
    borderRadius: 18,
    padding: 5,
    zIndex: 2,
  },
  info: {
    padding: 16,
    paddingTop: 10,
  },
  price: {
    fontSize: 20,
    fontWeight: '700',
    color: '#764ba2',
    marginBottom: 6,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  address: {
    fontSize: 14,
    color: '#444',
    fontWeight: '500',
  },
  detailsRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  detailsText: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
  },
  detailsButton: {
    backgroundColor: '#667eea',
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
    marginTop: 4,
  },
  detailsButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
    letterSpacing: 0.5,
  },
});