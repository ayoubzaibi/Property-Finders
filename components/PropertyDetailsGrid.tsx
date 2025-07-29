import { StyleSheet, Text, View } from "react-native";

type Property = {
  bedrooms?: number;
  bathrooms?: number;
  areaSqft?: number;
  yearBuilt?: number;
  lotSizeSqft?: number;
  propertyType?: string;
  [key: string]: any;
};

type PropertyDetailsGridProps = {
  property: Property;
};

export default function PropertyDetailsGrid({ property }: PropertyDetailsGridProps) {
  return (
    <View style={styles.gridContainer}>
      <View style={styles.row}>
        <View style={styles.item}>
          <Text style={styles.label}>Bedrooms</Text>
          <Text style={styles.value}>
            {property.bedrooms !== undefined && property.bedrooms !== null
              ? property.bedrooms
              : "—"}
          </Text>
        </View>
        <View style={styles.item}>
          <Text style={styles.label}>Bathrooms</Text>
          <Text style={styles.value}>
            {property.bathrooms !== undefined && property.bathrooms !== null
              ? property.bathrooms
              : "—"}
          </Text>
        </View>
      </View>
      <View style={styles.row}>
        <View style={styles.item}>
          <Text style={styles.label}>Area</Text>
          <Text style={styles.value}>
            {property.areaSqft !== undefined && property.areaSqft !== null
              ? `${property.areaSqft.toLocaleString()} sqft`
              : "—"}
          </Text>
        </View>
        <View style={styles.item}>
          <Text style={styles.label}>Year Built</Text>
          <Text style={styles.value}>
            {property.yearBuilt !== undefined && property.yearBuilt !== null
              ? property.yearBuilt
              : "—"}
          </Text>
        </View>
      </View>
      <View style={styles.row}>
        <View style={styles.item}>
          <Text style={styles.label}>Lot Size</Text>
          <Text style={styles.value}>
            {property.lotSizeSqft !== undefined && property.lotSizeSqft !== null
              ? `${property.lotSizeSqft.toLocaleString()} sqft`
              : "—"}
          </Text>
        </View>
        <View style={styles.item}>
          <Text style={styles.label}>Type</Text>
          <Text style={styles.value}>
            {property.propertyType ? property.propertyType : "—"}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  gridContainer: {
    marginTop: 16,
    marginBottom: 16,
    backgroundColor: "#fcfdf5ff",
    borderRadius: 8,
    padding: 16,
    elevation: 1,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  item: {
    flex: 1,
    alignItems: "flex-start",
  },
  label: {
    fontSize: 13,
    color: "#888",
    marginBottom: 2,
  },
  value: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
  },
});


