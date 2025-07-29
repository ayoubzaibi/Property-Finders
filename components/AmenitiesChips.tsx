import { StyleSheet, Text, View } from "react-native";

interface AmenitiesChipsProps {
  amenities: string[];
}

export default function AmenitiesChips({ amenities }: AmenitiesChipsProps) {
  if (!amenities || amenities.length === 0) return null;
  return (
    <View style={styles.amenitiesRow}>
      {amenities.map((amenity, idx) => (
        <View
          key={idx}
          style={styles.amenityChip}
          accessible
          accessibilityLabel={amenity}
        >
          <Text style={styles.amenityText}>{amenity}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  amenitiesRow: { flexDirection: "row", flexWrap: "wrap", marginBottom: 12 },
  amenityChip: {
    backgroundColor: "#f0e9fa",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginRight: 8,
    marginBottom: 8,
  },
  amenityText: { color: "#764ba2", fontSize: 13, fontWeight: "500" },
});
