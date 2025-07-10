import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function DetailsScreen() {
  // Replace with your own logic or mock favorites data if needed
  const [favorites] = useState([]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Details</Text>
      <Text style={styles.text}>Favorites count: {favorites.length}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  title: { fontSize: 28, fontWeight: '700', marginBottom: 30 },
  text: { fontSize: 16, color: '#666' },
});