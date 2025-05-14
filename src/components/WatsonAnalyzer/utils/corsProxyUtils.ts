
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
  
  // For all environments, use cors.sh as default with permanent API key
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
      "x-cors-api-key": "live_0df03e15b7f1bdf27d12ee406841eed5866d880e2dec98dd37db703033e23734" // Permanent production API key
    };
  }
  
  // No special headers for other proxies
  return {};
};
