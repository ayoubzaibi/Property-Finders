import { StyleSheet, Text, View } from "react-native";

interface DescriptionSectionProps {
  description?: string;
}

export default function DescriptionSection({
  description,
}: DescriptionSectionProps) {
  if (!description) return null;
  return (
    <View style={styles.descriptionSection}>
      <Text style={styles.sectionTitle}>Description</Text>
      <Text style={styles.description}>{description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  descriptionSection: { marginTop: 16 },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#a2cbe8ff",
    marginBottom: 8,
  },
  description: { fontSize: 14, color: "#fff", lineHeight: 20 },
});
