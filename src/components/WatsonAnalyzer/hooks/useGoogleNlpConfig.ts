
import { useState, useEffect } from 'react';

// Storage keys
const SESSION_STORAGE_KEYS = {
  API_KEY: 'google_nlp_api_key',
};

export const useGoogleNlpConfig = () => {
  // API configuration
  const [apiKey, setApiKey] = useState(() => {
    return sessionStorage.getItem(SESSION_STORAGE_KEYS.API_KEY) || "";
  });

  // Save to sessionStorage when values change
  useEffect(() => {
    if (apiKey) sessionStorage.setItem(SESSION_STORAGE_KEYS.API_KEY, apiKey);
  }, [apiKey]);
  
  // Return values that will be used by the component
  return {
    // API configuration
    apiKey,
    setApiKey,
    
    // Utility functions
    getCurrentApiKey: () => apiKey,
  };
};
