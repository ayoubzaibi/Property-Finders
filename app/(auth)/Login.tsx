import { useNavigation } from '@react-navigation/native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react';
import { ActivityIndicator, Keyboard, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { auth } from '../config/firebase';

export default function Login() {
    const navigation = useNavigation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async () => {
        setError(null);
        if (!email || !password) {
            setError('Please fill in both fields.');
            return;
        }
        setLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email.trim(), password);
        } catch (e: any) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };


    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={0}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.container}>
                    <View style={styles.inner}>
                        <Text style={styles.header}>Property Finder</Text>
                        <Text style={styles.header}>(pour le moment)</Text>

                        {error ? <Text style={styles.errorText}>{error}</Text> : null}

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

                        <TouchableOpacity
                            style={styles.button}
                            onPress={handleLogin}
                            disabled={loading}
                        >
                            {loading
                                ? <ActivityIndicator color="#fff" />
                                : <Text style={styles.buttonText}>Log In</Text>
                            }
                        </TouchableOpacity>

                        <View style={styles.footer}>
                            <Text style={styles.footerText}>New here?</Text>
                            <TouchableOpacity onPress={() => navigation.navigate('SignUp' as never)}>
                                <Text style={[styles.footerText, styles.linkText]}> Sign Up</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'lightgray',
  },
  inner: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 30
  },
  header: {
    fontSize: 28,
    marginBottom: 40,
    textAlign: 'center',
    color: '#333'
  },
  errorText: {
    color: 'red',
    marginBottom: 20,
    textAlign: 'center'
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 20,
    borderBlockColor: '#ccc',
    backgroundColor: '#fff',
    fontSize: 16
  },
  button: {
    backgroundColor: 'lightblue',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center'
  },
  buttonText: {
    color: '#fff',
    fontSize: 16
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 25
  },
  footerText: {
    color: '#666'
  },
  linkText: {
    color: '#fff',
  }
});
