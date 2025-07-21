import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Dimensions,
  Image,
  Linking,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
// To enable the map, install react-native-maps and uncomment the next line:
import MapView, { Marker } from "react-native-maps";

const screenWidth = Dimensions.get("window").width;

export default function DetailsInfo({
  property,
  onFavorite,
  isFavorite,
}: {
  property: any;
  onFavorite: () => void;
  isFavorite: boolean;
}) {
  const [imgSrc, setImgSrc] = useState(
    property.photos && property.photos.length > 0
      ? { uri: property.photos[0] }
      : require("../assets/images/icon.png")
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);

  const handleScroll = (event: any) => {
    const index = Math.round(
      event.nativeEvent.contentOffset.x / (screenWidth - 32)
    );
    setActiveIndex(index);
  };

  const openModal = (index: number) => {
    setActiveIndex(index);
    setModalVisible(true);
  };

  const openPhone = () => {
    if (property.agentPhone) {
      Linking.openURL(`tel:${property.agentPhone.replace(/[^\d+]/g, "")}`);
    }
  };
  const openEmail = () => {
    if (property.agentEmail) {
      Linking.openURL(`mailto:${property.agentEmail}`);
    }
  };

  return (
    <View style={styles.infoContainer}>
      {/* Image Gallery */}
      {property.photos && property.photos.length > 0 ? (
        <>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            style={styles.imageGallery}
            onScroll={handleScroll}
            scrollEventThrottle={16}
          >
            {property.photos.map((uri: string, idx: number) => (
              <TouchableOpacity
                key={idx}
                activeOpacity={0.9}
                onPress={() => openModal(idx)}
              >
                <Image
                  source={{ uri }}
                  style={styles.image}
                  resizeMode="cover"
                  onError={() =>
                    setImgSrc(require("../assets/images/icon.png"))
                  }
                />
              </TouchableOpacity>
            ))}
          </ScrollView>
          <View style={styles.dotsContainer}>
            {property.photos.map((_: string, idx: number) => (
              <View
                key={idx}
                style={[styles.dot, activeIndex === idx && styles.dotActive]}
              />
            ))}
          </View>
        </>
      ) : (
        <Image
          source={require("../assets/images/icon.png")}
          style={styles.image}
          resizeMode="cover"
          accessible
          accessibilityLabel="No property image available"
        />
      )}

      {/* Full-screen Modal */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalBackground}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            contentOffset={{ x: activeIndex * screenWidth, y: 0 }}
            style={{ width: screenWidth, height: "100%" }}
            onMomentumScrollEnd={(e) => {
              const index = Math.round(
                e.nativeEvent.contentOffset.x / screenWidth
              );
              setActiveIndex(index);
            }}
          >
            {property.photos?.map((uri: string, idx: number) => (
              <Image
                key={idx}
                source={{ uri }}
                style={styles.modalImage}
                resizeMode="contain"
              />
            ))}
          </ScrollView>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setModalVisible(false)}
          >
            <Ionicons name="close" size={32} color="#fff" />
          </TouchableOpacity>
        </View>
      </Modal>

      {/* Favorite Button is now in DetailsHeader.tsx */}
      <Text style={styles.price}>${property.price?.toLocaleString()}</Text>
      <Text style={styles.title}>{property.title || "Beautiful Property"}</Text>
      <View style={styles.addressRow}>
        <Ionicons name="location-outline" size={16} color="#764ba2" />
        <Text style={styles.address}>{property.address}</Text>
      </View>
      {/* Amenities as chips */}
      {property.amenities && property.amenities.length > 0 && (
        <View style={styles.amenitiesRow}>
          {property.amenities.map((amenity: string, idx: number) => (
            <View
              key={idx}
              style={styles.amenityChip}
              accessible
              accessibilityLabel={amenity}
            >
              <Text style={styles.amenityText}>{amenity}</Text>
            </View>
          ))}
        </View>
      )}
      {/* Map (uncomment if react-native-maps is installed) */}

      {property.coordinates &&
        property.coordinates.latitude &&
        property.coordinates.longitude && (
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: property.coordinates.latitude,
              longitude: property.coordinates.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
            pointerEvents="none"
            accessibilityLabel="Property location on map"
          >
            <Marker
              coordinate={{
                latitude: property.coordinates.latitude,
                longitude: property.coordinates.longitude,
              }}
              title={property.title}
              description={property.address}
            />
          </MapView>
        )}

      <View style={styles.detailsSection}>
        <Text style={styles.sectionTitle}>Property Details</Text>
        <View style={styles.detailsGrid}>
          {property.bedrooms !== undefined && (
            <View style={styles.detailItem}>
              <Ionicons name="bed-outline" size={20} color="#764ba2" />
              <Text style={styles.detailText}>
                {property.bedrooms} Bedrooms
              </Text>
            </View>
          )}
          {property.bathrooms !== undefined && (
            <View style={styles.detailItem}>
              <Ionicons name="water-outline" size={20} color="#764ba2" />
              <Text style={styles.detailText}>
                {property.bathrooms} Bathrooms
              </Text>
            </View>
          )}
          {property.squareFootage && (
            <View style={styles.detailItem}>
              <Ionicons name="resize-outline" size={20} color="#764ba2" />
              <Text style={styles.detailText}>
                {property.squareFootage.toLocaleString()} sq ft
              </Text>
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
      {/* Agent Info and Contact Button */}
      {(property.agentName || property.agentPhone || property.agentEmail) && (
        <View style={styles.agentSection}>
          <Text style={styles.sectionTitle}>Agent Information</Text>
          {property.agentName && (
            <Text style={styles.agentText}>Name: {property.agentName}</Text>
          )}
          {property.agentPhone && (
            <Text style={styles.agentText}>Phone: {property.agentPhone}</Text>
          )}
          {property.agentEmail && (
            <Text style={styles.agentText}>Email: {property.agentEmail}</Text>
          )}
          <View style={styles.agentButtons}>
            {property.agentPhone && (
              <TouchableOpacity
                style={styles.contactBtn}
                onPress={openPhone}
                accessibilityLabel="Call agent"
                accessibilityRole="button"
              >
                <Ionicons name="call" size={20} color="#fff" />
                <Text style={styles.contactBtnText}>Call</Text>
              </TouchableOpacity>
            )}
            {property.agentEmail && (
              <TouchableOpacity
                style={styles.contactBtn}
                onPress={openEmail}
                accessibilityLabel="Email agent"
                accessibilityRole="button"
              >
                <Ionicons name="mail" size={20} color="#fff" />
                <Text style={styles.contactBtnText}>Email</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  infoContainer: { padding: 16 },
  imageGallery: { width: "100%", height: 220, marginBottom: 8 },
  image: {
    width: screenWidth - 32,
    height: 220,
    borderRadius: 14,
    marginRight: 12,
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ccc",
    marginHorizontal: 4,
  },
  dotActive: { backgroundColor: "#764ba2" },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.95)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalImage: { width: screenWidth, height: "100%" },
  closeButton: { position: "absolute", top: 40, right: 20, zIndex: 10 },
  price: { fontSize: 20, fontWeight: "700", color: "#764ba2", marginBottom: 6 },
  title: { fontSize: 18, fontWeight: "bold", color: "#222", marginBottom: 4 },
  addressRow: { flexDirection: "row", alignItems: "center", marginBottom: 6 },
  address: { fontSize: 14, color: "#444", fontWeight: "500" },
  amenitiesRow: { flexDirection: "row", flexWrap: "wrap", marginBottom: 12 },
  amenityChip: {
    backgroundColor: "#f0e9fa",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginRight: 8,
    marginBottom: 8,
  },
  amenityText: { color: "#764ba2", fontSize: 13, fontWeight: "500" },
  map: { width: "100%", height: 160, borderRadius: 12, marginBottom: 16 },
  detailsSection: { marginTop: 12 },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#764ba2",
    marginBottom: 8,
  },
  detailsGrid: { flexDirection: "row", flexWrap: "wrap" },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
    marginBottom: 8,
  },
  detailText: { fontSize: 14, color: "#666", marginLeft: 6 },
  descriptionSection: { marginTop: 16 },
  description: { fontSize: 14, color: "#666", lineHeight: 20 },
  agentSection: {
    marginTop: 24,
    padding: 12,
    backgroundColor: "#f6f2fa",
    borderRadius: 12,
  },
  agentText: { fontSize: 14, color: "#444", marginBottom: 4 },
  agentButtons: { flexDirection: "row", marginTop: 8 },
  contactBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#764ba2",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 12,
  },
  contactBtnText: { color: "#fff", fontWeight: "600", marginLeft: 6 },
});
