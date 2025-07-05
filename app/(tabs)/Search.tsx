import { NavigationProp, useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { addToFavorites } from '../../store/slices/favoritesSlice';
import { addToSearchHistory, fetchProperties, Property, setSearchFilters } from '../../store/slices/propertiesSlice';

type RootStackParamList = {
  PropertyDetails: { property: Property };
};

const propertyTypes = ['House', 'Apartment', 'Condo', 'Townhouse', 'Cottage'];
const amenities = ['Pool', 'Gym', 'Garden', 'Balcony', 'Parking', 'Security'];

export default function SearchScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const dispatch = useAppDispatch();
  const { properties, loading, searchFilters } = useAppSelector((state) => state.properties);

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [localFilters, setLocalFilters] = useState({
    location: '',
    minPrice: '',
    maxPrice: '',
    propertyType: '',
    minBedrooms: '',
    minBathrooms: '',
    selectedAmenities: [] as string[],
  });

  useEffect(() => {
    setLocalFilters({
      location: searchFilters.location,
      minPrice: searchFilters.minPrice > 0 ? searchFilters.minPrice.toString() : '',
      maxPrice: searchFilters.maxPrice < Infinity ? searchFilters.maxPrice.toString() : '',
      propertyType: searchFilters.propertyType,
      minBedrooms: searchFilters.minBedrooms > 0 ? searchFilters.minBedrooms.toString() : '',
      minBathrooms: searchFilters.minBathrooms > 0 ? searchFilters.minBathrooms.toString() : '',
      selectedAmenities: searchFilters.amenities,
    });
  }, [searchFilters]);

  const applyFilters = () => {
    const filters = {
      location: localFilters.location,
      minPrice: Number(localFilters.minPrice) || 0,
      maxPrice: Number(localFilters.maxPrice) || Infinity,
      propertyType: localFilters.propertyType,
      minBedrooms: Number(localFilters.minBedrooms) || 0,
      minBathrooms: Number(localFilters.minBathrooms) || 0,
      amenities: localFilters.selectedAmenities,
    };

    dispatch(setSearchFilters(filters));
    dispatch(addToSearchHistory(filters));
    dispatch(fetchProperties(filters));
  };

  const toggleAmenity = (amenity: string) => {
    setLocalFilters(prev => ({
      ...prev,
      selectedAmenities: prev.selectedAmenities.includes(amenity)
        ? prev.selectedAmenities.filter(a => a !== amenity)
        : [...prev.selectedAmenities, amenity]
    }));
  };

  const clearFilters = () => {
    const defaultFilters = {
      location: '',
      minPrice: 0,
      maxPrice: Infinity,
      propertyType: '',
      minBedrooms: 0,
      minBathrooms: 0,
      amenities: [],
    };
    setLocalFilters({
      location: '',
      minPrice: '',
      maxPrice: '',
      propertyType: '',
      minBedrooms: '',
      minBathrooms: '',
      selectedAmenities: [],
    });
    dispatch(setSearchFilters(defaultFilters));
    dispatch(fetchProperties(defaultFilters));
  };

  const handleFavorite = (property: Property) => {
    dispatch(addToFavorites(property));
  };

  const renderItem = ({ item }: { item: Property }) => (
    <TouchableOpacity
      style={styles.resultCard}
      onPress={() => navigation.navigate('PropertyDetails', { property: item })}
    >
      <View style={styles.resultHeader}>
        <Text style={styles.price}>${item.price.toLocaleString()}</Text>
        <TouchableOpacity onPress={() => handleFavorite(item)} style={styles.favoriteBtn}>
          <Text style={styles.favoriteIcon}>♥</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.address}>{item.address}</Text>
      <Text style={styles.details}>
        {item.bedrooms} bd • {item.bathrooms} ba • {item.size} sqft
      </Text>
      {item.propertyType && (
        <Text style={styles.propertyType}>{item.propertyType}</Text>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ScrollView style={styles.filters} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Search Properties</Text>
        
        <TextInput
          style={styles.input}
          placeholder="Location (city, neighborhood, zip)"
          value={localFilters.location}
          onChangeText={(text) => setLocalFilters(prev => ({ ...prev, location: text }))}
        />

        <View style={styles.row}>
          <TextInput
            style={[styles.input, styles.halfInput]}
            placeholder="Min Price"
            keyboardType="numeric"
            value={localFilters.minPrice}
            onChangeText={(text) => setLocalFilters(prev => ({ ...prev, minPrice: text }))}
          />
          <TextInput
            style={[styles.input, styles.halfInput]}
            placeholder="Max Price"
            keyboardType="numeric"
            value={localFilters.maxPrice}
            onChangeText={(text) => setLocalFilters(prev => ({ ...prev, maxPrice: text }))}
          />
        </View>

        <TouchableOpacity 
          style={styles.advancedToggle}
          onPress={() => setShowAdvanced(!showAdvanced)}
        >
          <Text style={styles.advancedToggleText}>
            {showAdvanced ? 'Hide' : 'Show'} Advanced Filters
          </Text>
        </TouchableOpacity>

        {showAdvanced && (
          <View style={styles.advancedFilters}>
            <Text style={styles.filterLabel}>Property Type</Text>
            <View style={styles.chipContainer}>
              {propertyTypes.map(type => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.chip,
                    localFilters.propertyType === type && styles.chipSelected
                  ]}
                  onPress={() => setLocalFilters(prev => ({ ...prev, propertyType: type }))}
                >
                  <Text style={[
                    styles.chipText,
                    localFilters.propertyType === type && styles.chipTextSelected
                  ]}>
                    {type}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.row}>
              <View style={styles.halfInput}>
                <Text style={styles.filterLabel}>Min Bedrooms</Text>
                <TextInput
                  style={styles.input}
                  placeholder="0"
                  keyboardType="numeric"
                  value={localFilters.minBedrooms}
                  onChangeText={(text) => setLocalFilters(prev => ({ ...prev, minBedrooms: text }))}
                />
              </View>
              <View style={styles.halfInput}>
                <Text style={styles.filterLabel}>Min Bathrooms</Text>
                <TextInput
                  style={styles.input}
                  placeholder="0"
                  keyboardType="numeric"
                  value={localFilters.minBathrooms}
                  onChangeText={(text) => setLocalFilters(prev => ({ ...prev, minBathrooms: text }))}
                />
              </View>
            </View>

            <Text style={styles.filterLabel}>Amenities</Text>
            <View style={styles.chipContainer}>
              {amenities.map(amenity => (
                <TouchableOpacity
                  key={amenity}
                  style={[
                    styles.chip,
                    localFilters.selectedAmenities.includes(amenity) && styles.chipSelected
                  ]}
                  onPress={() => toggleAmenity(amenity)}
                >
                  <Text style={[
                    styles.chipText,
                    localFilters.selectedAmenities.includes(amenity) && styles.chipTextSelected
                  ]}>
                    {amenity}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        <View style={styles.buttonRow}>
          <TouchableOpacity style={[styles.button, styles.clearButton]} onPress={clearFilters}>
            <Text style={styles.clearButtonText}>Clear</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.searchButton]} onPress={applyFilters}>
            <Text style={styles.searchButtonText}>Search</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {loading ? (
        <ActivityIndicator size="large" style={styles.loader} />
      ) : (
        <FlatList
          data={properties}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.resultsList}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f5f5f5' 
  },
  filters: { 
    maxHeight: 400,
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 15,
    color: '#333'
  },
  row: { 
    flexDirection: 'row', 
    justifyContent: 'space-between' 
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: '#fff'
  },
  halfInput: { 
    width: '48%' 
  },
  advancedToggle: {
    paddingVertical: 10,
    alignItems: 'center',
    marginBottom: 15
  },
  advancedToggleText: {
    color: '#ff8c00',
    fontSize: 16,
    fontWeight: '500'
  },
  advancedFilters: {
    marginBottom: 15
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333'
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 15
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: '#fff'
  },
  chipSelected: {
    backgroundColor: '#ff8c00',
    borderColor: '#ff8c00'
  },
  chipText: {
    fontSize: 14,
    color: '#666'
  },
  chipTextSelected: {
    color: '#fff'
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  button: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5
  },
  clearButton: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#ddd'
  },
  clearButtonText: {
    color: '#666',
    fontWeight: '600'
  },
  searchButton: {
    backgroundColor: '#ff8c00'
  },
  searchButtonText: { 
    color: '#fff', 
    fontWeight: '600' 
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  resultsList: {
    padding: 20
  },
  resultCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5
  },
  price: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333'
  },
  favoriteBtn: {
    padding: 5
  },
  favoriteIcon: {
    fontSize: 20,
    color: '#ff8c00'
  },
  address: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5
  },
  details: {
    fontSize: 14,
    color: '#666',
    marginBottom: 3
  },
  propertyType: {
    fontSize: 12,
    color: '#999',
    textTransform: 'uppercase',
    fontWeight: '500'
  }
});