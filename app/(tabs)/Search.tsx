import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState, useRef } from 'react';
import { ActivityIndicator, Alert, FlatList, Image, StyleSheet, Text, TextInput, TouchableOpacity, View, ScrollView, Animated } from 'react-native';
import { useProperties } from '../../hooks/useProperties';
import { useFavorites } from '../../hooks/useFavorites';
import { Property, getPropertyDetails } from '../../services/propertyService';

export default function SearchScreen() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [searched, setSearched] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    bedrooms: '',
    bathrooms: '',
    propertyType: '',
  });
  const [selectedPropertyType, setSelectedPropertyType] = useState('');
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  
  const {
    properties: results,
    loading,
    error,
    searchProperties,
    clearError,
  } = useProperties({
    autoLoad: false,
  });

  const { toggleFavorite, checkIsFavorite, loading: favoritesLoading } = useFavorites();

  const propertyTypes = [
    { label: 'All Types', value: '' },
    { label: 'Apartment', value: 'apartment' },
    { label: 'House', value: 'house' },
    { label: 'Condo', value: 'condo' },
    { label: 'Studio', value: 'studio' },
    { label: 'Townhouse', value: 'townhouse' },
  ];

  const popularSearches = [
    'San Francisco, CA',
    'Los Angeles, CA', 
    'Portland, OR',
    'Austin, TX',
    'Boston, MA'
  ];

  const handleSearch = async (searchQuery?: string) => {
    const searchTerm = searchQuery || query.trim();
    if (!searchTerm) {
      Alert.alert('Search Error', 'Please enter a search term');
      return;
    }

    try {
      setSearched(true);
      setShowSuggestions(false);
      clearError();
      
      // Add to search history
      if (!searchHistory.includes(searchTerm)) {
        setSearchHistory(prev => [searchTerm, ...prev.slice(0, 4)]);
      }
      
      // Prepare search parameters
      const searchParams: any = { search: searchTerm };
      
      // Add filters if they exist
      if (filters.minPrice) searchParams.minPrice = parseInt(filters.minPrice);
      if (filters.maxPrice) searchParams.maxPrice = parseInt(filters.maxPrice);
      if (filters.bedrooms) searchParams.bedrooms = parseInt(filters.bedrooms);
      if (filters.bathrooms) searchParams.bathrooms = parseInt(filters.bathrooms);
      if (filters.propertyType) searchParams.propertyType = filters.propertyType;
      
      await searchProperties(searchTerm, searchParams);
    } catch (err) {
      console.error('Search failed:', err);
    }
  };

  const handleRetry = () => {
    clearError();
    handleSearch();
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

  const toggleFilters = () => {
    setShowFilters(!showFilters);
    Animated.timing(fadeAnim, {
      toValue: showFilters ? 0 : 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const clearFilters = () => {
    setFilters({
      minPrice: '',
      maxPrice: '',
      bedrooms: '',
      bathrooms: '',
      propertyType: '',
    });
    setSelectedPropertyType('');
  };

  const renderFilterSection = () => (
    <Animated.View style={[styles.filterSection, { opacity: fadeAnim }]}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
        {propertyTypes.map((type) => (
          <TouchableOpacity
            key={type.value}
            style={[
              styles.filterChip,
              selectedPropertyType === type.value && styles.filterChipActive
            ]}
            onPress={() => {
              setSelectedPropertyType(type.value);
              setFilters(prev => ({ ...prev, propertyType: type.value }));
            }}
          >
            <Text style={[
              styles.filterChipText,
              selectedPropertyType === type.value && styles.filterChipTextActive
            ]}>
              {type.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      
      <View style={styles.filterInputs}>
        <View style={styles.filterRow}>
          <View style={styles.filterInput}>
            <Text style={styles.filterLabel}>Min Price</Text>
            <TextInput
              style={styles.input}
              placeholder="$0"
              value={filters.minPrice}
              onChangeText={(text) => setFilters(prev => ({ ...prev, minPrice: text }))}
              keyboardType="numeric"
            />
          </View>
          <View style={styles.filterInput}>
            <Text style={styles.filterLabel}>Max Price</Text>
            <TextInput
              style={styles.input}
              placeholder="$10,000"
              value={filters.maxPrice}
              onChangeText={(text) => setFilters(prev => ({ ...prev, maxPrice: text }))}
              keyboardType="numeric"
            />
          </View>
        </View>
        
        <View style={styles.filterRow}>
          <View style={styles.filterInput}>
            <Text style={styles.filterLabel}>Bedrooms</Text>
            <TextInput
              style={styles.input}
              placeholder="Any"
              value={filters.bedrooms}
              onChangeText={(text) => setFilters(prev => ({ ...prev, bedrooms: text }))}
              keyboardType="numeric"
            />
          </View>
          <View style={styles.filterInput}>
            <Text style={styles.filterLabel}>Bathrooms</Text>
            <TextInput
              style={styles.input}
              placeholder="Any"
              value={filters.bathrooms}
              onChangeText={(text) => setFilters(prev => ({ ...prev, bathrooms: text }))}
              keyboardType="numeric"
            />
          </View>
        </View>
        
        <View style={styles.filterActions}>
          <TouchableOpacity style={styles.clearButton} onPress={clearFilters}>
            <Text style={styles.clearButtonText}>Clear Filters</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.applyButton} 
            onPress={() => handleSearch()}
          >
            <Text style={styles.applyButtonText}>Apply Filters</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );

  const renderSearchSuggestions = () => (
    <View style={styles.suggestionsContainer}>
      <Text style={styles.suggestionsTitle}>Popular Searches</Text>
      <View style={styles.suggestionsGrid}>
        {popularSearches.map((search, index) => (
          <TouchableOpacity
            key={index}
            style={styles.suggestionChip}
            onPress={() => {
              setQuery(search);
              handleSearch(search);
            }}
          >
            <Ionicons name="location-outline" size={16} color="#764ba2" />
            <Text style={styles.suggestionText}>{search}</Text>
          </TouchableOpacity>
        ))}
      </View>
      
      {searchHistory.length > 0 && (
        <>
          <Text style={styles.suggestionsTitle}>Recent Searches</Text>
          {searchHistory.map((search, index) => (
            <TouchableOpacity
              key={index}
              style={styles.historyItem}
              onPress={() => {
                setQuery(search);
                handleSearch(search);
              }}
            >
              <Ionicons name="time-outline" size={16} color="#666" />
              <Text style={styles.historyText}>{search}</Text>
            </TouchableOpacity>
          ))}
        </>
      )}
    </View>
  );

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
          <View style={styles.propertyTypeBadge}>
            <Text style={styles.propertyTypeText}>{item.propertyType || 'Property'}</Text>
          </View>
        </View>
        <View style={styles.info}>
          <Text style={styles.price}>${item.price.toLocaleString()}</Text>
          <View style={styles.addressRow}>
            <Ionicons name="location-outline" size={16} color="#764ba2" />
            <Text style={styles.location}>{item.address}</Text>
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
      
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by location, city, or address..."
            value={query}
            onChangeText={(text) => {
              setQuery(text);
              setShowSuggestions(text.length > 0);
            }}
            onSubmitEditing={() => handleSearch()}
            returnKeyType="search"
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')}>
              <Ionicons name="close-circle" size={20} color="#666" />
            </TouchableOpacity>
          )}
        </View>
        
        <TouchableOpacity 
          style={[styles.searchButton, loading && styles.buttonDisabled]} 
          onPress={() => handleSearch()}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Ionicons name="search" size={20} color="#fff" />
          )}
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.filterButton} onPress={toggleFilters}>
          <Ionicons name="options" size={20} color="#764ba2" />
        </TouchableOpacity>
      </View>

      {showFilters && renderFilterSection()}
      
      {showSuggestions && !searched && renderSearchSuggestions()}
      
      {error ? (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={48} color="#fff" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
            <Text style={styles.retryButtonText}>Retry Search</Text>
          </TouchableOpacity>
        </View>
      ) : loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#fff" />
          <Text style={styles.loadingText}>Searching properties...</Text>
        </View>
      ) : searched && (
        <View style={styles.resultsContainer}>
          <View style={styles.resultsHeader}>
            <Text style={styles.resultsCount}>
              {results.length} {results.length === 1 ? 'property' : 'properties'} found
            </Text>
            <TouchableOpacity onPress={toggleFilters}>
              <Text style={styles.filterText}>Filters</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={results}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={{ paddingVertical: 20 }}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Ionicons name="search" size={64} color="rgba(255,255,255,0.6)" />
                <Text style={styles.emptyText}>No properties found</Text>
                <Text style={styles.emptySubtext}>Try adjusting your search terms or filters</Text>
                <TouchableOpacity style={styles.clearSearchButton} onPress={() => setSearched(false)}>
                  <Text style={styles.clearSearchButtonText}>New Search</Text>
                </TouchableOpacity>
              </View>
            }
          />
        </View>
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f1f6',
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  searchIcon: {
    marginRight: 6,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    paddingVertical: 8,
  },
  searchButton: {
    backgroundColor: '#764ba2',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
    marginLeft: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  filterButton: {
    padding: 10,
    marginLeft: 8,
  },
  filterSection: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
    zIndex: 10,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    maxHeight: '80%',
  },
  filterScroll: {
    marginBottom: 12,
  },
  filterChip: {
    backgroundColor: '#e0e0e0',
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  filterChipActive: {
    backgroundColor: '#764ba2',
    borderColor: '#764ba2',
  },
  filterChipText: {
    color: '#333',
    fontSize: 13,
    fontWeight: '600',
  },
  filterChipTextActive: {
    color: '#fff',
  },
  filterInputs: {
    marginTop: 8,
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  filterInput: {
    flex: 1,
    marginRight: 8,
  },
  filterLabel: {
    fontSize: 13,
    color: '#666',
    marginBottom: 4,
  },
  filterActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  clearButton: {
    backgroundColor: '#f0f1f6',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#764ba2',
  },
  clearButtonText: {
    color: '#764ba2',
    fontSize: 13,
    fontWeight: '600',
  },
  applyButton: {
    backgroundColor: '#764ba2',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  suggestionsContainer: {
    paddingHorizontal: 16,
    marginTop: 8,
  },
  suggestionsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  suggestionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  suggestionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 18,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginBottom: 8,
    marginRight: 8,
  },
  suggestionText: {
    color: '#fff',
    fontSize: 13,
    marginLeft: 6,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  historyText: {
    color: '#fff',
    fontSize: 13,
    marginLeft: 6,
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
  propertyTypeBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(118,75,162,0.7)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    zIndex: 2,
  },
  propertyTypeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
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
  location: {
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
  resultsContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  resultsCount: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  filterText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
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
  clearSearchButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 16,
  },
  clearSearchButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
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
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#f0f1f6',
    borderRadius: 8,
    padding: 10,
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
});

