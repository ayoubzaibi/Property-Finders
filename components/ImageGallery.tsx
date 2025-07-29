import { Ionicons } from "@expo/vector-icons";
import {
  Dimensions,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

const screenWidth = Dimensions.get("window").width;

interface ImageGalleryProps {
  photos: string[];
  activeIndex: number;
  setActiveIndex: (idx: number) => void;
  modalVisible: boolean;
  setModalVisible: (v: boolean) => void;
}

export default function ImageGallery({
  photos,
  activeIndex,
  setActiveIndex,
  modalVisible,
  setModalVisible,
}: ImageGalleryProps) {
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
  return (
    <>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        style={styles.imageGallery}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {photos.map((uri, idx) => (
          <TouchableOpacity
            key={idx}
            activeOpacity={0.9}
            onPress={() => openModal(idx)}
          >
            <Image source={{ uri }} style={styles.image} resizeMode="cover" />
          </TouchableOpacity>
        ))}
      </ScrollView>
      <View style={styles.dotsContainer}>
        {photos.map((_, idx) => (
          <View
            key={idx}
            style={[styles.dot, activeIndex === idx && styles.dotActive]}
          />
        ))}
      </View>
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
            {photos.map((uri, idx) => (
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
    </>
  );
}

const styles = StyleSheet.create({
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
});
