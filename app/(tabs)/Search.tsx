import PropertyListItem from '@/components/PropertyListItem';
import QuickFilters from '@/components/QuickFilters';
import SearchFilters from '@/components/SearchFilters';
import SearchHeader from '@/components/SearchHeader';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { FlatList, StyleSheet, Text } from 'react-native';
import Colors from '../../constants/Colors';
import { useFavorites } from '../../hooks/useFavorites';
import { useProperties } from '../../hooks/useProperties';

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({ minPrice: '', maxPrice: '', bedrooms: '', bathrooms: '', propertyType: '', squareFootage: '', yearBuilt: '' });
  const { properties: results, searchProperties, clearError } = useProperties({ autoLoad: false });
  const { toggleFavorite, checkIsFavorite, isLoading } = useFavorites();

  const handleSearch = async () => {
    if (!query.trim()) return;
    clearError();
    await searchProperties(query, filters);
  };

  return (
    <LinearGradient colors={[Colors.background, Colors.card]} style={styles.gradient}>
      <SearchHeader
        value={query}
        onChange={setQuery}
        onSearch={handleSearch}
        onFilterPress={() => setShowFilters(v => !v)}
      />
      {showFilters && (
        <SearchFilters
          filters={filters}
          setFilters={setFilters}
          onClear={() => setFilters({ minPrice: '', maxPrice: '', bedrooms: '', bathrooms: '', propertyType: '', squareFootage: '', yearBuilt: '' })}
        />
      )}
      <QuickFilters
        quickFilters={{ propertyType: filters.propertyType, priceRange: filters.minPrice && filters.maxPrice ? `${filters.minPrice}-${filters.maxPrice}` : '' }}
        setQuickFilters={v => setFilters(f => ({ ...f, ...v }))}
        onClear={() => setFilters(f => ({ ...f, propertyType: '', minPrice: '', maxPrice: '' }))}
      />
      <FlatList
        data={results}
        renderItem={({ item }) => (
          <PropertyListItem
            property={item}
            isFavorite={checkIsFavorite(item.id)}
            loading={isLoading(item.id)}
            onFavorite={() => toggleFavorite(item)}
          />
        )}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={<Text style={styles.emptyText}>No properties found.</Text>}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  listContent: { paddingVertical: 30, paddingTop: 0 },
  emptyText: { color: Colors.textMuted, textAlign: 'center', marginTop: 40, fontSize: 16 },
});

