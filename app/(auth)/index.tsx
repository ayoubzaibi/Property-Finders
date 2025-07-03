
import React, { useState } from 'react';
import {
  View,
  TextInput,
  Button,
  ActivityIndicator,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { auth } from '../config/firebase';             // ← your init file
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';

export default function Index() {
  const navigation = useNavigation();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);

  const handleSignUp = async () => {
    if (!email || !password) {
      return Alert.alert('Please enter email and password');
    }
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email.trim(), password);
      Alert.alert('Welcome!', 'Account created – check your email for verification.');
    } catch (err: any) {
      Alert.alert('Registration failed', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async () => {
    if (!email || !password) {
      return Alert.alert('Please enter email and password');
    }
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      // onAuthStateChanged listener in App.tsx will auto-redirect
    } catch (err: any) {
      Alert.alert('Sign in failed', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.select({ ios: 'padding', android: undefined })}
      >
        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        {loading ? (
          <ActivityIndicator size="small" style={{ marginVertical: 20 }} />
        ) : (
          <>
            <Button title="Login" onPress={handleSignIn} />
            <View style={{ height: 10 }} />
            <Button title="Create Account" onPress={handleSignUp} />
          </>
        )}
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: 20,
  },
  input: {
    height: 50,
    marginVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
  },
});