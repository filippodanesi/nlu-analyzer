import { useState, useEffect } from 'react';
import { toast } from "@/components/ui/use-toast";

// Define types for our environment variables
interface WatsonEnvVars {
  VITE_NATURAL_LANGUAGE_UNDERSTANDING_APIKEY?: string;
  VITE_NATURAL_LANGUAGE_UNDERSTANDING_IAM_APIKEY?: string;
  VITE_NATURAL_LANGUAGE_UNDERSTANDING_URL?: string;
  VITE_NATURAL_LANGUAGE_UNDERSTANDING_AUTH_TYPE?: string;
  NATURAL_LANGUAGE_UNDERSTANDING_APIKEY?: string;
  NATURAL_LANGUAGE_UNDERSTANDING_IAM_APIKEY?: string;
  NATURAL_LANGUAGE_UNDERSTANDING_URL?: string;
  NATURAL_LANGUAGE_UNDERSTANDING_AUTH_TYPE?: string;
}

// Extract environment variables for Watson - support both formats
export const SECRETS = {
  apiKey: "",
  url: "",
  authType: "iam",
  region: "eu-de",
  instanceId: "",
  credentialsFileExists: false // Default to false, we'll check in useEffect
};

export const useCredentialsConfig = () => {
  // API configuration
  const [apiKey, setApiKey] = useState("");
  const [url, setUrl] = useState("");
  const [region, setRegion] = useState("eu-de"); // Default to eu-de
  const [instanceId, setInstanceId] = useState("");
  
  // Credentials file state
  const [credentialsFileExists, setCredentialsFileExists] = useState(false);

  // Check if ibm-credentials.env file exists
  useEffect(() => {
    const checkCredentialsFile = async () => {
      try {
        // Try to fetch the file to check if it exists
        const response = await fetch('/ibm-credentials.env', { method: 'HEAD' });
        if (response.ok) {
          setCredentialsFileExists(true);
          toast({
            title: "IBM credentials file found",
            description: "The ibm-credentials.env file was detected and will be used for authentication.",
          });
        }
      } catch (error) {
        console.log('IBM credentials file not found');
      }
    };
    
    checkCredentialsFile();
  }, []);
  
  // Return values that will be used by the component
  return {
    // API configuration
    apiKey,
    setApiKey,
    url,
    setUrl,
    region,
    setRegion,
    instanceId,
    setInstanceId,
    credentialsFileExists,
    
    // Utility functions
    getCurrentApiKey: () => apiKey,
    getCurrentUrl: () => {
      return region !== "custom" ? 
        `https://api.${region}.natural-language-understanding.watson.cloud.ibm.com/instances/${instanceId}/v1/analyze?version=2022-04-07` : 
        url;
    },
    getAuthType: () => "iam"
  };
};
