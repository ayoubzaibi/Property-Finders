import { useCallback, useEffect, useRef, useState } from 'react';
import { fetchProperties, Property, searchProperties } from '../services/propertyService';

interface UsePropertiesOptions {
  autoLoad?: boolean;
  initialParams?: {
    page?: number;
    limit?: number;
    location?: string;
    minPrice?: number;
    maxPrice?: number;
    bedrooms?: number;
    bathrooms?: number;
    propertyType?: string;
  };
}

interface UsePropertiesReturn {
  properties: Property[];
  loading: boolean;
  error: string | null;
  refreshing: boolean;
  loadProperties: (params?: any) => Promise<void>;
  searchProperties: (query: string, filters?: any) => Promise<void>;
  refresh: () => Promise<void>;
  clearError: () => void;
}

export function useProperties(options: UsePropertiesOptions = {}): UsePropertiesReturn {
  const { autoLoad = true, initialParams = {} } = options;
  
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(autoLoad);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasLoaded, setHasLoaded] = useState(false);
  const initialParamsRef = useRef(initialParams);

  const loadProperties = useCallback(async (params: any = {}) => {
    try {
      setError(null);
      setLoading(true);
      
      const data = await fetchProperties({
        limit: 20,
        ...initialParamsRef.current,
        ...params,
      });
      
      setProperties(data);
      setHasLoaded(true);
    } catch (err) {
      console.error('Failed to load properties:', err);
      setError('Failed to load properties. Please try again.');
      // Don't throw the error to prevent infinite loops
    } finally {
      setLoading(false);
    }
  }, []); // Remove initialParams from dependencies

  const searchPropertiesData = useCallback(async (query: string, filters: any = {}) => {
    try {
      setError(null);
      setLoading(true);
      
      const data = await searchProperties(query, {
        limit: 20,
        ...filters,
      });
      
      setProperties(data);
    } catch (err) {
      console.error('Search failed:', err);
      setError('Search failed. Please try again.');
      // Don't throw the error to prevent infinite loops
    } finally {
      setLoading(false);
    }
  }, []);

  const refresh = useCallback(async () => {
    try {
      setRefreshing(true);
      setError(null);
      
      const data = await fetchProperties({
        limit: 20,
        ...initialParamsRef.current,
      });
      
      setProperties(data);
    } catch (err) {
      console.error('Refresh failed:', err);
      setError('Refresh failed. Please try again.');
    } finally {
      setRefreshing(false);
    }
  }, []); // Remove initialParams from dependencies

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  useEffect(() => {
    if (autoLoad && !hasLoaded) {
      loadProperties();
    }
  }, [autoLoad, hasLoaded, loadProperties]);

  return {
    properties,
    loading,
    error,
    refreshing,
    loadProperties,
    searchProperties: searchPropertiesData,
    refresh,
    clearError,
  };
} 