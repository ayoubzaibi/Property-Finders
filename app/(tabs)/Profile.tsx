import UserHeader from "@/components/UserHeader";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Colors from "../../constants/Colors";
import { useNetworkStatus } from "../../hooks/useNetworkStatus";
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
  const isOnline = useNetworkStatus(); // Show online/offline status
  return (
    <LinearGradient
      colors={[Colors.background, Colors.card]}
      style={styles.gradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      {/* Show network status */}
      <View style={{ alignItems: "center", marginTop: 10 }}>
        <Text
          style={{
            color: isOnline ? Colors.accent : "red",
            fontWeight: "bold",
          }}
        >
          {isOnline ? "You are online" : "You are offline"}
        </Text>
      </View>
      <UserHeader title="Profile" subtitle="Your account info" />
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
  gradient: { flex: 1, alignItems: "center" },
  card: {
    width: "90%",
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    marginTop: 40, // extra space for header
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
});
