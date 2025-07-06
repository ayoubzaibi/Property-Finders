import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { signInWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Dimensions, Keyboard, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { useAuth } from '../../services/authContext';
import { auth } from '../config/firebase';

const { width, height } = Dimensions.get('window');

export default function Login() {
    const navigation = useNavigation();
    const { setUser } = useAuth();
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
            console.log('=== LOGIN PROCESS START ===');
            console.log('Attempting login with:', email.trim());
            const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
            console.log('Login successful:', userCredential.user.email);
            
            console.log('Setting user in auth context...');
            setUser(userCredential.user);
            console.log('User set in auth context, should trigger navigation');
            
            Alert.alert('Success', 'Login successful!', [
                {
                    text: 'OK',
                    onPress: () => {
                        console.log('=== LOGIN PROCESS END ===');
                        console.log('Login completed, navigation should be triggered');
                        console.log('Current auth state:', auth.currentUser?.email);
                    }
                }
            ]);
            
        } catch (e: any) {
            console.error('Login error:', e.code, e.message);
            let errorMessage = 'Login failed.';
            
            if (e.code === 'auth/user-not-found') {
                errorMessage = 'No account found with this email.';
            } else if (e.code === 'auth/wrong-password') {
                errorMessage = 'Incorrect password.';
            } else if (e.code === 'auth/invalid-email') {
                errorMessage = 'Invalid email address.';
            } else if (e.code === 'auth/too-many-requests') {
                errorMessage = 'Too many failed attempts. Please try again later.';
            } else if (e.code === 'auth/network-request-failed') {
                errorMessage = 'Network error. Please check your connection.';
            } else {
                errorMessage = e.message || 'Login failed. Please try again.';
            }
            
            setError(errorMessage);
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
                <LinearGradient
                    colors={['#667eea', '#764ba2']}
                    style={styles.container}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                >
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
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Enter your email"
                                        placeholderTextColor="#999"
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
                                        placeholder="Enter your password"
                                        placeholderTextColor="#999"
                                        secureTextEntry
                                        value={password}
                                        onChangeText={setPassword}
                                    />
                                </View>

                                <TouchableOpacity
                                    style={[styles.loginButton, loading && styles.loginButtonDisabled]}
                                    onPress={handleLogin}
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <ActivityIndicator color="#fff" size="small" />
                                    ) : (
                                        <Text style={styles.loginButtonText}>Sign In</Text>
                                    )}
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
        backgroundColor: 'rgba(0,0,0,0.1)',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 30,
        paddingTop: 50,
        paddingBottom: 30,
    },
    headerSection: {
        alignItems: 'center',
        marginBottom: 50,
    },
    logoContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    logoIcon: {
        fontSize: 40,
    },
    title: {
        fontSize: 32,
        fontWeight: '700',
        color: '#fff',
        marginBottom: 10,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.8)',
        textAlign: 'center',
        lineHeight: 22,
    },
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 30,
        width: '100%',
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.3)',
    },
    dividerText: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 14,
        marginHorizontal: 15,
    },
    formSection: {
        marginBottom: 40,
    },
    errorContainer: {
        backgroundColor: 'rgba(231, 76, 60, 0.1)',
        borderWidth: 1,
        borderColor: 'rgba(231, 76, 60, 0.3)',
        borderRadius: 8,
        padding: 12,
        marginBottom: 20,
    },
    errorText: {
        color: '#e74c3c',
        fontSize: 14,
        textAlign: 'center',
    },
    inputContainer: {
        marginBottom: 20,
    },
    inputLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
        marginBottom: 8,
    },
    input: {
        height: 55,
        backgroundColor: 'rgba(255,255,255,0.95)',
        borderRadius: 12,
        paddingHorizontal: 20,
        fontSize: 16,
        color: '#333',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)',
    },
    loginButton: {
        backgroundColor: '#fff',
        height: 55,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    loginButtonDisabled: {
        opacity: 0.7,
    },
    loginButtonText: {
        color: '#667eea',
        fontSize: 18,
        fontWeight: '700',
    },
    forgotPassword: {
        alignItems: 'center',
        marginTop: 20,
    },
    forgotPasswordText: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 14,
        textDecorationLine: 'underline',
    },
    footerSection: {
        alignItems: 'center',
    },
    signupContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    signupText: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 16,
    },
    signupLink: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
        textDecorationLine: 'underline',
    },
});
