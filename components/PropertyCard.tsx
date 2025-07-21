import { Ionicons } from "@expo/vector-icons";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Colors from "../constants/Colors";
import type { Property } from "../services/propertyService";

interface PropertyCardProps {
  property: Property;
  onPress?: () => void;
  onFavorite?: () => void;
  isFavorite?: boolean;
}

export default function PropertyCard({
  property,
  onPress,
  onFavorite,
  isFavorite,
}: PropertyCardProps) {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={onPress ? 0.8 : 1}
      accessible
      accessibilityLabel={`View details for ${
        property.title || property.address
      }`}
      accessibilityHint="Navigates to the property details screen"
    >
      <Image
        source={{
          uri:
            property.photos?.[0] ||
            "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400",
        }}
        style={styles.image}
        accessible
        accessibilityLabel={`Image of ${property.title || property.address}`}
      />
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>
          {property.title || property.address}
        </Text>
        <Text style={styles.price}>
          ${property.price?.toLocaleString() || "N/A"}
        </Text>
        {onFavorite && (
          <TouchableOpacity
            onPress={onFavorite}
            style={styles.favoriteBtn}
            hitSlop={8}
            accessible
            accessibilityLabel={
              isFavorite ? "Remove from favorites" : "Add to favorites"
            }
            accessibilityRole="button"
          >
            <Ionicons
              name={isFavorite ? "heart" : "heart-outline"}
              size={22}
              color={isFavorite ? Colors.accent : Colors.textMuted}
            />
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    marginBottom: 18,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  image: {
    width: "100%",
    height: 160,
    backgroundColor: "#eee",
  },
  info: {
    padding: 12,
    position: "relative",
  },
  title: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.accent,
    marginBottom: 2,
  },
  price: {
    fontSize: 14,
    color: Colors.textMuted,
    fontWeight: "500",
  },
  favoriteBtn: {
    position: "absolute",
    top: 0,
    right: 0,
    padding: 4,
  },
});
