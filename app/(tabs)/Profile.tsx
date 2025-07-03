import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { auth } from '../config/firebase';
import { signOut } from 'firebase/auth';

export default function ProfileScreen() {
  const user = auth.currentUser;

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Yes',
        style: 'destructive',
        onPress: async () => {
          try {
            await signOut(auth);
          } catch (e) {
            console.error(e);
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