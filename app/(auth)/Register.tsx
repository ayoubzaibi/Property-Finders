import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { updateProfile } from "firebase/auth";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import Colors from "../../constants/Colors";
import { signUp } from "../../services/authService";

export default function Register() {
  const navigation = useNavigation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async () => {
    setError(null);

    if (!email || !password || !confirmPassword || !displayName) {
      setError("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      console.log("Attempting registration with:", email.trim());
      const result = await signUp(email.trim(), password);
      if (result.success && result.user) {
        await updateProfile(result.user, { displayName: displayName.trim() });
        console.log("Registration successful:", result.user.email);

        console.log("Setting user in auth context...");

        Alert.alert("Success", "Account created successfully!", [
          {
            text: "OK",
            onPress: () => {
              console.log(
                "Registration completed, navigation should be triggered"
              );
            },
          },
        ]);
      } else {
        setError(result.error?.message || "Registration failed.");
      }
    } catch (e: any) {
      console.error("Registration error:", e.code, e.message);
      let errorMessage = "Registration failed.";

      if (e.code === "auth/email-already-in-use") {
        errorMessage = "Email is already registered.";
      } else if (e.code === "auth/invalid-email") {
        errorMessage = "Invalid email address.";
      } else if (e.code === "auth/weak-password") {
        errorMessage = "Password is too weak.";
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <LinearGradient
          colors={[Colors.background, Colors.card]}
          style={styles.container}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.overlay}>
              <View style={styles.content}>
                <View style={styles.headerSection}>
                  <View style={styles.logoContainer}>
                    <Text style={styles.logoIcon}>🏠</Text>
                  </View>
                  <Text style={styles.title}>Create Account</Text>
                  <Text style={styles.subtitle}>
                    Join Property Finder and start your journey
                  </Text>
                </View>

                <View style={styles.formSection}>
                  {error ? (
                    <View style={styles.errorContainer}>
                      <Text style={styles.errorText}>{error}</Text>
                    </View>
                  ) : null}

                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Full Name</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Enter your full name"
                      placeholderTextColor={Colors.textMuted}
                      value={displayName}
                      onChangeText={setDisplayName}
                      autoCapitalize="words"
                    />
                  </View>

                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Email Address</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Enter your email"
                      placeholderTextColor={Colors.textMuted}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      value={email}
                      onChangeText={setEmail}
                    />
                  </View>

                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Password</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Create a password"
                      placeholderTextColor={Colors.textMuted}
                      secureTextEntry
                      value={password}
                      onChangeText={setPassword}
                    />
                  </View>

                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Confirm Password</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Confirm your password"
                      placeholderTextColor={Colors.textMuted}
                      secureTextEntry
                      value={confirmPassword}
                      onChangeText={setConfirmPassword}
                    />
                  </View>

                  <TouchableOpacity
                    style={[
                      styles.registerButton,
                      loading && styles.registerButtonDisabled,
                    ]}
                    onPress={handleRegister}
                    disabled={loading}
                  >
                    {loading ? (
                      <ActivityIndicator
                        color={Colors.background}
                        size="small"
                      />
                    ) : (
                      <Text style={styles.registerButtonText}>
                        Create Account
                      </Text>
                    )}
                  </TouchableOpacity>
                </View>

                <View style={styles.footerSection}>
                  <View style={styles.divider}>
                    <View style={styles.dividerLine} />
                    <Text style={styles.dividerText}>or</Text>
                    <View style={styles.dividerLine} />
                  </View>

                  <View style={styles.loginContainer}>
                    <Text style={styles.loginText}>
                      Already have an account?{" "}
                    </Text>
                    <TouchableOpacity
                      onPress={() => navigation.navigate("Login" as never)}
                    >
                      <Text style={styles.loginLink}>Sign In</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </ScrollView>
        </LinearGradient>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.18)",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: "8%",
    paddingTop: 50,
    paddingBottom: 30,
  },
  headerSection: {
    alignItems: "center",
    marginBottom: 40,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.card,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  logoIcon: {
    fontSize: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: Colors.accent,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textMuted,
    textAlign: "center",
    marginBottom: 20,
  },
  formSection: {
    marginBottom: 30,
  },
  inputContainer: {
    marginBottom: 15,
  },
  inputLabel: {
    color: Colors.text,
    marginBottom: 5,
    fontWeight: "600",
  },
  input: {
    backgroundColor: Colors.card,
    borderRadius: 8,
    padding: 12,
    color: Colors.text,
  },
  registerButton: {
    backgroundColor: Colors.accent,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 10,
  },
  registerButtonDisabled: {
    opacity: 0.6,
  },
  registerButtonText: {
    color: Colors.background,
    fontWeight: "700",
    fontSize: 16,
  },
  errorContainer: {
    backgroundColor: "rgba(255,0,0,0.1)",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  errorText: {
    color: Colors.text,
    fontWeight: "600",
  },
  footerSection: {
    marginTop: 20,
    alignItems: "center",
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "rgba(255,255,255,0.3)",
  },
  dividerText: {
    color: "#fff",
    marginHorizontal: 10,
  },
  loginContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  loginText: {
    color: "#fff",
  },
  loginLink: {
    color: "#fff",
    fontWeight: "700",
    textDecorationLine: "underline",
  },
});
