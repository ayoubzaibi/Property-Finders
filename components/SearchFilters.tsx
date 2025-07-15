import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const filterFields = [
  { label: 'Min Price', key: 'minPrice', placeholder: '$0' },
  { label: 'Max Price', key: 'maxPrice', placeholder: '$1,000,000' },
  { label: 'Bedrooms', key: 'bedrooms', placeholder: 'Any' },
  { label: 'Bathrooms', key: 'bathrooms', placeholder: 'Any' },
  { label: 'Sq. Footage', key: 'squareFootage', placeholder: 'Any' },
  { label: 'Year Built', key: 'yearBuilt', placeholder: 'Any' },
];

export default function SearchFilters({ filters, setFilters, onClear }: {
  filters: any;
  setFilters: (v: any) => void;
  onClear: () => void;
}) {
  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {filterFields.map(f => (
          <View key={f.key} style={styles.field}>
            <Text style={styles.label}>{f.label}</Text>
            <TextInput
              style={styles.input}
              placeholder={f.placeholder}
              placeholderTextColor="#ccc"
              value={filters[f.key]}
              onChangeText={v => setFilters((prev: any) => ({ ...prev, [f.key]: v }))}
              keyboardType={f.key.includes('Price') || f.key === 'squareFootage' || f.key === 'yearBuilt' ? 'numeric' : 'default'}
            />
          </View>
        ))}
        <TouchableOpacity style={styles.clearButton} onPress={onClear}>
          <Text style={styles.clearText}>Clear</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: 'rgba(255,255,255,0.1)', paddingVertical: 12, marginHorizontal: 16, marginTop: 8, marginBottom: 12, borderRadius: 12 },
  field: { marginRight: 20, minWidth: 120 },
  label: { color: '#fff', fontSize: 14, fontWeight: '600', marginBottom: 8 },
  input: { backgroundColor: 'rgba(255,255,255,0.15)', color: '#fff', borderRadius: 8, padding: 8, fontSize: 14 },
  clearButton: { backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 16, paddingVertical: 6, borderRadius: 16, alignSelf: 'center', marginLeft: 10 },
  clearText: { color: '#fff', fontSize: 12, fontWeight: '500' },
}); 