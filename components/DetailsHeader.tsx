import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function DetailsHeader({ onBack, isFavorite, loading, onFavorite }: {
  onBack: () => void;
  isFavorite: boolean;
  loading: boolean;
  onFavorite: () => void;
}) {
  return (
    <View style={styles.header}>
      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <Ionicons name="arrow-back" size={24} color="#fff" />
      </TouchableOpacity>
      <Text style={styles.title}>Property Details</Text>
      <TouchableOpacity style={styles.favoriteButton} onPress={onFavorite} disabled={loading}>
        <Ionicons name={isFavorite ? 'heart' : 'heart-outline'} size={24} color={isFavorite ? '#ff4757' : '#fff'} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 20, paddingBottom: 16, paddingHorizontal: 16, backgroundColor: 'transparent' },
  backButton: { padding: 4 },
  title: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  favoriteButton: { padding: 4 },
}); 