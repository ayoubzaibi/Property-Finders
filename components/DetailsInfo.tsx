import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

export default function DetailsInfo({ property }: { property: any }) {
  return (
    <View style={styles.infoContainer}>
      <Text style={styles.price}>${property.price.toLocaleString()}</Text>
      <Text style={styles.title}>{property.title || 'Beautiful Property'}</Text>
      <View style={styles.addressRow}>
        <Ionicons name="location-outline" size={16} color="#764ba2" />
        <Text style={styles.address}>{property.address}</Text>
      </View>
      <View style={styles.detailsSection}>
        <Text style={styles.sectionTitle}>Property Details</Text>
        <View style={styles.detailsGrid}>
          {property.bedrooms && (
            <View style={styles.detailItem}>
              <Ionicons name="bed-outline" size={20} color="#764ba2" />
              <Text style={styles.detailText}>{property.bedrooms} Bedrooms</Text>
            </View>
          )}
          {property.bathrooms && (
            <View style={styles.detailItem}>
              <Ionicons name="water-outline" size={20} color="#764ba2" />
              <Text style={styles.detailText}>{property.bathrooms} Bathrooms</Text>
            </View>
          )}
          {property.squareFootage && (
            <View style={styles.detailItem}>
              <Ionicons name="resize-outline" size={20} color="#764ba2" />
              <Text style={styles.detailText}>{property.squareFootage.toLocaleString()} sq ft</Text>
            </View>
          )}
          {property.propertyType && (
            <View style={styles.detailItem}>
              <Ionicons name="home-outline" size={20} color="#764ba2" />
              <Text style={styles.detailText}>{property.propertyType}</Text>
            </View>
          )}
        </View>
      </View>
      {property.description && (
        <View style={styles.descriptionSection}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{property.description}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  infoContainer: { padding: 16 },
  price: { fontSize: 20, fontWeight: '700', color: '#764ba2', marginBottom: 6 },
  title: { fontSize: 18, fontWeight: 'bold', color: '#222', marginBottom: 4 },
  addressRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  address: { fontSize: 14, color: '#444', fontWeight: '500' },
  detailsSection: { marginTop: 12 },
  sectionTitle: { fontSize: 15, fontWeight: '600', color: '#764ba2', marginBottom: 8 },
  detailsGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  detailItem: { flexDirection: 'row', alignItems: 'center', marginRight: 16, marginBottom: 8 },
  detailText: { fontSize: 14, color: '#666', marginLeft: 6 },
  descriptionSection: { marginTop: 16 },
  description: { fontSize: 14, color: '#666', lineHeight: 20 },
}); 