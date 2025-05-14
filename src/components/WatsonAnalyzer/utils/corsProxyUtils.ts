
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
      // Use the permanent production API key
      "x-cors-api-key": "live_0df03e15b7f1bdf27d12ee406841eed5866d880e2dec98dd37db703033e23734",
      // Add additional required headers for CORS requests
      "Origin": window.location.origin,
      "Access-Control-Request-Method": "GET,POST,OPTIONS",
      "Access-Control-Request-Headers": "Content-Type,Authorization"
    };
  }
  
  // No special headers for other proxies
  return {};
};

/**
 * Creates a fetch function with CORS proxy support and fallbacks
 * @param baseUrl The original API URL to call
 * @param options Fetch options
 * @returns Promise with response
 */
export const fetchWithCorsProxy = async (
  baseUrl: string,
  options: RequestInit = {}
): Promise<Response> => {
  const corsProxyUrl = getCorsProxyUrl();
  const proxiedUrl = makeProxiedUrl(baseUrl, corsProxyUrl);
  const proxyHeaders = getCorsProxyHeaders(corsProxyUrl);
  
  // Merge headers
  const headers = {
    ...options.headers,
    ...proxyHeaders
  };

  try {
    // First attempt with the CORS proxy
    const response = await fetch(proxiedUrl, {
      ...options,
      headers
    });
    
    if (response.ok) {
      return response;
    }
    
    // If the response is not OK, throw to try fallback
    throw new Error(`CORS proxy request failed with status: ${response.status}`);
  } catch (error) {
    console.error("CORS proxy request failed:", error);
    
    // Fallback to no-cors mode
    if (options.method === "GET" || !options.method) {
      console.log("Attempting no-cors fallback for GET request");
      return fetch(proxiedUrl, {
        ...options,
        headers,
        mode: "no-cors"
      });
    }
    
    // For non-GET requests, we need a different approach
    // Try with a different CORS proxy as fallback
    const fallbackProxies = [
      "https://corsproxy.io/?",
      "https://api.allorigins.win/raw?url="
    ];
    
    for (const fallbackProxy of fallbackProxies) {
      try {
        const fallbackUrl = makeProxiedUrl(baseUrl, fallbackProxy);
        console.log(`Trying fallback CORS proxy: ${fallbackProxy}`);
        
        const response = await fetch(fallbackUrl, {
          ...options,
          headers: options.headers // Use original headers, not proxy-specific ones
        });
        
        if (response.ok) {
          return response;
        }
      } catch (innerError) {
        console.error(`Fallback proxy ${fallbackProxy} failed:`, innerError);
      }
    }
    
    // If all fallbacks fail, throw the original error
    throw error;
  }
};
