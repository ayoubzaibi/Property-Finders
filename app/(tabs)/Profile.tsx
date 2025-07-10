import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSession } from '../context';

export default function ProfileScreen() {
  const { user, signOut } = useSession();
  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Yes',
        style: 'destructive',
        onPress: () => {
          signOut?.();
        },
      },
    ]);
  };

  return (
    <LinearGradient
      colors={["#667eea", "#764ba2"]}
      style={styles.gradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>Profile</Text>
          <Text style={styles.headerSubtitle}>Your account info</Text>
        </View>
        <Ionicons name="person-circle" size={36} color="#fff" style={styles.headerAvatar} />
      </View>
      <View style={styles.card}>
        <View style={styles.avatarContainer}>
          <Ionicons name="person-circle" size={80} color="#764ba2" />
        </View>
        <Text style={styles.title}>My Profile</Text>
        <View style={styles.info}>
          <Text style={styles.label}>Session</Text>
          <Text style={styles.text}>{user?.email || 'No session'}</Text>
        </View>
        <TouchableOpacity style={styles.button} onPress={handleSignOut}>
          <Text style={styles.buttonText}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 30,
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#764ba2',
    shadowOpacity: 0.13,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
  },
  avatarContainer: {
    marginBottom: 20,
  },
  title: { fontSize: 28, fontWeight: '700', marginBottom: 30, color: '#764ba2' },
  info: { marginBottom: 20, alignItems: 'center' },
  label: { fontSize: 16, fontWeight: '600', color: '#444' },
  text: { fontSize: 16, color: '#666', marginTop: 5 },
  button: {
    marginTop: 20,
    backgroundColor: '#ff8c00',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 28,
    paddingBottom: 12,
    paddingHorizontal: 18,
    backgroundColor: 'transparent',
  },
  headerLeft: {
    flex: 1,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 2,
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 13,
    fontWeight: '500',
  },
  headerAvatar: {
    marginLeft: 16,
    fontSize: 36,
  },
});