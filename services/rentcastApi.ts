// RentCast API Service
// Get your free API key from: https://rapidapi.com/rentcast/api/rentcast

const RENTCAST_API_KEY = 'YOUR_RENTCAST_API_KEY'; // Replace with your actual API key
const RENTCAST_BASE_URL = 'https://rentcast-v1.p.rapidapi.com';

export interface RentCastProperty {
  id: string;
  address: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    zipCode: string;
    formattedAddress: string;
  };
  physical: {
    bedrooms: number;
    bathrooms: number;
    squareFootage: number;
    yearBuilt: number;
    lotSize: number;
  };
  market: {
    price: number;
    rentZestimate: number;
    lastSeen: string;
    listedDate: string;
    status: string;
  };
  location: {
    latitude: number;
    longitude: number;
  };
  propertyType: string;
  listingDescription?: string;
  photos: string[];
  amenities: string[];
}

export interface RentCastSearchParams {
  city?: string;
  state?: string;
  zipCode?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  bathrooms?: number;
  propertyType?: string;
  limit?: number;
  offset?: number;
}

class RentCastAPI {
  private apiKey: string;

  constructor(apiKey: string = RENTCAST_API_KEY) {
    this.apiKey = apiKey;
  }

  private async makeRequest(endpoint: string, params: Record<string, any> = {}) {
    const url = new URL(`${RENTCAST_BASE_URL}${endpoint}`);
    
    // Add query parameters
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, value.toString());
      }
    });

    try {
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': this.apiKey,
          'X-RapidAPI-Host': 'rentcast-v1.p.rapidapi.com',
        },
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('RentCast API Error:', error);
      throw error;
    }
  }

  async searchProperties(params: RentCastSearchParams): Promise<RentCastProperty[]> {
    try {
      const response = await this.makeRequest('/properties', params);
      return response.content || [];
    } catch (error) {
      console.error('Failed to search properties:', error);
      // Return mock data as fallback
      return this.getMockProperties();
    }
  }

  async getPropertyDetails(propertyId: string): Promise<RentCastProperty | null> {
    try {
      const response = await this.makeRequest(`/properties/${propertyId}`);
      return response;
    } catch (error) {
      console.error('Failed to get property details:', error);
      return null;
    }
  }

  async getRentEstimates(address: string): Promise<any> {
    try {
      const response = await this.makeRequest('/rent-estimates', { address });
      return response;
    } catch (error) {
      console.error('Failed to get rent estimates:', error);
      return null;
    }
  }

  // Mock data for development/testing
  private getMockProperties(): RentCastProperty[] {
    return [
      {
        id: '1',
        address: {
          line1: '123 Main St',
          city: 'Springfield',
          state: 'IL',
          zipCode: '62701',
          formattedAddress: '123 Main St, Springfield, IL 62701',
        },
        physical: {
          bedrooms: 3,
          bathrooms: 2,
          squareFootage: 1800,
          yearBuilt: 2010,
          lotSize: 5000,
        },
        market: {
          price: 350000,
          rentZestimate: 2200,
          lastSeen: '2024-01-15',
          listedDate: '2024-01-01',
          status: 'For Sale',
        },
        location: {
          latitude: 37.7749,
          longitude: -122.4194,
        },
        propertyType: 'Single Family',
        listingDescription: 'Beautiful family home with modern amenities',
        photos: [
          'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop',
          'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400&h=300&fit=crop',
        ],
        amenities: ['Pool', 'Garden', 'Garage'],
      },
      {
        id: '2',
        address: {
          line1: '456 Elm St',
          city: 'Shelbyville',
          state: 'IL',
          zipCode: '62565',
          formattedAddress: '456 Elm St, Shelbyville, IL 62565',
        },
        physical: {
          bedrooms: 2,
          bathrooms: 1,
          squareFootage: 1200,
          yearBuilt: 2015,
          lotSize: 3000,
        },
        market: {
          price: 450000,
          rentZestimate: 2800,
          lastSeen: '2024-01-10',
          listedDate: '2024-01-05',
          status: 'For Sale',
        },
        location: {
          latitude: 37.7849,
          longitude: -122.4094,
        },
        propertyType: 'Apartment',
        listingDescription: 'Modern apartment in prime location',
        photos: [
          'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=300&fit=crop',
          'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop',
        ],
        amenities: ['Gym', 'Balcony', 'Parking'],
      },
    ];
  }
}

export const rentcastAPI = new RentCastAPI();

// Helper function to convert RentCast property to our Property type
export function convertRentCastToProperty(rentcastProperty: RentCastProperty) {
  return {
    id: rentcastProperty.id,
    price: rentcastProperty.market.price,
    address: rentcastProperty.address.formattedAddress,
    propertyType: rentcastProperty.propertyType,
    bedrooms: rentcastProperty.physical.bedrooms,
    bathrooms: rentcastProperty.physical.bathrooms,
    size: rentcastProperty.physical.squareFootage,
    yearBuilt: rentcastProperty.physical.yearBuilt,
    amenities: rentcastProperty.amenities,
    photos: rentcastProperty.photos,
    description: rentcastProperty.listingDescription,
    location: rentcastProperty.location,
    neighborhood: rentcastProperty.address.city,
  };
} 