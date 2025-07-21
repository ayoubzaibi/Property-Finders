import { Ionicons } from '@expo/vector-icons';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const propertyTypes = [
  { label: 'All', value: '', icon: 'home-outline' },
  { label: 'House', value: 'house', icon: 'home' },
  { label: 'Apartment', value: 'apartment', icon: 'business-outline' },
  { label: 'Condo', value: 'condo', icon: 'business' },
];
const priceRanges = [
  { label: 'Any Price', value: '' },
  { label: 'Under $300k', value: '0-300000', icon: 'pricetag-outline' },
  { label: '$300k-$500k', value: '300000-500000', icon: 'pricetag-outline' },
  { label: '$500k-$750k', value: '500000-750000', icon: 'pricetag-outline' },
  { label: 'Over $750k', value: '750000-999999999', icon: 'pricetag-outline' },
];

export default function QuickFilters({ quickFilters, setQuickFilters, onClear, onClose }: {
  quickFilters: { propertyType: string; priceRange: string };
  setQuickFilters: (v: any) => void;
  onClear: () => void;
  onClose?: () => void;
}) {
  return (
    <View style={styles.container}>
      {onClose && (
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Ionicons name="close" size={22} color="#FFD700" />
        </TouchableOpacity>
      )}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Property Type</Text>
          <View style={styles.chips}>
            {propertyTypes.map(type => (
              <TouchableOpacity
                key={type.value}
                style={[styles.chip, quickFilters.propertyType === type.value && styles.chipActive]}
                onPress={() => setQuickFilters((prev: any) => ({ ...prev, propertyType: type.value }))}
                activeOpacity={0.85}
              >
                <Ionicons name={type.icon as any} size={16} color={quickFilters.propertyType === type.value ? '#FFD700' : '#7FDBFF'} style={styles.chipIcon} />
                <Text style={[styles.chipText, quickFilters.propertyType === type.value && styles.chipTextActive]}>{type.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Price Range</Text>
          <View style={styles.chips}>
            {priceRanges.map(range => (
              <TouchableOpacity
                key={range.value}
                style={[styles.chip, quickFilters.priceRange === range.value && styles.chipActive]}
                onPress={() => setQuickFilters((prev: any) => ({ ...prev, priceRange: range.value }))}
                activeOpacity={0.85}
              >
                {range.icon && <Ionicons name={range.icon as any} size={16} color={quickFilters.priceRange === range.value ? '#FFD700' : '#7FDBFF'} style={styles.chipIcon} />}
                <Text style={[styles.chipText, quickFilters.priceRange === range.value && styles.chipTextActive]}>{range.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <TouchableOpacity style={styles.clearButton} onPress={onClear} activeOpacity={0.85}>
          <Ionicons name="refresh" size={16} color="#FFD700" style={{ marginRight: 4 }} />
          <Text style={styles.clearText}>Clear</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'linear-gradient(90deg, #181A20 0%, #23243a 100%)',
    paddingVertical: 16,
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 16,
    borderRadius: 16,
    position: 'relative',
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  closeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 10,
    backgroundColor: '#23243a',
    borderRadius: 16,
    padding: 2,
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  scrollContent: {
    alignItems: 'center',
    paddingRight: 24,
  },
  section: {
    marginRight: 28,
    minWidth: 180,
  },
  sectionTitle: {
    color: '#FFD700',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 10,
    marginLeft: 8,
    letterSpacing: 1,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#23243a',
    borderRadius: 24,
    paddingHorizontal: 18,
    paddingVertical: 8,
    marginRight: 10,
    marginBottom: 8,
    borderWidth: 1.5,
    borderColor: '#23243a',
    shadowColor: '#000',
    shadowOpacity: 0.10,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  chipActive: {
    backgroundColor: '#181A20',
    borderColor: '#FFD700',
    shadowOpacity: 0.25,
  },
  chipText: {
    color: '#7FDBFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
    letterSpacing: 0.5,
  },
  chipTextActive: {
    color: '#FFD700',
  },
  chipIcon: {
    marginRight: 2,
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#23243a',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1.5,
    borderColor: '#FFD700',
    marginLeft: 10,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  clearText: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: '700',
    marginLeft: 2,
    letterSpacing: 0.5,
  },
}); 