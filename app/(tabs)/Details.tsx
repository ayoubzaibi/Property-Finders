import DetailsHeader from "@/components/DetailsHeader";
import DetailsInfo from "@/components/DetailsInfo";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, View } from "react-native";
import Colors from "../../constants/Colors";
import { useFavorites } from "../../hooks/useFavorites";
import { getPropertyDetails } from "../../services/propertyService";

export default function DetailsScreen() {
  const { propertyId } = useLocalSearchParams();
  const router = useRouter();
  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const {
    toggleFavorite,
    checkIsFavorite,
    loading: favoritesLoading,
  } = useFavorites();

  useEffect(() => {
    if (!propertyId) {
      setError("No propertyId provided.");
      setLoading(false);
      return;
    }
    loadPropertyDetails();
    // eslint-disable-next-line
  }, [propertyId]);

  const loadPropertyDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const propertyData = await getPropertyDetails(propertyId as string);
      if (propertyData) setProperty(propertyData);
      else setError("Property not found");
    } catch {
      setError("Failed to load property details");
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <LinearGradient
        colors={[Colors.background, Colors.card]}
        style={styles.gradient}
      >
        <View style={styles.center}>
          <ActivityIndicator size="large" color={Colors.accent} />
        </View>
      </LinearGradient>
    );
  if (error || !property)
    return (
      <LinearGradient
        colors={[Colors.background, Colors.card]}
        style={styles.gradient}
      >
        <View style={styles.center}>
          <DetailsHeader
            onBack={router.back}
            isFavorite={false}
            loading={false}
            onFavorite={() => {}}
          />
          <View style={styles.error}>
            <>{error || "Property not found"}</>
          </View>
        </View>
      </LinearGradient>
    );

  return (
    <LinearGradient
      colors={[Colors.background, Colors.card]}
      style={styles.gradient}
    >
      <DetailsHeader
        onBack={router.back}
        isFavorite={checkIsFavorite(property.id)}
        loading={favoritesLoading}
        onFavorite={() => toggleFavorite(property)}
      />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <DetailsInfo property={property} />
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  container: { flex: 1 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  error: {
    color: Colors.text,
    fontSize: 16,
    marginTop: 40,
    textAlign: "center",
  },
});
