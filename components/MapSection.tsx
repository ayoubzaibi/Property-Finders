import { StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps";

interface MapSectionProps {
  coordinates?: { latitude: number; longitude: number };
  title?: string;
  address?: string;
}

export default function MapSection({
  coordinates,
  title,
  address,
}: MapSectionProps) {
  if (!coordinates || !coordinates.latitude || !coordinates.longitude)
    return null;
  return (
    <MapView
      style={styles.map}
      initialRegion={{
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }}
      pointerEvents="none"
      accessibilityLabel="Property location on map"
    >
      <Marker
        coordinate={{
          latitude: coordinates.latitude,
          longitude: coordinates.longitude,
        }}
        title={title}
        description={address}
      />
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: { width: "100%", height: 160, borderRadius: 12, marginBottom: 16 },
});
