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
  { label: 'Under $300k', value: '0-300000' },
  { label: '$300k-$500k', value: '300000-500000' },
  { label: '$500k-$750k', value: '500000-750000' },
  { label: 'Over $750k', value: '750000-999999999' },
];

export default function QuickFilters({ quickFilters, setQuickFilters, onClear }: {
  quickFilters: { propertyType: string; priceRange: string };
  setQuickFilters: (v: any) => void;
  onClear: () => void;
}) {
  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Property Type</Text>
          <View style={styles.chips}>
            {propertyTypes.map(type => (
              <TouchableOpacity
                key={type.value}
                style={[styles.chip, quickFilters.propertyType === type.value && styles.chipActive]}
                onPress={() => setQuickFilters((prev: any) => ({ ...prev, propertyType: type.value }))}
              >
                <Ionicons name={type.icon as any} size={16} color={quickFilters.propertyType === type.value ? '#fff' : '#764ba2'} />
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
              >
                <Text style={[styles.chipText, quickFilters.priceRange === range.value && styles.chipTextActive]}>{range.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <TouchableOpacity style={styles.clearButton} onPress={onClear}>
          <Text style={styles.clearText}>Clear</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: 'rgba(255,255,255,0.1)', paddingVertical: 12, marginHorizontal: 16, marginTop: 8, marginBottom: 12, borderRadius: 12 },
  section: { marginRight: 20, minWidth: 200 },
  sectionTitle: { color: '#fff', fontSize: 14, fontWeight: '600', marginBottom: 8, marginLeft: 16 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 16 },
  chip: { backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 16, paddingHorizontal: 12, paddingVertical: 6, marginRight: 8, marginBottom: 6, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: 'transparent' },
  chipActive: { backgroundColor: '#764ba2', borderColor: '#764ba2' },
  chipText: { color: '#fff', fontSize: 12, fontWeight: '500', marginLeft: 6 },
  chipTextActive: { color: '#fff' },
  clearButton: { backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 16, paddingVertical: 6, borderRadius: 16, alignSelf: 'center', marginLeft: 10 },
  clearText: { color: '#fff', fontSize: 12, fontWeight: '500' },
}); 