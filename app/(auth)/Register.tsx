import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Dimensions, Keyboard, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { auth } from '../config/firebase';

const { width, height } = Dimensions.get('window');

export default function Register() {
    const navigation = useNavigation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleRegister = async () => {
        setError(null);
        
        // Validation
        if (!email || !password || !confirmPassword || !displayName) {
            setError('Please fill in all fields.');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters.');
            return;
        }

        setLoading(true);
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
            
            // Update profile with display name
            await updateProfile(userCredential.user, {
                displayName: displayName.trim()
            });

            Alert.alert('Success', 'Account created successfully!', [
                { text: 'OK', onPress: () => navigation.navigate('HomeTabs' as never) }
            ]);
        } catch (e: any) {
            let errorMessage = 'Registration failed.';
            
            if (e.code === 'auth/email-already-in-use') {
                errorMessage = 'Email is already registered.';
            } else if (e.code === 'auth/invalid-email') {
                errorMessage = 'Invalid email address.';
            } else if (e.code === 'auth/weak-password') {
                errorMessage = 'Password is too weak.';
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
                            {/* Header Section */}
                            <View style={styles.headerSection}>
                                <View style={styles.logoContainer}>
                                    <Text style={styles.logoIcon}>🏠</Text>
                                </View>
                                <Text style={styles.title}>Create Account</Text>
                                <Text style={styles.subtitle}>Join Property Finder and start your journey</Text>
                            </View>

                            {/* Form Section */}
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
                                        placeholderTextColor="#999"
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
                                        placeholder="Create a password"
                                        placeholderTextColor="#999"
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
                                        placeholderTextColor="#999"
                                        secureTextEntry
                                        value={confirmPassword}
                                        onChangeText={setConfirmPassword}
                                    />
                                </View>

                                <TouchableOpacity
                                    style={[styles.registerButton, loading && styles.registerButtonDisabled]}
                                    onPress={handleRegister}
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <ActivityIndicator color="#fff" size="small" />
                                    ) : (
                                        <Text style={styles.registerButtonText}>Create Account</Text>
                                    )}
                                </TouchableOpacity>
                            </View>

                            {/* Footer Section */}
                            <View style={styles.footerSection}>
                                <View style={styles.divider}>
                                    <View style={styles.dividerLine} />
                                    <Text style={styles.dividerText}>or</Text>
                                    <View style={styles.dividerLine} />
                                </View>

                                <View style={styles.loginContainer}>
                                    <Text style={styles.loginText}>Already have an account? </Text>
                                    <TouchableOpacity onPress={() => navigation.navigate('Login' as never)}>
                                        <Text style={styles.loginLink}>Sign In</Text>
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
        marginBottom: 40,
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
    formSection: {
        marginBottom: 30,
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
        marginBottom: 15,
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
    registerButton: {
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
    registerButtonDisabled: {
        opacity: 0.7,
    },
    registerButtonText: {
        color: '#667eea',
        fontSize: 18,
        fontWeight: '700',
    },
    footerSection: {
        alignItems: 'center',
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
    loginContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    loginText: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 16,
    },
    loginLink: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
        textDecorationLine: 'underline',
    },
}); 