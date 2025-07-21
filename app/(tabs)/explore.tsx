import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import PropertyCard from "../../components/PropertyCard";
import Colors from "../../constants/Colors";
import { fetchProperties, Property } from "../../services/propertyService";

export default function ExploreScreen() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const loadProperties = () => {
    setLoading(true);
    setError(null);
    fetchProperties({ limit: 10 })
      .then(setProperties)
      .catch(() => setError("Failed to load properties"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadProperties();
  }, []);

  if (loading) {
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
  }

  if (error) {
    return (
      <LinearGradient
        colors={[Colors.background, Colors.card]}
        style={styles.gradient}
      >
        <View style={styles.center}>
          <Text style={styles.error}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadProperties}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={[Colors.background, Colors.card]}
      style={styles.gradient}
    >
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Explore</Text>
        <Text style={styles.subheader}>
          Discover new places and featured properties
        </Text>
      </View>
      <FlatList
        data={properties}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <PropertyCard
            property={item}
            onPress={() => router.push(`/Details?propertyId=${item.id}`)}
          />
        )}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    paddingTop: 40,
  },
  headerContainer: {
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    color: Colors.accent,
    marginBottom: 2,
    letterSpacing: 0.5,
  },
  subheader: {
    fontSize: 15,
    fontWeight: "500",
    color: Colors.textMuted,
    marginBottom: 16,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  error: {
    color: Colors.text,
    fontSize: 16,
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: Colors.accent,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
});
