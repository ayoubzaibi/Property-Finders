import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { convertRentCastToProperty, rentcastAPI, RentCastSearchParams } from '../../services/rentcastApi';

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

// Convert search filters to RentCast API parameters
function convertFiltersToRentCastParams(filters: SearchFilters): RentCastSearchParams {
  const params: RentCastSearchParams = {
    limit: 20, // Limit results for better performance
  };

  if (filters.location) {
    // Try to extract city and state from location string
    const locationParts = filters.location.split(',').map(part => part.trim());
    if (locationParts.length >= 2) {
      params.city = locationParts[0];
      params.state = locationParts[1];
    } else {
      params.city = filters.location;
    }
  }

  if (filters.minPrice > 0) {
    params.minPrice = filters.minPrice;
  }

  if (filters.maxPrice < Infinity) {
    params.maxPrice = filters.maxPrice;
  }

  if (filters.minBedrooms > 0) {
    params.bedrooms = filters.minBedrooms;
  }

  if (filters.minBathrooms > 0) {
    params.bathrooms = filters.minBathrooms;
  }

  if (filters.propertyType) {
    params.propertyType = filters.propertyType;
  }

  return params;
}

// Fetch properties from RentCast API
export const fetchProperties = createAsyncThunk(
  'properties/fetchProperties',
  async (filters: SearchFilters) => {
    try {
      console.log('Fetching properties with filters:', filters);
      
      // Convert our filters to RentCast API parameters
      const rentcastParams = convertFiltersToRentCastParams(filters);
      console.log('RentCast API parameters:', rentcastParams);

      // Fetch properties from RentCast API
      const rentcastProperties = await rentcastAPI.searchProperties(rentcastParams);
      console.log('RentCast properties received:', rentcastProperties.length);

      // Convert RentCast properties to our Property format
      const properties: Property[] = rentcastProperties.map(convertRentCastToProperty);
      console.log('Converted properties:', properties.length);

      // Apply additional client-side filtering for amenities
      let filteredProperties = properties;
      
      if (filters.amenities.length > 0) {
        filteredProperties = properties.filter(property => 
          filters.amenities.every(amenity => 
            property.amenities.some(a => a.toLowerCase().includes(amenity.toLowerCase()))
          )
        );
      }

      return filteredProperties;
    } catch (error) {
      console.error('Error fetching properties:', error);
      throw error;
    }
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
    clearProperties: (state) => {
      state.properties = [];
      state.filteredProperties = [];
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
        console.log('Properties loaded successfully:', action.payload.length);
      })
      .addCase(fetchProperties.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch properties';
        console.error('Properties fetch failed:', state.error);
      });
  },
});

export const { 
  setSearchFilters, 
  addToSearchHistory, 
  clearSearchHistory, 
  setFilteredProperties,
  clearProperties
} = propertiesSlice.actions;

export default propertiesSlice.reducer; 