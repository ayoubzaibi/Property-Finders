const getApiBaseUrl = () => {
  if (process.env.EXPO_PUBLIC_API_URL) return process.env.EXPO_PUBLIC_API_URL;
  if (__DEV__) return "http://10.205.9.64:3000/api/v1/properties";
  return "http://localhost:3000/api/v1/properties";
};
const API_BASE_URL = getApiBaseUrl();

async function fetchWithTimeout(
  url: string,
  options: RequestInit = {},
  timeout = 10000
): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(id);
    return response;
  } catch (err) {
    clearTimeout(id);
    throw err;
  }
}

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

const devLog = (...args: any[]) => {
  if (__DEV__) console.log(...args);
};

export async function testServerConnection(): Promise<{
  success: boolean;
  message: string;
  url: string;
}> {
  try {
    devLog("🧪 Testing server connection to:", API_BASE_URL);
    const healthUrl = `${API_BASE_URL.replace(
      "/api/v1/properties",
      ""
    )}/health`;
    try {
      await fetchWithTimeout(healthUrl, { method: "GET" }, 3000);
    } catch {}
    const response = await fetchWithTimeout(
      `${API_BASE_URL}?page=1&limit=2`,
      { method: "GET", headers: { Accept: "application/json" } },
      5000
    );
    if (response.ok) {
      return {
        success: true,
        message: `Server is reachable (${response.status})`,
        url: API_BASE_URL,
      };
    } else {
      return {
        success: false,
        message: `Server responded with status: ${response.status}`,
        url: API_BASE_URL,
      };
    }
  } catch (error: any) {
    let message = "Unknown error";
    if (
      error instanceof TypeError &&
      error.message?.includes("Network request failed")
    )
      message =
        "Network error - server might not be running or wrong IP address";
    else if (error.name === "AbortError")
      message = "Request timeout - server is not responding";
    else message = error.message || "Connection failed";
    return { success: false, message, url: API_BASE_URL };
  }
}

export async function findWorkingServer(): Promise<{
  success: boolean;
  workingUrl: string | null;
  message: string;
}> {
  const testUrls = [
    process.env.EXPO_PUBLIC_API_URL,
    "http://192.168.242.142:3000/api/v1/properties",
    "http://localhost:3000/api/v1/properties",
    "http://127.0.0.1:3000/api/v1/properties",
    "http://10.0.2.2:3000/api/v1/properties",
  ].filter(Boolean) as string[];
  for (const url of testUrls) {
    try {
      const response = await fetchWithTimeout(
        `${url}?page=1&limit=2`,
        { method: "GET", headers: { Accept: "application/json" } },
        4000
      );
      if (response.ok)
        return {
          success: true,
          workingUrl: url,
          message: `Found working server at: ${url}`,
        };
    } catch {}
  }
  return {
    success: false,
    workingUrl: null,
    message:
      "No working server found. Please check if your server is running on port 3000.",
  };
}

function parsePropertiesResponse(data: any): Property[] {
  if (data.success && data.data && data.data.properties)
    return data.data.properties.map((item: any) => ({
      ...item,
      photos: item.images || [],
    }));
  if (data.properties)
    return data.properties.map((item: any) => ({
      ...item,
      photos: item.images || [],
    }));
  if (data.items && Array.isArray(data.items)) {
    return data.items.map((item: any) => ({
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
      status: item.isAvailable ? "Available" : "Not Available",
      description: item.description,
      amenities: item.amenities || [],
    }));
  }
  if (Array.isArray(data)) {
    return data.map((item: any) => ({
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
      status: item.isAvailable ? "Available" : "Not Available",
      description: item.description,
      amenities: item.amenities || [],
    }));
  }
  throw new Error("Unexpected response format from server");
}

export async function fetchProperties(
  params: {
    page?: number;
    limit?: number;
    location?: string;
    minPrice?: number;
    maxPrice?: number;
    bedrooms?: number;
    bathrooms?: number;
    propertyType?: string;
    search?: string;
  } = {}
): Promise<Property[]> {
  try {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append("page", params.page.toString());
    if (params.limit) queryParams.append("limit", params.limit.toString());
    if (params.location) queryParams.append("location", params.location);
    if (params.minPrice)
      queryParams.append("minPrice", params.minPrice.toString());
    if (params.maxPrice)
      queryParams.append("maxPrice", params.maxPrice.toString());
    if (params.bedrooms)
      queryParams.append("bedrooms", params.bedrooms.toString());
    if (params.bathrooms)
      queryParams.append("bathrooms", params.bathrooms.toString());
    if (params.propertyType)
      queryParams.append("propertyType", params.propertyType);
    if (params.search) queryParams.append("search", params.search);
    const url = `${API_BASE_URL}?${queryParams.toString()}`;
    const response = await fetchWithTimeout(
      url,
      { method: "GET", headers: { Accept: "application/json" } },
      15000
    );
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    return parsePropertiesResponse(data);
  } catch (error: any) {
    devLog("💥 Error fetching properties:", error);
    return [];
  }
}

export  async function searchProperties(
  query: string,
  filters: {
    page?: number;
    limit?: number;
    minPrice?: number;
    maxPrice?: number;
    bedrooms?: number;
    bathrooms?: number;
    propertyType?: string;
  } = {}
): Promise<Property[]> {
  return [];
} 

export async function getPropertyDetails(
  propertyId: string
): Promise<Property | null> {
  try {
    const url = `${API_BASE_URL}/${propertyId}`;
    const response = await fetchWithTimeout(
      url,
      { method: "GET", headers: { Accept: "application/json" } },
      10000
    );
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    if (data.success && data.data) return data.data;
    if (data.id) {
      return {
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
        status: data.isAvailable ? "Available" : "Not Available",
        description: data.description,
        amenities: data.amenities || [],
      };
    }
    throw new Error("Unexpected response format from server");
  } catch (error: any) {
    devLog("💥 Error fetching property details:", error);
    return null;
  }
}


export async function checkServerStatus(): Promise<{
  running: boolean;
  message: string;
  suggestions: string[];
}> {
  const suggestions: string[] = [];
  try {
    const response = await fetchWithTimeout(
      `${API_BASE_URL}?page=1&limit=2`,
      { method: "GET", headers: { Accept: "application/json" } },
      3000
    );
    if (response.ok)
      return { running: true, message: "Server is running", suggestions };
    return {
      running: false,
      message: `Server responded with status: ${response.status}`,
      suggestions,
    };
  } catch (error: any) {
    suggestions.push("Check if your server is running and accessible.");
    return {
      running: false,
      message: error.message || "Unknown error",
      suggestions,
    };
  }
}
