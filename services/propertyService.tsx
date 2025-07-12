// Network configuration for different environments
const getApiBaseUrl = () => {
  if (__DEV__) {
    // Development environment - try multiple IP addresses
    const possibleUrls = [
      'http://localhost:3000/api/v1/properties',      // Local development
      'http://127.0.0.1:3000/api/v1/properties',     // Alternative localhost
      'http://192.168.242.142:3000/api/v1/properties', // Your actual IP address
      'http://10.0.2.2:3000/api/v1/properties',      // Android emulator
    ];
    
    // For now, let's use your actual IP address for better connectivity
    return 'http://192.168.242.142:3000/api/v1/properties';
  }
  
  // Production environment
  return 'http://localhost:3000/api/v1/properties';
};

const API_BASE_URL = getApiBaseUrl();

// Add debugging information
console.log('🔧 API_BASE_URL configured as:', API_BASE_URL);
console.log('🔧 __DEV__ is:', __DEV__);

export type Property = {
  id: string;
  price: number;
  address: string;
  photos: string[];
  title?: string;
  location?: string;
  bedrooms?: number;
  bathrooms?: number;
  propertyType?: string;
  squareFootage?: number;
  yearBuilt?: number;
  status?: string;
  description?: string;
  amenities?: string[];
};

// Test function to check server connectivity
export async function testServerConnection(): Promise<{ success: boolean; message: string; url: string }> {
  try {
    console.log('🧪 Testing server connection to:', API_BASE_URL);
    console.log('🧪 Full test URL:', `${API_BASE_URL}?page=1&limit=2`);
    
    // First, try a simple health check
    try {
      const healthUrl = `${API_BASE_URL.replace('/api/v1/properties', '')}/health`;
      console.log('🧪 Health check URL:', healthUrl);
      const healthResponse = await fetch(healthUrl, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
      });
      console.log('🧪 Health check status:', healthResponse.status);
    } catch (healthError) {
      console.log('🧪 Health check failed (this is normal if endpoint doesn\'t exist):', healthError);
    }
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      console.log('⏰ Server test timeout - aborting');
      controller.abort();
    }, 10000); // 10 second timeout

    // Test with your exact Postman URL format
    const testUrl = `${API_BASE_URL}?page=1&limit=2`;
    console.log('🌐 Making fetch request to:', testUrl);
    const response = await fetch(testUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    console.log('📡 Response status:', response.status);
    console.log('📡 Response headers:', Object.fromEntries(response.headers.entries()));

    if (response.ok) {
      const responseText = await response.text();
      console.log('✅ Server test successful. Response length:', responseText.length);
      console.log('✅ Response preview:', responseText.substring(0, 200) + '...');
      return {
        success: true,
        message: `Server is reachable and responding (${response.status})`,
        url: API_BASE_URL
      };
    } else {
      const errorText = await response.text();
      console.log('❌ Server error response:', errorText);
      return {
        success: false,
        message: `Server responded with status: ${response.status} - ${errorText}`,
        url: API_BASE_URL
      };
    }
  } catch (error: any) {
    console.error('💥 Server connection test failed:', error);
    console.error('💥 Error type:', typeof error);
    console.error('💥 Error name:', error.name);
    console.error('💥 Error message:', error.message);
    console.error('💥 Error stack:', error.stack);
    
    let message = 'Unknown error';
    if (error instanceof TypeError && error.message?.includes('Network request failed')) {
      message = 'Network error - server might not be running or wrong IP address';
    } else if (error.name === 'AbortError') {
      message = 'Request timeout - server is not responding (check if server is running)';
    } else {
      message = error.message || 'Connection failed';
    }
    
    return {
      success: false,
      message,
      url: API_BASE_URL
    };
  }
}

// Test multiple URLs to find a working server
export async function findWorkingServer(): Promise<{ success: boolean; workingUrl: string | null; message: string }> {
  const testUrls = [
    'http://192.168.242.142:3000/api/v1/properties', // Your actual IP address
    'http://localhost:3000/api/v1/properties',      // Local development
    'http://127.0.0.1:3000/api/v1/properties',     // Alternative localhost
    'http://10.0.2.2:3000/api/v1/properties',      // Android emulator
  ];

  console.log('Testing multiple server URLs...');

  for (const url of testUrls) {
    try {
      console.log(`Testing: ${url}`);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        console.log(`Timeout for ${url}`);
        controller.abort();
      }, 8000); // Increased to 8 seconds

        const response = await fetch(`${url}?page=1&limit=2`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        console.log(`✅ Working server found: ${url}`);
        return {
          success: true,
          workingUrl: url,
          message: `Found working server at: ${url}`
        };
      } else {
        console.log(`❌ Server responded with status: ${response.status} for ${url}`);
      }
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.log(`⏰ Timeout for ${url}`);
      } else {
        console.log(`❌ Failed to connect to ${url}:`, error.message);
      }
    }
  }

  console.log('❌ No working server found');
  return {
    success: false,
    workingUrl: null,
    message: 'No working server found. Please check if your server is running on port 3000.'
  };
}

export async function fetchProperties(params: {
  page?: number;
  limit?: number;
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  bathrooms?: number;
  propertyType?: string;
} = {}): Promise<Property[]> {
  try {
    console.log('🏠 Fetching properties with params:', params);
    console.log('🏠 API_BASE_URL:', API_BASE_URL);
    
    const queryParams = new URLSearchParams();
    
    // Add query parameters
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.location) queryParams.append('location', params.location);
    if (params.minPrice) queryParams.append('minPrice', params.minPrice.toString());
    if (params.maxPrice) queryParams.append('maxPrice', params.maxPrice.toString());
    if (params.bedrooms) queryParams.append('bedrooms', params.bedrooms.toString());
    if (params.bathrooms) queryParams.append('bathrooms', params.bathrooms.toString());
    if (params.propertyType) queryParams.append('propertyType', params.propertyType);

    const url = `${API_BASE_URL}?${queryParams.toString()}`;
    console.log('🌐 Making request to:', url);

    // Add timeout to the fetch request
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      console.log('⏰ Request timeout - aborting');
      controller.abort();
    }, 15000); // Increased to 15 seconds

    console.log('📡 Sending fetch request...');
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    console.log('📡 Response received. Status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ HTTP error response:', errorText);
      throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
    }

    const responseText = await response.text();
    console.log('📄 Raw response length:', responseText.length);
    console.log('📄 Raw response preview:', responseText.substring(0, 200) + '...');

    let data: any;
    try {
      data = JSON.parse(responseText);
      console.log('✅ JSON parsed successfully');
    } catch (parseError) {
      console.error('❌ Failed to parse JSON response:', parseError);
      console.error('❌ Response text:', responseText);
      throw new Error('Invalid JSON response from server');
    }

    // Handle different response formats
    let properties: Property[] = [];
    
    if (data.success && data.data && data.data.properties) {
      // Expected format: { success: true, data: { properties: [...] } }
      properties = data.data.properties;
      console.log('📋 Using success.data.properties format');
    } else if (data.properties) {
      // Alternative format: { properties: [...] }
      properties = data.properties;
      console.log('📋 Using properties format');
    } else if (data.items && Array.isArray(data.items)) {
      // Your server format: { items: [...], currentPage: 1, totalPages: 1 }
      properties = data.items.map((item: any) => ({
        id: item.id,
        title: item.title,
        price: item.price,
        address: `${item.address}, ${item.city}, ${item.state} ${item.zipCode}`,
        photos: item.images || [],
        location: `${item.city}, ${item.state}`,
        bedrooms: item.bedrooms,
        bathrooms: item.bathrooms,
        propertyType: item.propertyType,
        squareFootage: item.squareFootage,
        yearBuilt: item.yearBuilt,
        status: item.isAvailable ? 'Available' : 'Not Available',
        description: item.description,
        amenities: item.amenities || [],
      }));
      console.log('📋 Using items format (your server format)');
    } else if (Array.isArray(data)) {
      // Direct array format: [...]
      properties = data;
      console.log('📋 Using direct array format');
    } else {
      console.error('❌ Unexpected response format:', data);
      throw new Error('Unexpected response format from server');
    }

    console.log('✅ Properties fetched successfully:', properties.length);
    return properties;
  } catch (error: any) {
    console.error('💥 Error fetching properties:', error);
    console.error('💥 Error type:', typeof error);
    console.error('💥 Error name:', error.name);
    console.error('💥 Error message:', error.message);
    console.error('💥 Error stack:', error.stack);
    
    // Check if it's a network error
    if (error instanceof TypeError && error.message?.includes('Network request failed')) {
      console.log('🌐 Network error detected - server might not be running');
      console.log('🌐 Please check if your server is running on http://localhost:3000');
    } else if (error.name === 'AbortError') {
      console.log('⏰ Request timeout - server might be slow or not responding');
    }
    
    // Fallback to mock data if server is not available
    console.log('🔄 Falling back to mock data');
    return getMockProperties();
  }
}

export async function searchProperties(query: string, filters: {
  page?: number;
  limit?: number;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  bathrooms?: number;
  propertyType?: string;
} = {}): Promise<Property[]> {
  try {
    console.log('Searching properties with query:', query, 'and filters:', filters);
    
    const searchParams = {
      ...filters,
      search: query,
    };

    return await fetchProperties(searchParams);
  } catch (error) {
    console.error('Error searching properties:', error);
    throw error;
  }
}

// Get individual property details using your Postman URL format
export async function getPropertyDetails(propertyId: string): Promise<Property | null> {
  try {
    console.log('🏠 Fetching property details for ID:', propertyId);
    
    const url = `${API_BASE_URL}/${propertyId}`;
    console.log('🌐 Making request to:', url);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      console.log('⏰ Property details request timeout - aborting');
      controller.abort();
    }, 10000);

    console.log('📡 Sending fetch request for property details...');
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    console.log('📡 Property details response received. Status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Property details HTTP error response:', errorText);
      throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
    }

    const responseText = await response.text();
    console.log('📄 Property details raw response length:', responseText.length);
    console.log('📄 Property details raw response preview:', responseText.substring(0, 200) + '...');

    let data: any;
    try {
      data = JSON.parse(responseText);
      console.log('✅ Property details JSON parsed successfully');
    } catch (parseError) {
      console.error('❌ Failed to parse property details JSON response:', parseError);
      console.error('❌ Response text:', responseText);
      throw new Error('Invalid JSON response from server');
    }

    // Handle different response formats for property details
    let property: Property | null = null;
    
    if (data.success && data.data) {
      // Expected format: { success: true, data: { ...property } }
      property = data.data;
      console.log('📋 Using success.data format for property details');
    } else if (data.id) {
      // Direct property format: { id: "...", ... }
      // Convert your server format to app format
      property = {
        id: data.id,
        title: data.title,
        price: data.price,
        address: `${data.address}, ${data.city}, ${data.state} ${data.zipCode}`,
        photos: data.images || [],
        location: `${data.city}, ${data.state}`,
        bedrooms: data.bedrooms,
        bathrooms: data.bathrooms,
        propertyType: data.propertyType,
        squareFootage: data.squareFootage,
        yearBuilt: data.yearBuilt,
        status: data.isAvailable ? 'Available' : 'Not Available',
        description: data.description,
        amenities: data.amenities || [],
      };
      console.log('📋 Using direct property format (converted from your server format)');
    } else {
      console.error('❌ Unexpected property details response format:', data);
      throw new Error('Unexpected response format from server');
    }

    console.log('✅ Property details fetched successfully:', property?.id);
    return property;
  } catch (error: any) {
    console.error('💥 Error fetching property details:', error);
    console.error('💥 Error type:', typeof error);
    console.error('💥 Error name:', error.name);
    console.error('💥 Error message:', error.message);
    console.error('💥 Error stack:', error.stack);
    
    // Check if it's a network error
    if (error instanceof TypeError && error.message?.includes('Network request failed')) {
      console.log('🌐 Network error detected - server might not be running');
      console.log('🌐 Please check if your server is running on http://localhost:3000');
    } else if (error.name === 'AbortError') {
      console.log('⏰ Request timeout - server might be slow or not responding');
    }
    
    throw error;
  }
}



// Mock data fallback
function getMockProperties(): Property[] {
  return [
    {
      id: '1',
      title: 'Modern Downtown Apartment',
      price: 450000,
      address: '123 Main St, Downtown',
      location: 'Downtown',
      bedrooms: 2,
      bathrooms: 2,
      propertyType: 'Apartment',
      squareFootage: 1200,
      yearBuilt: 2020,
      status: 'For Sale',
      description: 'Beautiful modern apartment in the heart of downtown',
      photos: ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400'],
      amenities: ['Pool', 'Gym', 'Parking', 'Balcony'],
    },
    {
      id: '2',
      title: 'Family Home in Suburbs',
      price: 650000,
      address: '456 Oak Ave, Suburbs',
      location: 'Suburbs',
      bedrooms: 3,
      bathrooms: 2,
      propertyType: 'Single Family',
      squareFootage: 1800,
      yearBuilt: 2015,
      status: 'For Sale',
      description: 'Spacious family home with large backyard',
      photos: ['https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400'],
      amenities: ['Garden', 'Garage', 'Fireplace', 'Deck'],
    },
    {
      id: '3',
      title: 'City Center Condo',
      price: 350000,
      address: '789 Pine Rd, City Center',
      location: 'City Center',
      bedrooms: 1,
      bathrooms: 1,
      propertyType: 'Condo',
      squareFootage: 800,
      yearBuilt: 2018,
      status: 'For Sale',
      description: 'Cozy condo perfect for young professionals',
      photos: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400'],
      amenities: ['Doorman', 'Gym', 'Rooftop', 'Storage'],
    },
  ];
}

// Simple server status checker
export async function checkServerStatus(): Promise<{ running: boolean; message: string; suggestions: string[] }> {
  const suggestions: string[] = [];
  
  try {
    console.log('Checking if server is running...');
    
    // Try to connect to the server with a very short timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout

    const response = await fetch(`${API_BASE_URL}?page=1&limit=2`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      return {
        running: true,
        message: '✅ Server is running and responding',
        suggestions: []
      };
    } else {
      suggestions.push('Server is running but returned an error status');
      suggestions.push('Check if your API endpoint is correct');
      suggestions.push('Verify the response format');
      
      return {
        running: true,
        message: `⚠️ Server responded with status: ${response.status}`,
        suggestions
      };
    }
  } catch (error: any) {
    if (error.name === 'AbortError') {
      suggestions.push('Server might be running but is very slow');
      suggestions.push('Try increasing the timeout');
      suggestions.push('Check server logs for performance issues');
      
      return {
        running: false,
        message: '⏰ Server connection timed out',
        suggestions
      };
    } else if (error.message?.includes('Network request failed')) {
      suggestions.push('Server is not running');
      suggestions.push('Start your server with: npm start');
      suggestions.push('Check if server is on port 3000');
      suggestions.push('Verify the correct IP address');
      
      return {
        running: false,
        message: '❌ Server is not reachable',
        suggestions
      };
    } else {
      suggestions.push('Unknown connection error');
      suggestions.push('Check server logs');
      suggestions.push('Verify network configuration');
      
      return {
        running: false,
        message: `❌ Connection error: ${error.message}`,
        suggestions
      };
    }
  }
}