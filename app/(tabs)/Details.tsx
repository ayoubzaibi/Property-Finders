import { RouteProp, useRoute } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';
import { rentcastAPI } from '../../services/rentcastApi';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { addToFavorites, removeFromFavorites } from '../../store/slices/favoritesSlice';

export type Property = {
  id: string;
  address: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  size: number;
  amenities: string[];
  photos: string[];
  propertyType: string;
  description?: string;
  yearBuilt?: number;
  location: {
    latitude: number;
    longitude: number;
  };
  neighborhood?: string;
  parking?: boolean;
  pool?: boolean;
  gym?: boolean;
  garden?: boolean;
  balcony?: boolean;
};

type Params = {
  Details: { property: Property };
};

const { width, height } = Dimensions.get('window');

export default function Details() {
  const route = useRoute<RouteProp<Params, 'Details'>>();
  const { property } = route.params;
  const dispatch = useAppDispatch();
  const { favorites } = useAppSelector((state: any) => state.favorites);
  
  const [imageViewerVisible, setImageViewerVisible] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [rentEstimate, setRentEstimate] = useState<number | null>(null);
  const [loadingRent, setLoadingRent] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);


  const fetchRentEstimate = useCallback(async () => {
    setLoadingRent(true);
    try {
      const estimate = await rentcastAPI.getRentEstimates(property.address);
      if (estimate && estimate.rentZestimate) {
        setRentEstimate(estimate.rentZestimate);
      }
    } catch (error) {
      console.log('Could not fetch rent estimate:', error);
    } finally {
      setLoadingRent(false);
    }
  }, [property.address]);

  useEffect(() => {

    const favorite = favorites.find((fav: any) => fav.property.id === property.id);
    setIsFavorite(!!favorite);
    

    fetchRentEstimate();
  }, [property.id, favorites, fetchRentEstimate]);



  const handleFavorite = async () => {
    if (isFavorite) {
      const favorite = favorites.find((fav: any) => fav.property.id === property.id);
      if (favorite) {
        dispatch(removeFromFavorites(favorite.id));
      }
    } else {
      dispatch(addToFavorites(property));
    }
  };

  const openImageViewer = (index: number) => {
    setSelectedImageIndex(index);
    setImageViewerVisible(true);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatRent = (rent: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(rent);
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.photoSection}>
          <ScrollView 
            horizontal 
            pagingEnabled 
            showsHorizontalScrollIndicator={false}
            style={styles.photoScroll}
          >
            {property.photos.map((photo, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => openImageViewer(index)}
                style={styles.photoContainer}
              >
                <Image source={{ uri: photo }} style={styles.photo} />
                <View style={styles.photoOverlay}>
                  <Text style={styles.photoCount}>{index + 1} / {property.photos.length}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
          
          <TouchableOpacity 
            style={[styles.favoriteButton, isFavorite && styles.favoriteButtonActive]} 
            onPress={handleFavorite}
          >
            <Ionicons 
              name={isFavorite ? "heart" : "heart-outline"} 
              size={24} 
              color={isFavorite ? "#fff" : "#fff"} 
            />
          </TouchableOpacity>
        </View>

        <View style={styles.infoSection}>
          <View style={styles.priceSection}>
            <Text style={styles.price}>{formatPrice(property.price)}</Text>
            {rentEstimate && (
              <View style={styles.rentSection}>
                <Text style={styles.rentLabel}>Rent Estimate:</Text>
                <Text style={styles.rentPrice}>{formatRent(rentEstimate)}/mo</Text>
              </View>
            )}
            {loadingRent && (
              <View style={styles.rentSection}>
                <ActivityIndicator size="small" color="#666" />
                <Text style={styles.rentLabel}>Loading rent estimate...</Text>
              </View>
            )}
          </View>

          <Text style={styles.address}>{property.address}</Text>
          
          <View style={styles.propertyTypeContainer}>
            <Text style={styles.propertyType}>{property.propertyType}</Text>
          </View>

          <View style={styles.detailsGrid}>
            <View style={styles.detailItem}>
              <Ionicons name="bed-outline" size={20} color="#666" />
              <Text style={styles.detailText}>{property.bedrooms} Bedrooms</Text>
            </View>
            <View style={styles.detailItem}>
              <Ionicons name="water-outline" size={20} color="#666" />
              <Text style={styles.detailText}>{property.bathrooms} Bathrooms</Text>
            </View>
            <View style={styles.detailItem}>
              <Ionicons name="resize-outline" size={20} color="#666" />
              <Text style={styles.detailText}>{property.size.toLocaleString()} sqft</Text>
            </View>
            {property.yearBuilt && (
              <View style={styles.detailItem}>
                <Ionicons name="calendar-outline" size={20} color="#666" />
                <Text style={styles.detailText}>Built {property.yearBuilt}</Text>
              </View>
            )}
          </View>

          {property.description && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Description</Text>
              <Text style={styles.description}>{property.description}</Text>
            </View>
          )}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Amenities</Text>
            <View style={styles.amenitiesGrid}>
              {property.amenities.map((amenity, index) => (
                <View key={index} style={styles.amenityItem}>
                  <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                  <Text style={styles.amenityText}>{amenity}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Location</Text>
            <View style={styles.locationInfo}>
              <Ionicons name="location-outline" size={20} color="#666" />
              <Text style={styles.locationText}>
                {property.neighborhood || 'Location details available'}
              </Text>
            </View>
          </View>

          <View style={styles.actionsSection}>
            <TouchableOpacity style={styles.contactButton}>
              <Ionicons name="call-outline" size={20} color="#fff" />
              <Text style={styles.contactButtonText}>Contact Agent</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.scheduleButton}>
              <Ionicons name="calendar-outline" size={20} color="#667eea" />
              <Text style={styles.scheduleButtonText}>Schedule Viewing</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <Modal
        visible={imageViewerVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setImageViewerVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={() => setImageViewerVisible(false)}
          >
            <Ionicons name="close" size={30} color="#fff" />
          </TouchableOpacity>
          
          <ScrollView 
            horizontal 
            pagingEnabled 
            showsHorizontalScrollIndicator={false}
            style={styles.modalImageScroll}
            contentOffset={{ x: selectedImageIndex * width, y: 0 }}
          >
            {property.photos.map((photo, index) => (
              <View key={index} style={styles.modalImageContainer}>
                <Image source={{ uri: photo }} style={styles.modalImage} />
                <View style={styles.modalPhotoCount}>
                  <Text style={styles.modalPhotoCountText}>{index + 1} / {property.photos.length}</Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  photoSection: {
    position: 'relative',
    height: 300,
  },
  photoScroll: {
    height: 300,
  },
  photoContainer: {
    width: width,
    height: 300,
    position: 'relative',
  },
  photo: {
    width: width,
    height: 300,
    resizeMode: 'cover',
  },
  photoOverlay: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  photoCount: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  favoriteButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  favoriteButtonActive: {
    backgroundColor: '#e74c3c',
  },
  infoSection: {
    padding: 20,
  },
  priceSection: {
    marginBottom: 15,
  },
  price: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333',
    marginBottom: 5,
  },
  rentSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  rentLabel: {
    fontSize: 14,
    color: '#666',
    marginRight: 8,
  },
  rentPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4CAF50',
  },
  address: {
    fontSize: 18,
    color: '#333',
    marginBottom: 15,
    lineHeight: 24,
  },
  propertyTypeContainer: {
    backgroundColor: '#667eea',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  propertyType: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 25,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '50%',
    marginBottom: 15,
  },
  detailText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 8,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  amenitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  amenityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '50%',
    marginBottom: 10,
  },
  amenityText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 8,
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 16,
    color: '#666',
    marginLeft: 8,
  },
  actionsSection: {
    marginTop: 20,
    gap: 15,
  },
  contactButton: {
    backgroundColor: '#667eea',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 12,
    gap: 8,
  },
  contactButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  scheduleButton: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#667eea',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 12,
    gap: 8,
  },
  scheduleButtonText: {
    color: '#667eea',
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 1,
  },
  modalImageScroll: {
    width: width,
    height: height * 0.7,
  },
  modalImageContainer: {
    width: width,
    height: height * 0.7,
    position: 'relative',
  },
  modalImage: {
    width: width,
    height: height * 0.7,
    resizeMode: 'contain',
  },
  modalPhotoCount: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  modalPhotoCountText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
});