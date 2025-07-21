import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Keyboard, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import Colors from '../../constants/Colors';
import { useSession } from '../context';

export default function Login() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setLocalError] = useState<string | null>(null);
  const session = useSession();

  const handleLogin = async () => {
    setLocalError(null);
    if (!email || !password) {
      setLocalError('Please fill in both fields.');
      return;
    }
    setLoading(true);
    try {
      if (session && typeof session.signIn === 'function') {
        await session.signIn(email, password);
        router.replace('/Home');
      }
    } catch (e) {
      setLocalError((e as any)?.message as string || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'android' ? 'padding' : 'height'} keyboardVerticalOffset={0}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <LinearGradient colors={[Colors.background, Colors.card]} style={styles.container} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
          <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
            <View style={styles.overlay}>
              <View style={styles.content}>
                <View style={styles.headerSection}>
                  <View style={styles.logoContainer}>
                    <Text style={styles.logoIcon}>🏠</Text>
                  </View>
                  <Text style={styles.title}>Welcome Back</Text>
                  <Text style={styles.subtitle}>Sign in to continue your property search</Text>
                </View>
                <View style={styles.formSection}>
                  {error ? (
                    <View style={styles.errorContainer}>
                      <Text style={styles.errorText}>{error}</Text>
                    </View>
                  ) : null}
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Email Address</Text>
                    <TextInput style={styles.input} placeholder="Enter your email" placeholderTextColor={Colors.textMuted} keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail} />
                  </View>
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Password</Text>
                    <TextInput style={styles.input} placeholder="Enter your password" placeholderTextColor={Colors.textMuted} secureTextEntry value={password} onChangeText={setPassword} />
                  </View>
                  <TouchableOpacity style={[styles.loginButton, loading && styles.loginButtonDisabled]} onPress={handleLogin} disabled={loading}>
                    {loading ? <ActivityIndicator color={Colors.accent} size="small" /> : <Text style={styles.loginButtonText}>Sign In</Text>}
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.forgotPassword}>
                    <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.footerSection}>
                  <View style={styles.divider}>
                    <View style={styles.dividerLine} />
                    <Text style={styles.dividerText}>or</Text>
                    <View style={styles.dividerLine} />
                  </View>
                  <View style={styles.signupContainer}>
                    <Text style={styles.signupText}>Don&apos;t have an account? </Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Register' as never)}>
                      <Text style={styles.signupLink}>Sign Up</Text>
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
  container: { flex: 1 },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.18)' },
  content: { flex: 1, justifyContent: 'center', paddingHorizontal: '8%', paddingTop: 50, paddingBottom: 30 },
  headerSection: { alignItems: 'center', marginBottom: 50 },
  logoContainer: { width: 80, height: 80, borderRadius: 40, backgroundColor: Colors.card, justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  logoIcon: { fontSize: 40 },
  title: { fontSize: 32, fontWeight: '700', color: Colors.accent, marginBottom: 10 },
  subtitle: { fontSize: 16, color: Colors.textMuted, textAlign: 'center', marginBottom: 20 },
  formSection: { marginBottom: 30 },
  inputContainer: { marginBottom: 15 },
  inputLabel: { color: Colors.text, marginBottom: 5, fontWeight: '600' },
  input: { backgroundColor: Colors.card, borderRadius: 8, padding: 12, color: Colors.text },
  loginButton: { backgroundColor: Colors.accent, borderRadius: 8, paddingVertical: 12, alignItems: 'center', marginTop: 10 },
  loginButtonDisabled: { opacity: 0.6 },
  loginButtonText: { color: Colors.background, fontWeight: '700', fontSize: 16 },
  forgotPassword: { marginTop: 10, alignSelf: 'flex-end' },
  forgotPasswordText: { color: Colors.accent2, fontSize: 14 },
  errorContainer: { backgroundColor: 'rgba(255,0,0,0.1)', borderRadius: 8, padding: 10, marginBottom: 10 },
  errorText: { color: Colors.text, fontWeight: '600' },
  footerSection: { marginTop: 20, alignItems: 'center' },
  divider: { flexDirection: 'row', alignItems: 'center', marginVertical: 10 },
  dividerLine: { flex: 1, height: 1, backgroundColor: Colors.card },
  dividerText: { color: Colors.textMuted, marginHorizontal: 10 },
  signupContainer: { flexDirection: 'row', alignItems: 'center' },
  signupText: { color: Colors.textMuted },
  signupLink: { color: Colors.accent2, fontWeight: '700', textDecorationLine: 'underline' },
});
