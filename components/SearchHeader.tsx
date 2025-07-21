import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

export default function SearchHeader({ value, onChange, onSearch, onFilterPress }: {
  value: string;
  onChange: (v: string) => void;
  onSearch: () => void;
  onFilterPress: () => void;
}) {
  return (
    <View style={styles.header}>
      <TextInput
        style={styles.input}
        placeholder="Search properties..."
        placeholderTextColor="#ccc"
        value={value}
        onChangeText={onChange}
        onSubmitEditing={onSearch}
        returnKeyType="search"
      />
      <TouchableOpacity style={styles.filterButton} onPress={onFilterPress}> 
        <Ionicons name="options" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: 'transparent',marginTop:30 },
  input: { flex: 1, backgroundColor: 'rgba(255,255,255,0.15)', color: '#fff', borderRadius: 8, padding: 10, fontSize: 16, marginRight: 10,paddingBottom:10 },
  filterButton: { padding: 4 },
  
}); 