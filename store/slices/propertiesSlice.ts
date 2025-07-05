import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Property {
  id: string;
  price: number;
  address: string;
  propertyType: string;
  bedrooms: number;
  bathrooms: number;
  size: number;
  yearBuilt?: number;
  amenities: string[];
  photos: string[];
  description?: string;
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
}

export interface SearchFilters {
  location: string;
  minPrice: number;
  maxPrice: number;
  propertyType: string;
  minBedrooms: number;
  minBathrooms: number;
  amenities: string[];
}

interface PropertiesState {
  properties: Property[];
  filteredProperties: Property[];
  loading: boolean;
  error: string | null;
  searchFilters: SearchFilters;
  searchHistory: SearchFilters[];
}

const initialState: PropertiesState = {
  properties: [],
  filteredProperties: [],
  loading: false,
  error: null,
  searchFilters: {
    location: '',
    minPrice: 0,
    maxPrice: Infinity,
    propertyType: '',
    minBedrooms: 0,
    minBathrooms: 0,
    amenities: [],
  },
  searchHistory: [],
};

// Mock API call - replace with RentCast API
export const fetchProperties = createAsyncThunk(
  'properties/fetchProperties',
  async (filters: SearchFilters) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock data - replace with actual API call
    const mockProperties: Property[] = [
      {
        id: '1',
        price: 350000,
        address: '123 Main St, Springfield',
        propertyType: 'House',
        bedrooms: 3,
        bathrooms: 2,
        size: 1800,
        yearBuilt: 2010,
        amenities: ['Pool', 'Garden', 'Garage'],
        photos: [
          'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop',
          'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400&h=300&fit=crop',
        ],
        description: 'Beautiful family home with modern amenities',
        location: { latitude: 37.7749, longitude: -122.4194 },
        neighborhood: 'Downtown',
        parking: true,
        pool: true,
        garden: true,
      },
      {
        id: '2',
        price: 450000,
        address: '456 Elm St, Shelbyville',
        propertyType: 'Apartment',
        bedrooms: 2,
        bathrooms: 1,
        size: 1200,
        yearBuilt: 2015,
        amenities: ['Gym', 'Balcony', 'Parking'],
        photos: [
          'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=300&fit=crop',
          'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop',
        ],
        description: 'Modern apartment in prime location',
        location: { latitude: 37.7849, longitude: -122.4094 },
        neighborhood: 'Uptown',
        parking: true,
        gym: true,
        balcony: true,
      },
      {
        id: '3',
        price: 280000,
        address: '789 Oak Ave, Capital City',
        propertyType: 'Condo',
        bedrooms: 1,
        bathrooms: 1,
        size: 800,
        yearBuilt: 2018,
        amenities: ['Gym', 'Pool', 'Security'],
        photos: [
          'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop',
          'https://images.unsplash.com/photo-1560448075-bb485b067938?w=400&h=300&fit=crop',
        ],
        description: 'Cozy condo perfect for first-time buyers',
        location: { latitude: 37.7649, longitude: -122.4294 },
        neighborhood: 'Midtown',
        gym: true,
        pool: true,
      },
    ];

    // Apply filters
    let filtered = mockProperties;
    
    if (filters.location) {
      filtered = filtered.filter(p => 
        p.address.toLowerCase().includes(filters.location.toLowerCase()) ||
        p.neighborhood?.toLowerCase().includes(filters.location.toLowerCase())
      );
    }
    
    if (filters.minPrice > 0) {
      filtered = filtered.filter(p => p.price >= filters.minPrice);
    }
    
    if (filters.maxPrice < Infinity) {
      filtered = filtered.filter(p => p.price <= filters.maxPrice);
    }
    
    if (filters.propertyType) {
      filtered = filtered.filter(p => p.propertyType === filters.propertyType);
    }
    
    if (filters.minBedrooms > 0) {
      filtered = filtered.filter(p => p.bedrooms >= filters.minBedrooms);
    }
    
    if (filters.minBathrooms > 0) {
      filtered = filtered.filter(p => p.bathrooms >= filters.minBathrooms);
    }
    
    if (filters.amenities.length > 0) {
      filtered = filtered.filter(p => 
        filters.amenities.every(amenity => 
          p.amenities.some(a => a.toLowerCase().includes(amenity.toLowerCase()))
        )
      );
    }

    return filtered;
  }
);

const propertiesSlice = createSlice({
  name: 'properties',
  initialState,
  reducers: {
    setSearchFilters: (state, action: PayloadAction<SearchFilters>) => {
      state.searchFilters = action.payload;
    },
    addToSearchHistory: (state, action: PayloadAction<SearchFilters>) => {
      state.searchHistory.unshift(action.payload);
      // Keep only last 10 searches
      if (state.searchHistory.length > 10) {
        state.searchHistory = state.searchHistory.slice(0, 10);
      }
    },
    clearSearchHistory: (state) => {
      state.searchHistory = [];
    },
    setFilteredProperties: (state, action: PayloadAction<Property[]>) => {
      state.filteredProperties = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProperties.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProperties.fulfilled, (state, action) => {
        state.loading = false;
        state.properties = action.payload;
        state.filteredProperties = action.payload;
      })
      .addCase(fetchProperties.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch properties';
      });
  },
});

export const { 
  setSearchFilters, 
  addToSearchHistory, 
  clearSearchHistory, 
  setFilteredProperties 
} = propertiesSlice.actions;

export default propertiesSlice.reducer; 