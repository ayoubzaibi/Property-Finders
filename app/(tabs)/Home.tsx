/* eslint-disable @typescript-eslint/no-unused-vars */
import HomeHeader from "@/components/HomeHeader";

import PropertyCard from "@/components/PropertyCard";
import PropertyCardPlaceholder from "@/components/PropertyCardPlaceholder";
import QuickFilters from "@/components/QuickFilters";
import { useFocusEffect } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { BackHandler, FlatList, Platform, RefreshControl, StyleSheet, Text, ToastAndroid } from "react-native";
import Colors from "../../constants/Colors";
import { useFavorites } from "../../hooks/useFavorites";
import { fetchProperties, Property } from "../../services/propertyService";

export default function HomeScreen() {
  const [showQuickFilters, setShowQuickFilters] = useState(false);
  const [quickFilters, setQuickFilters] = useState({
    propertyType: "",
    priceRange: "",
  });
  const [properties, setProperties] = useState<Property[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const LIMIT = 2;
  const { toggleFavorite, checkIsFavorite, isLoading } = useFavorites();
  const router = useRouter();

  // Android back handler (unchanged)
  const lastPressRef = useRef(0);
    useFocusEffect(
      useCallback(() => {
        if (Platform.OS !== "android") return;
        const onBackPress = () => {
          const now = Date.now();
          if (lastPressRef.current && now - lastPressRef.current < 2000) {
            BackHandler.exitApp();
            return false;
          }
          lastPressRef.current = now;
          ToastAndroid.show("Press back again to exit", ToastAndroid.SHORT);
          return true;
        };
        const subscription = BackHandler.addEventListener("hardwareBackPress", onBackPress);
        return () => subscription.remove();
      }, [])
    );

  // Load initial properties
  const loadProperties = async (nextPage = 1, reset = false) => {
    if (loading || (!hasMore && !reset)) return;
    setLoading(true);
    try {
      const filters: any = {};
      if (quickFilters.propertyType) filters.propertyType = quickFilters.propertyType;
      if (quickFilters.priceRange) {
        const [minPrice, maxPrice] = quickFilters.priceRange.split("-").map(Number);
        filters.minPrice = minPrice;
        filters.maxPrice = maxPrice;
      }
      const newProps = await fetchProperties({ page: nextPage, limit: LIMIT, ...filters });
      console.log('Fetched', newProps.length, 'properties');
      setProperties(prev => (reset ? newProps : [...prev, ...newProps]));
      setHasMore(newProps.length === LIMIT);
      setPage(nextPage);
    } catch (e) {
      console.error('Error fetching properties:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProperties(1, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quickFilters]);

  // Pull to refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    await loadProperties(1, true);
    setRefreshing(false);
  };

  // Infinite scroll
  const handleLoadMore = () => {
    if (!loading && hasMore) {
      loadProperties(page + 1);
    }
  };

  if (loading && properties.length === 0) return <PropertyCardPlaceholder />;

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
        data={properties}
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
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No properties found.</Text>
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={loading && properties.length > 0 ? <PropertyCardPlaceholder /> : null}
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
