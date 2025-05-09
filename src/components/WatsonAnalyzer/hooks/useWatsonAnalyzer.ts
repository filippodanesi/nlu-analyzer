
import { useState, useEffect } from 'react';
import { toast } from "@/components/ui/use-toast";
import { calculateTextStats } from '../utils/mockDataUtils';

export interface WatsonFeatures {
  keywords: boolean;
  entities: boolean;
  concepts: boolean;
  relations: boolean;
  categories: boolean;
  classifications: boolean; // Added support for tone analysis
}

export interface WatsonLimits {
  keywords: number;
  entities: number;
  concepts: number;
  categories: number;
}

export interface TextStats {
  wordCount: number;
  sentenceCount: number;
  charCount: number;
}

// Updated environment variable names according to the .env format
const SECRETS = {
  apiKey: process.env.NATURAL_LANGUAGE_UNDERSTANDING_APIKEY || 
          process.env.NATURAL_LANGUAGE_UNDERSTANDING_IAM_APIKEY || "",
  url: process.env.NATURAL_LANGUAGE_UNDERSTANDING_URL || "",
  authType: process.env.NATURAL_LANGUAGE_UNDERSTANDING_AUTH_TYPE || "iam",
  // Extract region from URL if available
  region: (() => {
    const url = process.env.NATURAL_LANGUAGE_UNDERSTANDING_URL || "";
    // Try to extract region from URL (format: https://api.{region}.natural-language-understanding...)
    const match = url.match(/api\.(.*?)\.natural-language-understanding/);
    return match ? match[1] : "eu-de";
  })(),
  instanceId: (() => {
    const url = process.env.NATURAL_LANGUAGE_UNDERSTANDING_URL || "";
    // Try to extract instance ID from URL (format: .../instances/{instanceId}/...)
    const match = url.match(/instances\/(.*?)\//);
    return match ? match[1] : "";
  })(),
  credentialsFileExists: false // Default to false, we'll check in useEffect
};

export const useWatsonAnalyzer = () => {
  // Check if any of the Watson environment variables are present
  const hasWatsonEnvVars = !!(
    process.env.NATURAL_LANGUAGE_UNDERSTANDING_APIKEY || 
    process.env.NATURAL_LANGUAGE_UNDERSTANDING_IAM_APIKEY ||
    process.env.NATURAL_LANGUAGE_UNDERSTANDING_URL
  );
  
  // Secrets usage state - check if environment variables are present
  const [useSecrets, setUseSecrets] = useState(hasWatsonEnvVars);
  
  // API Configuration state
  const [apiKey, setApiKey] = useState("");
  const [url, setUrl] = useState("");
  const [region, setRegion] = useState("eu-de"); // Default to eu-de
  const [instanceId, setInstanceId] = useState("");
  
  // Credentials file state
  const [credentialsFileExists, setCredentialsFileExists] = useState(false);
  
  // Features state
  const [features, setFeatures] = useState<WatsonFeatures>({
    keywords: true,
    entities: true,
    concepts: true,
    relations: false,
    categories: true,
    classifications: false, // Default disabled for tone analysis
  });
  
  // Limits state
  const [limits, setLimits] = useState<WatsonLimits>({
    keywords: 10,
    entities: 10,
    concepts: 5,
    categories: 3,
  });
  
  // Language state
  const [language, setLanguage] = useState("en");
  
  // Tone model state
  const [toneModel, setToneModel] = useState("tone-classifications-en-v1");
  
  // Input state
  const [text, setText] = useState("");
  const [inputMethod, setInputMethod] = useState<"text" | "file">("text");
  const [targetKeywords, setTargetKeywords] = useState("");
  
  // Analysis state
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [textStats, setTextStats] = useState<TextStats>({
    wordCount: 0,
    sentenceCount: 0,
    charCount: 0,
  });

  // Check for ibm-credentials.env file existence
  useEffect(() => {
    const checkCredentialsFile = async () => {
      try {
        // We'll try to fetch the file to check if it exists
        // This is a simple approach that works in browser environments
        const response = await fetch('/ibm-credentials.env', { method: 'HEAD' });
        if (response.ok) {
          setCredentialsFileExists(true);
          setUseSecrets(true); // If file exists, enable secrets by default
        }
      } catch (error) {
        console.log('IBM credentials file not found');
      }
    };
    
    checkCredentialsFile();
  }, []);

  // Set up initial state based on environment variables
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
      // If disabled, reset the fields
      setApiKey("");
      setUrl("");
      setRegion("eu-de");
      setInstanceId("");
    }
  };

  // Update tone model based on selected language
  useEffect(() => {
    // Tone analysis is only available for English and French
    if (language === "en") {
      setToneModel("tone-classifications-en-v1");
    } else if (language === "fr") {
      setToneModel("tone-classifications-fr-v1");
    }
  }, [language]);

  const handleAnalyze = async () => {
    if (!text) {
      toast({
        title: "No text provided",
        description: "Please enter text to analyze.",
        variant: "destructive",
      });
      return;
    }

    // Check credentials (both manual and from secrets)
    const currentApiKey = useSecrets ? SECRETS.apiKey : apiKey;
    const currentUrl = useSecrets ? SECRETS.url : (
      region !== "custom" ? 
        `https://api.${region}.natural-language-understanding.watson.cloud.ibm.com/instances/${instanceId}/v1/analyze?version=2022-04-07` : 
        url
    );

    if (!currentApiKey) {
      toast({
        title: "API Key required",
        description: "Please enter your IBM Watson NLU API key or enable secrets.",
        variant: "destructive",
      });
      return;
    }

    if (!currentUrl) {
      toast({
        title: "URL required",
        description: "Please provide a valid URL for the IBM Watson NLU service.",
        variant: "destructive",
      });
      return;
    }

    // Check for tone analysis - only available for en and fr
    if (features.classifications && language !== "en" && language !== "fr") {
      toast({
        title: "Language not supported",
        description: "Tone analysis is only available for English and French languages.",
        variant: "destructive",
      });
      return;
    }

    // Start analysis
    setIsAnalyzing(true);

    // Calculate text statistics
    const stats = calculateTextStats(text);
    setTextStats(stats);

    // Prepare parameters for API request
    const featuresParams: any = {};
    
    if (features.keywords) {
      featuresParams.keywords = { 
        limit: limits.keywords,
        sentiment: true 
      };
    }
    
    if (features.entities) {
      featuresParams.entities = { 
        limit: limits.entities,
        sentiment: true 
      };
    }
    
    if (features.concepts) {
      featuresParams.concepts = { 
        limit: limits.concepts 
      };
    }
    
    if (features.relations) {
      featuresParams.relations = {};
    }
    
    if (features.categories) {
      featuresParams.categories = { 
        limit: limits.categories 
      };
    }
    
    if (features.classifications) {
      featuresParams.classifications = {
        model: toneModel
      };
    }

    const requestData = {
      text: text,
      features: featuresParams,
      language: language
    };

    try {
      // Determine the authorization method based on environment variables
      const authType = SECRETS.authType || "iam";
      let headers = {
        'Content-Type': 'application/json'
      };
      
      // Add authorization header based on auth type
      if (authType === "iam") {
        headers['Authorization'] = `Basic ${btoa(`apikey:${currentApiKey}`)}`;
      } else {
        headers['Authorization'] = `Bearer ${currentApiKey}`;
      }

      const response = await fetch(currentUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify(requestData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'API request failed');
      }

      const data = await response.json();
      setResults(data);
      
      toast({
        title: "Analysis complete",
        description: "Text has been successfully analyzed.",
      });
    } catch (error) {
      console.error('Error analyzing text:', error);
      toast({
        title: "Analysis failed",
        description: error instanceof Error ? error.message : "An error occurred during analysis.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Process target keywords into an array
  const getTargetKeywordsList = () => {
    return targetKeywords
      .split(',')
      .map(kw => kw.trim())
      .filter(Boolean);
  };

  return {
    // Secrets state
    useSecrets,
    setUseSecrets: handleUseSecretsChange,
    credentialsFileExists,
    
    // API Configuration
    apiKey,
    setApiKey,
    url,
    setUrl,
    region,
    setRegion,
    instanceId,
    setInstanceId,
    
    // Features and limits
    features,
    setFeatures,
    limits,
    setLimits,
    
    // Language
    language,
    setLanguage,
    
    // Tone model
    toneModel,
    setToneModel,
    
    // Input
    text,
    setText,
    inputMethod,
    setInputMethod,
    targetKeywords,
    setTargetKeywords,
    
    // Analysis
    isAnalyzing,
    results,
    textStats,
    
    // Actions
    handleAnalyze,
    getTargetKeywordsList,
  };
};
