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
  apiKey: (import.meta.env as WatsonEnvVars).VITE_NATURAL_LANGUAGE_UNDERSTANDING_APIKEY || 
          (import.meta.env as WatsonEnvVars).NATURAL_LANGUAGE_UNDERSTANDING_APIKEY ||
          (import.meta.env as WatsonEnvVars).VITE_NATURAL_LANGUAGE_UNDERSTANDING_IAM_APIKEY || 
          (import.meta.env as WatsonEnvVars).NATURAL_LANGUAGE_UNDERSTANDING_IAM_APIKEY || "",
  url: (import.meta.env as WatsonEnvVars).VITE_NATURAL_LANGUAGE_UNDERSTANDING_URL || 
       (import.meta.env as WatsonEnvVars).NATURAL_LANGUAGE_UNDERSTANDING_URL || "",
  authType: (import.meta.env as WatsonEnvVars).VITE_NATURAL_LANGUAGE_UNDERSTANDING_AUTH_TYPE || 
            (import.meta.env as WatsonEnvVars).NATURAL_LANGUAGE_UNDERSTANDING_AUTH_TYPE || "iam",
  // Extract region from URL if available
  region: (() => {
    const url = (import.meta.env as WatsonEnvVars).VITE_NATURAL_LANGUAGE_UNDERSTANDING_URL || 
                (import.meta.env as WatsonEnvVars).NATURAL_LANGUAGE_UNDERSTANDING_URL || "";
    // Try to extract region from URL (format: https://api.{region}.natural-language-understanding...)
    const match = url.match(/api\.(.*?)\.natural-language-understanding/);
    return match ? match[1] : "eu-de";
  })(),
  instanceId: (() => {
    const url = (import.meta.env as WatsonEnvVars).VITE_NATURAL_LANGUAGE_UNDERSTANDING_URL || 
                (import.meta.env as WatsonEnvVars).NATURAL_LANGUAGE_UNDERSTANDING_URL || "";
    // Try to extract instance ID from URL (format: .../instances/{instanceId}/...)
    const match = url.match(/instances\/(.*?)\//);
    return match ? match[1] : "";
  })(),
  credentialsFileExists: false // Default to false, we'll check in useEffect
};

export const useCredentialsConfig = () => {
  // Debug: check which variables are available
  useEffect(() => {
    console.log('Environment variables check:');
    console.log('VITE_APIKEY:', !!import.meta.env.VITE_NATURAL_LANGUAGE_UNDERSTANDING_APIKEY);
    console.log('VITE_IAM_APIKEY:', !!import.meta.env.VITE_NATURAL_LANGUAGE_UNDERSTANDING_IAM_APIKEY);
    console.log('VITE_URL:', !!import.meta.env.VITE_NATURAL_LANGUAGE_UNDERSTANDING_URL);
    console.log('VITE_AUTH_TYPE:', !!import.meta.env.VITE_NATURAL_LANGUAGE_UNDERSTANDING_AUTH_TYPE);
  }, []);

  // Check if Watson environment variables are present
  const hasWatsonEnvVars = !!(
    import.meta.env.VITE_NATURAL_LANGUAGE_UNDERSTANDING_APIKEY || 
    import.meta.env.VITE_NATURAL_LANGUAGE_UNDERSTANDING_IAM_APIKEY ||
    import.meta.env.VITE_NATURAL_LANGUAGE_UNDERSTANDING_URL
  );
  
  // State for using secrets - check if environment variables are present
  const [useSecrets, setUseSecrets] = useState(hasWatsonEnvVars);
  
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
          setUseSecrets(true); // If file exists, enable secrets by default
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

  // Set initial state based on environment variables
  useEffect(() => {
    if (useSecrets && hasWatsonEnvVars) {
      setApiKey(SECRETS.apiKey);
      setUrl(SECRETS.url);
      setRegion(SECRETS.region);
      setInstanceId(SECRETS.instanceId);
    }
  }, [useSecrets, hasWatsonEnvVars]);

  // Handle secrets toggle
  const handleUseSecretsChange = (value: boolean) => {
    setUseSecrets(value);
    
    // If enabled, use credentials from secrets
    if (value && hasWatsonEnvVars) {
      setApiKey(SECRETS.apiKey);
      setUrl(SECRETS.url);
      setRegion(SECRETS.region);
      setInstanceId(SECRETS.instanceId);
    } else {
      // If disabled, reset fields
      setApiKey("");
      setUrl("");
      setRegion("eu-de");
      setInstanceId("");
    }
  };
  
  // Return values that will be used by the component
  return {
    // Secrets state
    useSecrets,
    setUseSecrets: handleUseSecretsChange,
    credentialsFileExists,
    hasWatsonEnvVars,
    
    // API configuration
    apiKey,
    setApiKey,
    url,
    setUrl,
    region,
    setRegion,
    instanceId,
    setInstanceId,
    
    // Utility functions
    getCurrentApiKey: () => useSecrets ? SECRETS.apiKey : apiKey,
    getCurrentUrl: () => {
      if (useSecrets) return SECRETS.url;
      return region !== "custom" ? 
        `https://api.${region}.natural-language-understanding.watson.cloud.ibm.com/instances/${instanceId}/v1/analyze?version=2022-04-07` : 
        url;
    },
    getAuthType: () => SECRETS.authType || "iam"
  };
};
