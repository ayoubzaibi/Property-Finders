/* eslint-disable @typescript-eslint/no-require-imports */
import { useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import AgentInfoSection from "./AgentInfoSection";
import AmenitiesChips from "./AmenitiesChips";
import DescriptionSection from "./DescriptionSection";
import ImageGallery from "./ImageGallery";
import MapSection from "./MapSection";
import PropertyDetailsGrid from "./PropertyDetailsGrid";





export default function DetailsInfo({
  property,
  onFavorite,
  isFavorite,
}: {
  property: any;
  onFavorite: () => void;
  isFavorite: boolean;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);

  const openPhone = () => {
    if (property.agentPhone) {
      require("react-native").Linking.openURL(
        `tel:${property.agentPhone.replace(/[^\d+]/g, "")}`
      );
    }
  };
  const openEmail = () => {
    if (property.agentEmail) {
      require("react-native").Linking.openURL(`mailto:${property.agentEmail}`);
    }
  };

  return (
    <View style={styles.infoContainer}>
      {/* Image Gallery or fallback image */}
      {property.photos && property.photos.length > 0 ? (
        <ImageGallery
          photos={property.photos}
          activeIndex={activeIndex}
          setActiveIndex={setActiveIndex}
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
        />
      ) : (
        <Image
          source={require("../assets/images/icon.png")}
          style={styles.image}
          resizeMode="cover"
          accessible
          accessibilityLabel="No property image available"
        />
      )}
      <Text style={styles.price}>${property.price?.toLocaleString()}</Text>
      <Text style={styles.title}>{property.title || "Beautiful Property"}</Text>
      <View style={styles.addressRow}>
        {/* Location icon can be added here if desired */}
        <Text style={styles.address}>{property.address}</Text>
      </View>
      <AmenitiesChips amenities={property.amenities} />
      <MapSection
        coordinates={property.coordinates}
        title={property.title}
        address={property.address}
      />
      <View style={styles.detailsSection}>
        <Text style={styles.sectionTitle}>Property Details</Text>
        <PropertyDetailsGrid property={property} />
      </View>
      <DescriptionSection description={property.description} />
      <AgentInfoSection
        agentName={property.agentName}
        agentPhone={property.agentPhone}
        agentEmail={property.agentEmail}
        openPhone={openPhone}
        openEmail={openEmail}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  infoContainer: { padding: 16 },
  image: {
    width: require("react-native").Dimensions.get("window").width - 32,
    height: 220,
    borderRadius: 14,
    marginBottom: 8,
  },
  price: { fontSize: 20, fontWeight: "700", color: "#764ba2", marginBottom: 6 },
  title: { fontSize: 18, fontWeight: "bold", color: "#222", marginBottom: 4 },
  addressRow: { flexDirection: "row", alignItems: "center", marginBottom: 6 },
  address: { fontSize: 14, color: "#444", fontWeight: "500" },
  detailsSection: { marginTop: 12 },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#764ba2",
    marginBottom: 8,
  },
});
