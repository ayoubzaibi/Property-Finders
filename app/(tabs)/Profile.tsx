import { signOut } from 'firebase/auth';
import React from 'react';
import {
    Alert,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useAuth } from '../../services/authContext';
import { auth } from '../config/firebase';

export default function ProfileScreen() {
  const { user, setUser } = useAuth();

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Yes',
        style: 'destructive',
        onPress: async () => {
          try {
            console.log('Signing out user:', user?.email);
            await signOut(auth);
            setUser(null);
            console.log('User signed out successfully');
          } catch (e) {
            console.error('Sign out error:', e);
            Alert.alert('Error', 'Failed to sign out. Please try again.');
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Profile</Text>
      <View style={styles.info}>
        <Text style={styles.label}>Email</Text>
        <Text style={styles.text}>{user?.email}</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.label}>Display Name</Text>
        <Text style={styles.text}>{user?.displayName || 'Not set'}</Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={handleSignOut}>
        <Text style={styles.buttonText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 30, backgroundColor: '#fff' },
  title: { fontSize: 28, fontWeight: '700', marginBottom: 30 },
  info: { marginBottom: 20 },
  label: { fontSize: 16, fontWeight: '600', color: '#444' },
  text: { fontSize: 16, color: '#666', marginTop: 5 },
  button: {
    marginTop: 'auto',
    backgroundColor: '#ff8c00',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontSize: 16 },
});