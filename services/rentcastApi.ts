// RentCast API Service
// Get your free API key from: https://rapidapi.com/rentcast/api/rentcast

import { ENV, useMockData } from '../config/env';

const RENTCAST_API_KEY = ENV.RENTCAST_API_KEY;
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
  private useMockData: boolean;

  constructor(apiKey: string = RENTCAST_API_KEY) {
    this.apiKey = apiKey;
    this.useMockData = useMockData;
  }

  private async makeRequest(endpoint: string, params: Record<string, any> = {}) {
    if (this.useMockData) {
      console.log('Using mock data - API key not configured');
      return this.getMockResponse(endpoint, params);
    }

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

      const data = await response.json();
      console.log('RentCast API Response:', data);
      return data;
    } catch (error) {
      console.error('RentCast API Error:', error);
      // Fallback to mock data on error
      console.log('Falling back to mock data due to API error');
      return this.getMockResponse(endpoint, params);
    }
  }

  private getMockResponse(endpoint: string, params: Record<string, any>) {
    if (endpoint.includes('/properties')) {
      return { content: this.getMockProperties(params) };
    }
    return this.getMockProperties(params);
  }

  async searchProperties(params: RentCastSearchParams): Promise<RentCastProperty[]> {
    try {
      const response = await this.makeRequest('/properties', params);
      return response.content || response || [];
    } catch (error) {
      console.error('Failed to search properties:', error);
      return this.getMockProperties(params);
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

  // Enhanced mock data for development/testing
  private getMockProperties(params: RentCastSearchParams): RentCastProperty[] {
    const mockProperties: RentCastProperty[] = [
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
        listingDescription: 'Beautiful family home with modern amenities, updated kitchen, and spacious backyard. Perfect for families looking for comfort and style.',
        photos: [
          'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop',
          'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400&h=300&fit=crop',
          'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop',
        ],
        amenities: ['Pool', 'Garden', 'Garage', 'Central AC', 'Hardwood Floors'],
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
        listingDescription: 'Modern apartment in prime location with stunning city views. Features high-end finishes and convenient access to amenities.',
        photos: [
          'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=300&fit=crop',
          'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop',
          'https://images.unsplash.com/photo-1560448075-bb485b067938?w=400&h=300&fit=crop',
        ],
        amenities: ['Gym', 'Balcony', 'Parking', 'In-Unit Laundry', 'Dishwasher'],
      },
      {
        id: '3',
        address: {
          line1: '789 Oak Ave',
          city: 'Capital City',
          state: 'IL',
          zipCode: '62701',
          formattedAddress: '789 Oak Ave, Capital City, IL 62701',
        },
        physical: {
          bedrooms: 1,
          bathrooms: 1,
          squareFootage: 800,
          yearBuilt: 2018,
          lotSize: 2000,
        },
        market: {
          price: 280000,
          rentZestimate: 1800,
          lastSeen: '2024-01-08',
          listedDate: '2024-01-03',
          status: 'For Sale',
        },
        location: {
          latitude: 37.7649,
          longitude: -122.4294,
        },
        propertyType: 'Condo',
        listingDescription: 'Cozy condo perfect for first-time buyers or investors. Low maintenance with great rental potential.',
        photos: [
          'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop',
          'https://images.unsplash.com/photo-1560448075-bb485b067938?w=400&h=300&fit=crop',
          'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400&h=300&fit=crop',
        ],
        amenities: ['Gym', 'Pool', 'Security', 'Storage', 'Pet Friendly'],
      },
      {
        id: '4',
        address: {
          line1: '321 Pine St',
          city: 'Springfield',
          state: 'IL',
          zipCode: '62701',
          formattedAddress: '321 Pine St, Springfield, IL 62701',
        },
        physical: {
          bedrooms: 4,
          bathrooms: 3,
          squareFootage: 2500,
          yearBuilt: 2008,
          lotSize: 8000,
        },
        market: {
          price: 650000,
          rentZestimate: 3500,
          lastSeen: '2024-01-12',
          listedDate: '2024-01-07',
          status: 'For Sale',
        },
        location: {
          latitude: 37.7949,
          longitude: -122.4194,
        },
        propertyType: 'Single Family',
        listingDescription: 'Luxury family home with premium finishes, gourmet kitchen, and resort-style backyard. Perfect for entertaining.',
        photos: [
          'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop',
          'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400&h=300&fit=crop',
          'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop',
        ],
        amenities: ['Pool', 'Spa', 'Garden', 'Garage', 'Smart Home', 'Wine Cellar'],
      },
      {
        id: '5',
        address: {
          line1: '654 Maple Dr',
          city: 'Shelbyville',
          state: 'IL',
          zipCode: '62565',
          formattedAddress: '654 Maple Dr, Shelbyville, IL 62565',
        },
        physical: {
          bedrooms: 2,
          bathrooms: 2,
          squareFootage: 1400,
          yearBuilt: 2019,
          lotSize: 3500,
        },
        market: {
          price: 380000,
          rentZestimate: 2400,
          lastSeen: '2024-01-14',
          listedDate: '2024-01-09',
          status: 'For Sale',
        },
        location: {
          latitude: 37.8049,
          longitude: -122.4094,
        },
        propertyType: 'Townhouse',
        listingDescription: 'Modern townhouse with open floor plan, private patio, and community amenities. Great for young professionals.',
        photos: [
          'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=300&fit=crop',
          'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop',
          'https://images.unsplash.com/photo-1560448075-bb485b067938?w=400&h=300&fit=crop',
        ],
        amenities: ['Patio', 'Community Pool', 'Fitness Center', 'Storage', 'Pet Friendly'],
      },
    ];

    // Apply filters to mock data
    let filtered = mockProperties;
    
    if (params.city) {
      filtered = filtered.filter(p => 
        p.address.city.toLowerCase().includes(params.city!.toLowerCase())
      );
    }
    
    if (params.state) {
      filtered = filtered.filter(p => 
        p.address.state.toLowerCase() === params.state!.toLowerCase()
      );
    }
    
    if (params.minPrice) {
      filtered = filtered.filter(p => p.market.price >= params.minPrice!);
    }
    
    if (params.maxPrice) {
      filtered = filtered.filter(p => p.market.price <= params.maxPrice!);
    }
    
    if (params.bedrooms) {
      filtered = filtered.filter(p => p.physical.bedrooms >= params.bedrooms!);
    }
    
    if (params.bathrooms) {
      filtered = filtered.filter(p => p.physical.bathrooms >= params.bathrooms!);
    }
    
    if (params.propertyType) {
      filtered = filtered.filter(p => 
        p.propertyType.toLowerCase().includes(params.propertyType!.toLowerCase())
      );
    }

    return filtered;
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
    parking: rentcastProperty.amenities.some(a => a.toLowerCase().includes('parking')),
    pool: rentcastProperty.amenities.some(a => a.toLowerCase().includes('pool')),
    gym: rentcastProperty.amenities.some(a => a.toLowerCase().includes('gym')),
    garden: rentcastProperty.amenities.some(a => a.toLowerCase().includes('garden')),
    balcony: rentcastProperty.amenities.some(a => a.toLowerCase().includes('balcony')),
  };
} 