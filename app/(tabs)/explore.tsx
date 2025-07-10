import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function ExploreScreen() {
  // Replace with your own logic or mock user data if needed
  const [user] = useState(null);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Explore</Text>
      <Text style={styles.text}>
        User: {user && typeof user === 'object' && (user as { email?: string }).email ? (user as { email: string }).email : 'No user'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  title: { fontSize: 28, fontWeight: '700', marginBottom: 30 },
  text: { fontSize: 16, color: '#666' },
});
