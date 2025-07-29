/* eslint-disable @typescript-eslint/no-unused-vars */
import HomeHeader from "@/components/HomeHeader";

import PropertyCard from "@/components/PropertyCard";
import PropertyCardPlaceholder from "@/components/PropertyCardPlaceholder";
import QuickFilters from "@/components/QuickFilters";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
import { FlatList, RefreshControl, StyleSheet, Text } from "react-native";
import Colors from "../../constants/Colors";
import { useFavorites } from "../../hooks/useFavorites";
import { useProperties } from "../../hooks/useProperties";

export default function HomeScreen() {
  const [showQuickFilters, setShowQuickFilters] = useState(false);
  const [quickFilters, setQuickFilters] = useState({
    propertyType: "",
    priceRange: "",
  });
  const { properties, loading, refreshing, refresh } = useProperties({
    autoLoad: true,
    initialParams: { limit: 20 },
  });
  const { toggleFavorite, checkIsFavorite, isLoading } = useFavorites();
  const router = useRouter();

  const getFilteredProperties = () => {
    if (!quickFilters.propertyType && !quickFilters.priceRange)
      return properties;
    return properties.filter((property) => {
      if (
        quickFilters.propertyType &&
        property.propertyType?.toLowerCase() !==
          quickFilters.propertyType.toLowerCase()
      )
        return false;
      if (quickFilters.priceRange) {
        const [minPrice, maxPrice] = quickFilters.priceRange
          .split("-")
          .map(Number);
        if (property.price < minPrice || property.price > maxPrice)
          return false;
      }
      return true;
    });
  };

  if (loading) return <PropertyCardPlaceholder />;

  return (
    <LinearGradient
      colors={[Colors.background, Colors.card]}
      style={styles.gradient}
    >
      <HomeHeader onFilterPress={() => setShowQuickFilters((v) => !v)} />
      {showQuickFilters && (
        <QuickFilters
          quickFilters={quickFilters}
          setQuickFilters={setQuickFilters}
          onClear={() => setQuickFilters({ propertyType: "", priceRange: "" })}
        />
      )}
      <FlatList
        data={getFilteredProperties()}
        renderItem={({ item }) => (
          <PropertyCard
            property={item}
            onPress={() => router.push(`/Details?propertyId=${item.id}`)}
            onFavorite={() => toggleFavorite(item)}
            isFavorite={checkIsFavorite(item.id)}
          />
        )}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refresh} />
        }
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No properties found.</Text>
        }
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  listContent: { paddingVertical: 30, paddingTop: 0 },
  emptyText: {
    color: Colors.textMuted,
    textAlign: "center",
    marginTop: 40,
    fontSize: 16,
  },
});
