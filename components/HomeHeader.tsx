import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function HomeHeader({
  onFilterPress,
}: {
  onFilterPress: () => void;
}) {
  return (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <Text style={styles.headerTitle}>Discover Properties</Text>
        <Text style={styles.headerSubtitle}>Find your dream home today</Text>
      </View>
      <TouchableOpacity style={styles.filterButton} onPress={onFilterPress}>
        <Ionicons name="options" size={24} color="#fff" />
      </TouchableOpacity>
      <Ionicons
        name="person-circle"
        size={36}
        color="#fff"
        style={styles.headerAvatar}
        onPress={() => router.push("/(tabs)/Profile")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 20,
    paddingBottom: 16,
    paddingHorizontal: 16,
    backgroundColor: "transparent",
    marginTop: 20,
  },
  headerLeft: { flex: 1 },
  headerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 2,
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 12,
    fontWeight: "500",
  },
  filterButton: { marginRight: 10, padding: 4 },
  headerAvatar: { marginLeft: 12, fontSize: 32 },
});
