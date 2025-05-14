
/**
 * Utility functions for handling CORS proxies
 */

/**
 * Get CORS proxy URL based on environment and stored settings
 */
export const getCorsProxyUrl = (): string => {
  // First check if a custom CORS proxy URL is stored in sessionStorage
  const storedProxyUrl = sessionStorage.getItem('cors_proxy_url');
  if (storedProxyUrl) {
    return storedProxyUrl;
  }
  
  // For all environments, use cors.sh as default with temp API key
  // The key is valid for 3 days and needs to be replaced with a permanent one
  return "https://proxy.cors.sh/";
};

/**
 * Make URL compatible with CORS proxy
 */
export const makeProxiedUrl = (url: string, corsProxyUrl: string): string => {
  // Handle different proxy formats
  if (corsProxyUrl.includes("?url=")) {
    return `${corsProxyUrl}${encodeURIComponent(url)}`;
  } else {
    return `${corsProxyUrl}${url}`;
  }
};

/**
 * Get CORS proxy headers needed for the request
 */
export const getCorsProxyHeaders = (corsProxyUrl: string): Record<string, string> => {
  // Check if we're using cors.sh
  if (corsProxyUrl.includes("cors.sh")) {
    return {
      "x-cors-api-key": "temp_3a4e8e881b300eba61b37720fbccf3d0" // Temporary key valid for 3 days
    };
  }
  
  // No special headers for other proxies
  return {};
};
