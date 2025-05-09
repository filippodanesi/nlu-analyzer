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

// Default credentials for secrets (in a real app, these would come from environment variables)
const SECRETS = {
  apiKey: process.env.WATSON_API_KEY || "",
  region: process.env.WATSON_REGION || "us-south",
  instanceId: process.env.WATSON_INSTANCE_ID || "",
};

export const useWatsonAnalyzer = () => {
  // Secrets usage state
  const [useSecrets, setUseSecrets] = useState(false);
  
  // API Configuration state
  const [apiKey, setApiKey] = useState("");
  const [url, setUrl] = useState("");
  const [region, setRegion] = useState("us-south");
  const [instanceId, setInstanceId] = useState("");
  
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

  // Handle secrets toggle
  const handleUseSecretsChange = (value: boolean) => {
    setUseSecrets(value);
    
    // If enabled, use credentials from secrets
    if (value) {
      setApiKey(SECRETS.apiKey);
      setRegion(SECRETS.region);
      setInstanceId(SECRETS.instanceId);
    } else {
      // If disabled, reset the fields
      setApiKey("");
      setRegion("us-south");
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
    const currentRegion = useSecrets ? SECRETS.region : region;
    const currentInstanceId = useSecrets ? SECRETS.instanceId : instanceId;

    if (!currentApiKey && currentRegion !== "custom") {
      toast({
        title: "API Key required",
        description: "Please enter your IBM Watson NLU API key or enable secrets.",
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

    // Build API URL
    let apiUrl = url;
    if (currentRegion !== "custom") {
      apiUrl = `https://api.${currentRegion}.natural-language-understanding.watson.cloud.ibm.com/instances/${currentInstanceId}/v1/analyze?version=2022-04-07`;
    }

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
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${btoa(`apikey:${currentApiKey}`)}`
        },
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
