import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Colors from "../../constants/Colors";

export default function WelcomeScreen() {
  const navigation = useNavigation();

  return (
    <LinearGradient
      colors={[Colors.background, Colors.card]}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.overlay}>
            <View style={styles.content}>
              <View style={styles.headerSection}>
                <View style={styles.logoContainer}>
                  <Text style={styles.logoIcon}>🏠</Text>
                </View>
                <Text style={styles.title}>Property Finder</Text>
                <Text style={styles.subtitle}>
                  Discover your dream home with ease. Browse thousands of
                  properties, save your favorites, and find the perfect place to
                  call home.
                </Text>
              </View>
              <View style={styles.buttonsSection}>
                <TouchableOpacity
                  style={[styles.button, styles.loginButton]}
                  onPress={() => navigation.navigate("Login" as never)}
                >
                  <Text style={styles.loginButtonText}>Sign In</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.registerButton]}
                  onPress={() => navigation.navigate("Register" as never)}
                >
                  <Text style={styles.registerButtonText}>Create Account</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.footer}>
                <Text style={styles.footerText}>
                  By continuing, you agree to our Terms of Service and Privacy
                  Policy
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  scrollView: { flex: 1 },
  scrollContent: { flexGrow: 1, justifyContent: "center" },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.25)",
    justifyContent: "center",
  },
  content: {
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: 30,
    paddingTop: 40,
    paddingBottom: 30,
    minHeight: 600,
  },
  headerSection: {
    alignItems: "center",
    marginBottom: 40,
    flex: 1,
    justifyContent: "center",
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.card,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
  },
  logoIcon: { fontSize: 50 },
  title: {
    fontSize: 36,
    fontWeight: "700",
    color: Colors.accent,
    marginBottom: 20,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textMuted,
    textAlign: "center",
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  featuresSection: {
    alignItems: "center",
    marginBottom: 40,
    flex: 0.8,
    justifyContent: "center",
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    backgroundColor: Colors.card,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    minWidth: 200,
    maxWidth: 320,
  },
  featureIcon: { fontSize: 24, marginRight: 15 },
  featureText: { color: Colors.text, fontSize: 16, fontWeight: "600", flex: 1 },
  buttonsSection: { marginBottom: 30, flex: 0.6, justifyContent: "flex-end" },
  button: {
    height: 55,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  loginButton: { backgroundColor: Colors.accent },
  loginButtonText: {
    color: Colors.background,
    fontSize: 18,
    fontWeight: "700",
  },
  registerButton: { backgroundColor: Colors.accent2 },
  registerButtonText: {
    color: Colors.background,
    fontSize: 18,
    fontWeight: "700",
  },
  footer: { alignItems: "center", flex: 0.3, justifyContent: "flex-end" },
  footerText: {
    color: Colors.textMuted,
    fontSize: 12,
    textAlign: "center",
    lineHeight: 16,
    paddingHorizontal: 20,
  },
});
