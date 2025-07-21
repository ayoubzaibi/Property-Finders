import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Colors from "../../constants/Colors";
import { useSession } from "../context";

export default function ProfileScreen() {
  const { user, signOut } = useSession();
  const handleSignOut = () => {
    Alert.alert("Sign Out", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Yes",
        style: "destructive",
        onPress: () => {
          signOut?.();
        },
      },
    ]);
  };

  return (
    <LinearGradient
      colors={[Colors.background, Colors.card]}
      style={styles.gradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>Profile</Text>
          <Text style={styles.headerSubtitle}>Your account info</Text>
        </View>
        <Ionicons
          name="person-circle"
          size={36}
          color={Colors.accent2}
          style={styles.headerAvatar}
        />
      </View>
      <View style={styles.card}>
        <View style={styles.avatarContainer}>
          <Ionicons name="person-circle" size={80} color={Colors.accent2} />
        </View>
        <Text style={styles.title}>My Profile</Text>
        <View style={styles.info}>
          <Text style={styles.label}>Session</Text>
          <Text style={styles.text}>{user?.email || "No session"}</Text>
        </View>
        <TouchableOpacity style={styles.button} onPress={handleSignOut}>
          <Text style={styles.buttonText}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1, justifyContent: "center", alignItems: "center" },
  card: {
    width: "90%",
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    elevation: 6,
    shadowColor: Colors.background,
    shadowOpacity: 0.13,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
  },
  avatarContainer: { marginBottom: 16 },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 24,
    color: Colors.accent,
  },
  info: { marginBottom: 16, alignItems: "center" },
  label: { fontSize: 15, fontWeight: "600", color: Colors.textMuted },
  text: { fontSize: 15, color: Colors.text, marginTop: 4 },
  button: {
    marginTop: 16,
    backgroundColor: Colors.accent,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    width: "100%",
  },
  buttonText: { color: Colors.background, fontSize: 15, fontWeight: "700" },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
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
