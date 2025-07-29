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
    color: "#764ba2",
    marginBottom: 8,
  },
  description: { fontSize: 14, color: "#666", lineHeight: 20 },
});
