import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import Colors from "../constants/Colors";

interface UserHeaderProps {
  title: string;
  subtitle: string;
}

export default function UserHeader({ title, subtitle }: UserHeaderProps) {
  return (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <Text style={styles.headerTitle}>{title}</Text>
        <Text style={styles.headerSubtitle}>{subtitle}</Text>
      </View>
      <Ionicons
        name="person-circle"
        size={36}
        color={Colors.accent2}
        style={styles.headerAvatar}
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
    paddingBottom: 10,
    paddingHorizontal: 16,
    backgroundColor: "transparent",
  },
  headerLeft: { flex: 1 },
  headerTitle: {
    color: Colors.accent,
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 2,
    letterSpacing: 0.5,
  },
  headerSubtitle: { color: Colors.textMuted, fontSize: 12, fontWeight: "500" },
  headerAvatar: { marginLeft: 12, fontSize: 32 },
});
