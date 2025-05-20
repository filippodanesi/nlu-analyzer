
import { useState, useEffect } from 'react';

// Storage keys
const SESSION_STORAGE_KEYS = {
  API_KEY: 'google_nlp_api_key',
  NLP_MODEL: 'google_nlp_model',
};

export const useGoogleNlpConfig = () => {
  // API configuration
  const [apiKey, setApiKey] = useState(() => {
    return sessionStorage.getItem(SESSION_STORAGE_KEYS.API_KEY) || "";
  });
  
  // NLP Model configuration
  const [nlpModel, setNlpModel] = useState(() => {
    return sessionStorage.getItem(SESSION_STORAGE_KEYS.NLP_MODEL) || "default";
  });

  // Save to sessionStorage when values change
  useEffect(() => {
    if (apiKey) sessionStorage.setItem(SESSION_STORAGE_KEYS.API_KEY, apiKey);
    if (nlpModel) sessionStorage.setItem(SESSION_STORAGE_KEYS.NLP_MODEL, nlpModel);
  }, [apiKey, nlpModel]);
  
  // Return values that will be used by the component
  return {
    // API configuration
    apiKey,
    setApiKey,
    
    // Model configuration
    nlpModel,
    setNlpModel,
    
    // Utility functions
    getCurrentApiKey: () => apiKey,
    getCurrentNlpModel: () => nlpModel,
  };
};
