import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function WelcomeScreen() {
  const navigation = useNavigation();

  return (
    <ImageBackground
      
      style={styles.container}
      resizeMode="cover"
    >
      <View style={styles.overlay} />

      <View style={styles.content}>
        <Text style={styles.title}>Welcome to Property Finder</Text>
        <Text style={styles.subtitle}>
          Discover your next home with a tap.
        </Text>

        <TouchableOpacity
          style={[styles.button, styles.loginButton]}
          onPress={() => navigation.navigate('Login' as never)}
        >
          <Text style={styles.buttonText}>Log In</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.registerButton]}
          onPress={() => navigation.navigate('Register' as never)}
        >
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)'
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30
  },
  title: {
    fontSize: 32,
    color: '#fff',
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 10
  },
  subtitle: {
    fontSize: 16,
    color: '#eee',
    textAlign: 'center',
    marginBottom: 40
  },
  button: {
    width: '100%',
    paddingVertical: 15,
    borderRadius: 8,
    marginTop: 15,
    alignItems: 'center'
  },
  loginButton: {
    backgroundColor: '#ffffff90'
  },
  registerButton: {
    backgroundColor: '#ff8c00'
  },
  buttonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '500'
  }
});