import HomeHeader from '@/components/HomeHeader';
import PropertyCard from '@/components/PropertyCard';
import PropertyListItem from '@/components/PropertyListItem';
import QuickFilters from '@/components/QuickFilters';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text } from 'react-native';
import { useFavorites } from '../../hooks/useFavorites';
import { useProperties } from '../../hooks/useProperties'; 

export default function HomeScreen() {
  const [showQuickFilters, setShowQuickFilters] = useState(false);
  const [quickFilters, setQuickFilters] = useState({ propertyType: '', priceRange: '' });
  const { properties, loading, refreshing, refresh } = useProperties({ autoLoad: true, initialParams: { limit: 20 } });
  const { toggleFavorite, checkIsFavorite, isLoading } = useFavorites();

  const getFilteredProperties = () => {
    if (!quickFilters.propertyType && !quickFilters.priceRange) return properties;
    return properties.filter(property => {
      if (quickFilters.propertyType && property.propertyType?.toLowerCase() !== quickFilters.propertyType.toLowerCase()) return false;
      if (quickFilters.priceRange) {
        const [minPrice, maxPrice] = quickFilters.priceRange.split('-').map(Number);
        if (property.price < minPrice || property.price > maxPrice) return false;
      }
      return true;
    });
  };

  if (loading) return <PropertyCard />;

  return (
    <LinearGradient colors={["#667eea", "#764ba2"]} style={styles.gradient}>
      <HomeHeader onFilterPress={() => setShowQuickFilters(v => !v)} />
      {showQuickFilters && (
        <QuickFilters
          quickFilters={quickFilters}
          setQuickFilters={setQuickFilters}
          onClear={() => setQuickFilters({ propertyType: '', priceRange: '' })}
        />
      )}
      <FlatList
        data={getFilteredProperties()}
        renderItem={({ item }) => (
          <PropertyListItem
            property={item}
            isFavorite={checkIsFavorite(item.id)}
            loading={isLoading(item.id)}
            onFavorite={() => toggleFavorite(item)}
          />
        )}
        keyExtractor={item => item.id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} />}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={<Text style={styles.emptyText}>No properties found.</Text>}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  listContent: { paddingVertical: 30, paddingTop: 0 },
  emptyText: { color: '#fff', textAlign: 'center', marginTop: 40, fontSize: 16 },
});
