import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Colors from '../constants/Colors';

export default function PropertyListItem({ property, isFavorite, loading, onFavorite }: {
  property: any;
  isFavorite: boolean;
  loading: boolean;
  onFavorite: () => void;
}) {
  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.9}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: property.photos[0] || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400' }} style={styles.image} resizeMode="cover" />
        <TouchableOpacity style={[styles.favoriteIcon, loading && styles.favoriteIconLoading]} onPress={e => { e.stopPropagation(); onFavorite(); }} disabled={loading} activeOpacity={0.7}>
          {loading ? <ActivityIndicator size="small" color={Colors.accent} /> : <Ionicons name={isFavorite ? 'heart' : 'heart-outline'} size={24} color={isFavorite ? Colors.accent : Colors.text} />}
        </TouchableOpacity>
      </View>
      <View style={styles.info}>
        <Text style={styles.price}>${property.price.toLocaleString()}</Text>
        <View style={styles.addressRow}>
          <Ionicons name="location-outline" size={16} color={Colors.accent2} />
          <Text style={styles.address}>{property.address}</Text>
        </View>
        {property.bedrooms && property.bathrooms && (
          <View style={styles.detailsRow}>
            <Text style={styles.detailsText}>{property.bedrooms} bed  {property.bathrooms} bath</Text>
            {property.squareFootage && <Text style={styles.detailsText}>  {property.squareFootage.toLocaleString()} sq ft</Text>}
          </View>
        )}
        <TouchableOpacity style={styles.detailsButton}>
          <Text style={styles.detailsButtonText}>View Details</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { width: '100%', borderRadius: 16, overflow: 'hidden', backgroundColor: Colors.card, marginBottom: 20, elevation: 6, shadowColor: Colors.background, shadowOpacity: 0.13, shadowRadius: 12, shadowOffset: { width: 0, height: 6 } },
  imageContainer: { width: '100%', height: 140, position: 'relative' },
  image: { width: '100%', height: '100%' },
  favoriteIcon: { position: 'absolute', top: 12, right: 12, backgroundColor: Colors.background, borderRadius: 20, padding: 8, zIndex: 10, elevation: 5, shadowColor: Colors.background, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4, minWidth: 36, minHeight: 36, justifyContent: 'center', alignItems: 'center' },
  favoriteIconLoading: { backgroundColor: Colors.card, opacity: 0.8 },
  info: { padding: 16, paddingTop: 10 },
  price: { fontSize: 20, fontWeight: '700', color: Colors.accent, marginBottom: 6 },
  addressRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  address: { fontSize: 14, color: Colors.text, fontWeight: '500' },
  detailsRow: { flexDirection: 'row', marginBottom: 12 },
  detailsText: { fontSize: 13, color: Colors.textMuted, fontWeight: '500' },
  detailsButton: { backgroundColor: Colors.accent2, borderRadius: 8, paddingVertical: 8, alignItems: 'center', marginTop: 4 },
  detailsButtonText: { color: Colors.background, fontWeight: '700', fontSize: 14, letterSpacing: 0.5 },
}); 