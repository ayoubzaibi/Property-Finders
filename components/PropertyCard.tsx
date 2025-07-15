import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { ActivityIndicator,TouchableOpacity,Text, View, StyleSheet } from "react-native";


export default function PropertyCard() {
  return (
    <LinearGradient
    colors={["#667eea", "#764ba2"]}
    style={styles.gradient}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
  >
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <Text style={styles.headerTitle}>Discover Properties</Text>
        <Text style={styles.headerSubtitle}>Find your dream home today</Text>
      </View>
      <TouchableOpacity  style={styles.testButton}>
        <Ionicons name="bug-outline" size={24} color="#fff" />
      </TouchableOpacity>
      <Ionicons name="person-circle" size={36} color="#fff" style={styles.headerAvatar} />
    </View>
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#fff" />
      <Text style={styles.loadingText}>Loading properties...</Text>
    </View>
  </LinearGradient>
  );
}
const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  headerLeft: {
    flex: 1,
  },
  headerTitle: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    color: '#fff',
    fontSize: 12,
    marginTop: 4,
  },
  testButton: {
    marginRight: 16,
  },
  headerAvatar: {
    marginLeft: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
    marginTop: 16,
  },
});