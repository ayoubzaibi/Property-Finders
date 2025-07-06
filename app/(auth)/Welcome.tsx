import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Dimensions, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen() {
  const navigation = useNavigation();

  return (
    <LinearGradient
      colors={['#667eea', '#764ba2']}
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
                  Discover your dream home with ease. Browse thousands of properties, save your favorites, and find the perfect place to call home.
                </Text>
              </View>

              <View style={styles.featuresSection}>
                <View style={styles.featureItem}>
                  <Text style={styles.featureIcon}>🔍</Text>
                  <Text style={styles.featureText}>Advanced Search</Text>
                </View>
                <View style={styles.featureItem}>
                  <Text style={styles.featureIcon}>❤️</Text>
                  <Text style={styles.featureText}>Save Favorites</Text>
                </View>
                <View style={styles.featureItem}>
                  <Text style={styles.featureIcon}>📱</Text>
                  <Text style={styles.featureText}>Mobile First</Text>
                </View>
              </View>

              <View style={styles.buttonsSection}>
                <TouchableOpacity
                  style={[styles.button, styles.loginButton]}
                  onPress={() => navigation.navigate('Login' as never)}
                >
                  <Text style={styles.loginButtonText}>Sign In</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.button, styles.registerButton]}
                  onPress={() => navigation.navigate('Register' as never)}
                >
                  <Text style={styles.registerButtonText}>Create Account</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.footer}>
                <Text style={styles.footerText}>
                  By continuing, you agree to our Terms of Service and Privacy Policy
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
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.1)',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: Math.min(30, width * 0.08),
    paddingTop: Math.max(20, height * 0.05),
    paddingBottom: Math.max(20, height * 0.05),
    minHeight: height * 0.8,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: Math.min(60, height * 0.08),
    flex: 1,
    justifyContent: 'center',
  },
  logoContainer: {
    width: Math.min(100, width * 0.25),
    height: Math.min(100, width * 0.25),
    borderRadius: Math.min(50, width * 0.125),
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Math.min(30, height * 0.04),
  },
  logoIcon: {
    fontSize: Math.min(50, width * 0.12),
  },
  title: {
    fontSize: Math.min(36, width * 0.09),
    fontWeight: '700',
    color: '#fff',
    marginBottom: Math.min(20, height * 0.025),
    textAlign: 'center',
  },
  subtitle: {
    fontSize: Math.min(16, width * 0.04),
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    lineHeight: Math.min(24, width * 0.06),
    paddingHorizontal: Math.min(20, width * 0.05),
  },
  featuresSection: {
    alignItems: 'center',
    marginBottom: Math.min(60, height * 0.08),
    flex: 0.8,
    justifyContent: 'center',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Math.min(20, height * 0.025),
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: Math.min(20, width * 0.05),
    paddingVertical: Math.min(12, height * 0.015),
    borderRadius: 25,
    minWidth: Math.min(200, width * 0.6),
    maxWidth: width * 0.8,
  },
  featureIcon: {
    fontSize: Math.min(24, width * 0.06),
    marginRight: Math.min(15, width * 0.04),
  },
  featureText: {
    color: '#fff',
    fontSize: Math.min(16, width * 0.04),
    fontWeight: '600',
    flex: 1,
  },
  buttonsSection: {
    marginBottom: Math.min(40, height * 0.05),
    flex: 0.6,
    justifyContent: 'flex-end',
  },
  button: {
    height: Math.min(55, height * 0.07),
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Math.min(15, height * 0.02),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  loginButton: {
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
  loginButtonText: {
    color: '#667eea',
    fontSize: Math.min(18, width * 0.045),
    fontWeight: '700',
  },
  registerButton: {
    backgroundColor: '#fff',
  },
  registerButtonText: {
    color: '#667eea',
    fontSize: Math.min(18, width * 0.045),
    fontWeight: '700',
  },
  footer: {
    alignItems: 'center',
    flex: 0.3,
    justifyContent: 'flex-end',
  },
  footerText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: Math.min(12, width * 0.03),
    textAlign: 'center',
    lineHeight: Math.min(16, width * 0.04),
    paddingHorizontal: Math.min(20, width * 0.05),
  },
});