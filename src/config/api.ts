// API Configuration
export const API_CONFIG = {
  // Base API URL - falls back to localhost for development
  BASE_URL: process.env.REACT_APP_API_URL || "http://localhost:4000",

  // Environment
  ENVIRONMENT: process.env.REACT_APP_ENVIRONMENT || "development",

  // External API Keys
  OPENWEATHER_API_KEY: process.env.REACT_APP_OPENWEATHER_API_KEY,
  GOOGLE_PLACES_API_KEY: process.env.REACT_APP_GOOGLE_PLACES_API_KEY,

  // Site Configuration
  SITE_NAME: process.env.REACT_APP_SITE_NAME || "Tampa Blades",
  SITE_DESCRIPTION:
    process.env.REACT_APP_SITE_DESCRIPTION || "Skate Community Platform",
} as const;

// API Endpoints
export const API_ENDPOINTS = {
  // Auth endpoints
  LOGIN: `${API_CONFIG.BASE_URL}/api/login`,
  REGISTER: `${API_CONFIG.BASE_URL}/api/register`,
  ME: `${API_CONFIG.BASE_URL}/api/me`,

  // Events endpoints
  EVENTS: `${API_CONFIG.BASE_URL}/api/events`,
  EVENTS_PENDING: `${API_CONFIG.BASE_URL}/api/events/pending`,

  // Gallery endpoints
  GALLERY_PHOTOS: `${API_CONFIG.BASE_URL}/api/gallery/photos`,
  GALLERY_MY_PHOTOS: `${API_CONFIG.BASE_URL}/api/gallery/photos/my`,

  // Messages endpoints
  MESSAGES: `${API_CONFIG.BASE_URL}/api/messages`,

  // Skate spots endpoints
  SKATE_SPOTS: `${API_CONFIG.BASE_URL}/api/skate-spots`,
  SKATE_SPOTS_PENDING: `${API_CONFIG.BASE_URL}/api/skate-spots/pending`,

  // Admin endpoints
  ADMIN_USERS: `${API_CONFIG.BASE_URL}/api/admin/users`,
  ADMIN_STATS: `${API_CONFIG.BASE_URL}/api/admin/stats`,
  ADMIN_LOGS: `${API_CONFIG.BASE_URL}/api/admin/logs`,

  // Search endpoints
  SEARCH_LOCATION: `${API_CONFIG.BASE_URL}/api/search-location`,
  NEARBY_PLACES: `${API_CONFIG.BASE_URL}/api/nearby-places`,
  AUTOCOMPLETE: `${API_CONFIG.BASE_URL}/api/autocomplete`,
};

// Helper function to build API URLs
export const buildApiUrl = (
  endpoint: string,
  params?: Record<string, string>
): string => {
  const url = `${API_CONFIG.BASE_URL}${endpoint}`;
  if (params) {
    const searchParams = new URLSearchParams(params);
    return `${url}?${searchParams}`;
  }
  return url;
};

// Helper function to build media URLs (for uploaded files)
export const buildMediaUrl = (path: string): string => {
  if (path.startsWith("http")) {
    return path; // Already a full URL
  }
  return `${API_CONFIG.BASE_URL}${path}`;
};

// HTTP helper functions with better error handling
export const apiRequest = async (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem("token");

  const defaultHeaders: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token) {
    defaultHeaders.Authorization = `Bearer ${token}`;
  }

  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);

    // Handle authentication errors
    if (response.status === 401) {
      localStorage.removeItem("token");
      // Optionally redirect to login
      if (API_CONFIG.ENVIRONMENT === "production") {
        window.location.href = "/login";
      }
      throw new Error("Authentication failed");
    }

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ error: "Request failed" }));
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }

    return response;
  } catch (error) {
    console.error("API Request failed:", error);
    throw error;
  }
};

export default API_CONFIG;
