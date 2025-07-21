import PropertyCard from "@/components/PropertyCard";
import PropertyCardPlaceholder from "@/components/PropertyCardPlaceholder";
import UserHeader from "@/components/UserHeader";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, FlatList, StyleSheet, Text, View } from "react-native";
import Colors from "../../constants/Colors";
import { useFavorites } from "../../hooks/useFavorites";
import { Property } from "../../services/propertyService";
import { useSession } from "../context";

export default function FavoritesScreen() {
  const router = useRouter();
  const { user } = useSession();
  const { favorites, toggleFavorite, checkIsFavorite, isLoading } =
    useFavorites();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
          "Removed from Favorites",
          "Property has been removed from your favorites.",
          [{ text: "OK" }]
        );
      } else {
        Alert.alert(
          "Error",
          "Failed to remove from favorites. Please try again."
        );
      }
    } catch (error) {
      console.error("Error removing favorite:", error);
      Alert.alert(
        "Error",
        "Failed to remove from favorites. Please try again."
      );
    }
  };

  const handlePropertyPress = (propertyId: string) => {
    router.push(`/Details?propertyId=${propertyId}`);
  };

  if (loading) {
    return <PropertyCardPlaceholder />;
  }

  if (!user) {
    return (
      <LinearGradient
        colors={[Colors.background, Colors.card]}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <UserHeader title="Favorites" subtitle="Your saved properties" />
        <View style={styles.emptyContainer}>
          <Ionicons name="heart-outline" size={64} color={Colors.textMuted} />
          <Text style={styles.emptyText}>Please log in to view favorites</Text>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={[Colors.background, Colors.card]}
      style={styles.gradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <UserHeader title="Favorites" subtitle="Your saved properties" />
      {favorites.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="heart-outline" size={64} color={Colors.textMuted} />
          <Text style={styles.emptyText}>No favorites yet</Text>
          <Text style={styles.emptySubtext}>
            Add properties to your favorites by tapping the heart icon.
          </Text>
        </View>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <PropertyCard
              property={item}
              onPress={() => handlePropertyPress(item.id)}
              onFavorite={() => handleFavoritePress(item)}
              isFavorite={checkIsFavorite(item.id)}
            />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingVertical: 30 }}
        />
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: {
    color: Colors.text,
    fontSize: 15,
    marginTop: 12,
    fontWeight: "500",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  emptyText: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: "600",
    marginTop: 12,
    marginBottom: 6,
  },
  emptySubtext: { color: Colors.textMuted, fontSize: 13, textAlign: "center" },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  errorText: {
    color: Colors.text,
    fontSize: 15,
    textAlign: "center",
    marginTop: 12,
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: Colors.card,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: { color: Colors.text, fontSize: 15, fontWeight: "600" },
  card: {
    width: "100%",
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: Colors.card,
    marginBottom: 20,
    elevation: 6,
    shadowColor: Colors.background,
    shadowOpacity: 0.13,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
  },
  imageContainer: {
    width: "100%",
    height: 140,
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  favoriteIcon: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "rgba(118,75,162,0.7)",
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
    fontWeight: "700",
    color: Colors.accent,
    marginBottom: 6,
  },
  addressRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  address: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: "500",
  },
  detailsRow: {
    flexDirection: "row",
    marginBottom: 12,
  },
  detailsText: {
    fontSize: 13,
    color: Colors.textMuted,
    fontWeight: "500",
  },
  detailsButton: {
    backgroundColor: Colors.accent,
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: "center",
    marginTop: 4,
  },
  detailsButtonText: {
    color: Colors.text,
    fontWeight: "700",
    fontSize: 14,
    letterSpacing: 0.5,
  },
});
