import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Image, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useFavorites } from '../../hooks/useFavorites';
import { useProperties } from '../../hooks/useProperties';
import { checkServerStatus, findWorkingServer, Property, testServerConnection } from '../../services/propertyService';

export default function HomeScreen() {
  const router = useRouter();
  const [showQuickFilters, setShowQuickFilters] = useState(false);
  const [quickFilters, setQuickFilters] = useState({
    propertyType: '',
    priceRange: '',
  });
  
  const {
    properties,
    loading,
    error,
    refreshing,
    refresh,
    clearError,
  } = useProperties({
    autoLoad: true,
    initialParams: {
      limit: 20,
      // You can add default filters here
      // location: 'Springfield',
      // minPrice: 200000,
      // maxPrice: 800000,
    },
  });

  const { toggleFavorite, checkIsFavorite, loading: favoritesLoading } = useFavorites();

  const propertyTypes = [
    { label: 'All', value: '', icon: 'home-outline' },
    { label: 'House', value: 'house', icon: 'home' },
    { label: 'Apartment', value: 'apartment', icon: 'business-outline' },
    { label: 'Condo', value: 'condo', icon: 'business' },
  ];

  const priceRanges = [
    { label: 'Any Price', value: '' },
    { label: 'Under $300k', value: '0-300000' },
    { label: '$300k-$500k', value: '300000-500000' },
    { label: '$500k-$750k', value: '500000-750000' },
    { label: 'Over $750k', value: '750000-999999999' },
  ];

  const handleRefresh = () => {
    refresh();
  };

  const handleRetry = () => {
    clearError();
    refresh();
  };

  const handleTestConnection = async () => {
    try {
      const result = await testServerConnection();
      Alert.alert(
        'Server Connection Test',
        `URL: ${result.url}\n\nStatus: ${result.success ? '✅ Success' : '❌ Failed'}\n\nMessage: ${result.message}`,
        [{ text: 'OK' }]
      );
    } catch (err) {
      Alert.alert('Test Failed', 'Could not test server connection');
    }
  };

  const handleFindServer = async () => {
    try {
      Alert.alert('Finding Server', 'Testing multiple server URLs...', [], { cancelable: false });
      
      const result = await findWorkingServer();
      
      Alert.alert(
        'Server Search Result',
        result.success 
          ? `✅ ${result.message}\n\nWorking URL: ${result.workingUrl}\n\nPlease update your server configuration to use this URL.`
          : `❌ ${result.message}\n\nPlease make sure your server is running on port 3000.`,
        [
          { 
            text: 'OK',
            onPress: () => {
              if (result.success) {
                Alert.alert(
                  'Update Configuration',
                  'Would you like me to help you update the configuration with the working URL?',
                  [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Yes', onPress: () => console.log('Update config with:', result.workingUrl) }
                  ]
                );
              }
            }
          }
        ]
      );
    } catch (err) {
      Alert.alert('Search Failed', 'Could not search for servers');
    }
  };

  const handleCheckServerStatus = async () => {
    try {
      Alert.alert('Checking Server Status', 'Please wait...', [], { cancelable: false });
      
      const result = await checkServerStatus();
      
      const suggestionsText = result.suggestions.length > 0 
        ? '\n\nSuggestions:\n' + result.suggestions.map(s => `• ${s}`).join('\n')
        : '';
      
      Alert.alert(
        'Server Status',
        `${result.message}${suggestionsText}`,
        [{ text: 'OK' }]
      );
    } catch (err) {
      Alert.alert('Status Check Failed', 'Could not check server status');
    }
  };

  const handlePropertyPress = (propertyId: string) => {
    router.push(`/Details?propertyId=${propertyId}`);
  };

  const handleFavoritePress = async (property: Property) => {
    try {
      const success = await toggleFavorite(property);
      if (success) {
        const isFav = checkIsFavorite(property.id);
        Alert.alert(
          isFav ? 'Added to Favorites' : 'Removed from Favorites',
          isFav ? 'Property has been added to your favorites!' : 'Property has been removed from your favorites.',
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert('Error', 'Failed to update favorites. Please try again.');
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      Alert.alert('Error', 'Failed to update favorites. Please try again.');
    }
  };

  const toggleQuickFilters = () => {
    setShowQuickFilters(!showQuickFilters);
  };

  const clearQuickFilters = () => {
    setQuickFilters({
      propertyType: '',
      priceRange: '',
    });
  };

  const getFilteredProperties = () => {
    if (!quickFilters.propertyType && !quickFilters.priceRange) {
      return properties;
    }

    return properties.filter(property => {
      // Filter by property type
      if (quickFilters.propertyType && property.propertyType?.toLowerCase() !== quickFilters.propertyType.toLowerCase()) {
        return false;
      }

      // Filter by price range
      if (quickFilters.priceRange) {
        const [minPrice, maxPrice] = quickFilters.priceRange.split('-').map(Number);
        if (property.price < minPrice || property.price > maxPrice) {
          return false;
        }
      }

      return true;
    });
  };

  const renderItem = ({ item }: { item: Property }) => {
    const isFav = checkIsFavorite(item.id);
    
    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.9}
        onPress={() => handlePropertyPress(item.id)}
      >
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: item.photos[0] || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400' }}
            style={styles.image}
            resizeMode="cover"
          />
          <TouchableOpacity 
            style={styles.favoriteIcon} 
            onPress={() => handleFavoritePress(item)}
            disabled={favoritesLoading}
          >
            <Ionicons 
              name={isFav ? "heart" : "heart-outline"} 
              size={24} 
              color={isFav ? "#ff4757" : "#fff"} 
            />
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
      </TouchableOpacity>
    );
  };

  if (loading) {
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
          <TouchableOpacity onPress={handleTestConnection} style={styles.testButton}>
            <Ionicons name="bug-outline" size={24} color="#fff" />
          </TouchableOpacity>
          <Ionicons name="person-circle" size={36} color="#fff" style={styles.headerAvatar} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={styles.loadingText}>Loading properties...</Text>
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
          <Text style={styles.headerTitle}>Discover Properties</Text>
          <Text style={styles.headerSubtitle}>Find your dream home today</Text>
        </View>
        <TouchableOpacity onPress={handleTestConnection} style={styles.testButton}>
          <Ionicons name="bug-outline" size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity onPress={toggleQuickFilters} style={styles.filterButton}>
          <Ionicons name="options" size={24} color="#fff" />
        </TouchableOpacity>
        <Ionicons name="person-circle" size={36} color="#fff" style={styles.headerAvatar} />
      </View>
      
      {/* Quick Filters */}
      {showQuickFilters && (
        <View style={styles.quickFiltersContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Property Type</Text>
              <View style={styles.filterChips}>
                {propertyTypes.map((type) => (
                  <TouchableOpacity
                    key={type.value}
                    style={[
                      styles.filterChip,
                      quickFilters.propertyType === type.value && styles.filterChipActive
                    ]}
                    onPress={() => setQuickFilters(prev => ({ ...prev, propertyType: type.value }))}
                  >
                    <Ionicons 
                      name={type.icon as any} 
                      size={16} 
                      color={quickFilters.propertyType === type.value ? "#fff" : "#764ba2"} 
                    />
                    <Text style={[
                      styles.filterChipText,
                      quickFilters.propertyType === type.value && styles.filterChipTextActive
                    ]}>
                      {type.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Price Range</Text>
              <View style={styles.filterChips}>
                {priceRanges.map((range) => (
                  <TouchableOpacity
                    key={range.value}
                    style={[
                      styles.filterChip,
                      quickFilters.priceRange === range.value && styles.filterChipActive
                    ]}
                    onPress={() => setQuickFilters(prev => ({ ...prev, priceRange: range.value }))}
                  >
                    <Text style={[
                      styles.filterChipText,
                      quickFilters.priceRange === range.value && styles.filterChipTextActive
                    ]}>
                      {range.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>
          
          <View style={styles.filterActions}>
            <TouchableOpacity style={styles.clearFiltersButton} onPress={clearQuickFilters}>
              <Text style={styles.clearFiltersText}>Clear Filters</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      
      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.testConnectionButton} onPress={handleTestConnection}>
            <Text style={styles.testConnectionButtonText}>Test Connection</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.findServerButton} onPress={handleFindServer}>
            <Text style={styles.findServerButtonText}>🔍 Find Working Server</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.statusButton} onPress={handleCheckServerStatus}>
            <Text style={styles.statusButtonText}>📊 Check Server Status</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={getFilteredProperties()}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingVertical: 30, paddingTop: 0 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No properties found</Text>
              <Text style={styles.emptySubtext}>Try adjusting your search criteria</Text>
            </View>
          }
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
    paddingBottom: 16,
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
  testButton: {
    marginRight: 10,
    padding: 4,
  },
  filterButton: {
    marginRight: 10,
    padding: 4,
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
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  testConnectionButton: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    marginBottom: 10,
  },
  testConnectionButtonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '500',
  },
  findServerButton: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
    marginBottom: 10,
  },
  findServerButtonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  statusButton: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  statusButtonText: {
    color: '#fff',
    fontSize: 13,
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
    marginBottom: 6,
  },
  emptySubtext: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 13,
    textAlign: 'center',
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
  quickFiltersContainer: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingVertical: 12,
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 12,
    borderRadius: 12,
  },
  filterSection: {
    marginRight: 20,
    minWidth: 200,
  },
  filterSectionTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    marginLeft: 16,
  },
  filterChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
  },
  filterChip: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 6,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  filterChipActive: {
    backgroundColor: '#764ba2',
    borderColor: '#764ba2',
  },
  filterChipText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 6,
  },
  filterChipTextActive: {
    color: '#fff',
  },
  filterActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
  },
  clearFiltersButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
  },
  clearFiltersText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
});
