
import { useState } from 'react';
import { toast } from "@/components/ui/use-toast";
import { calculateTextStats, generateMockResponse } from '../utils/mockDataUtils';

export interface WatsonFeatures {
  keywords: boolean;
  entities: boolean;
  concepts: boolean;
  relations: boolean;
  categories: boolean;
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

export const useWatsonAnalyzer = () => {
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

  const handleAnalyze = () => {
    if (!text) {
      toast({
        title: "No text provided",
        description: "Please enter text to analyze.",
        variant: "destructive",
      });
      return;
    }

    if (!apiKey && region !== "custom") {
      toast({
        title: "API Key required",
        description: "Please enter your IBM Watson NLU API Key.",
        variant: "destructive",
      });
      return;
    }

    // Start analysis
    setIsAnalyzing(true);

    // Calculate text statistics
    const stats = calculateTextStats(text);
    setTextStats(stats);

    // In a real implementation, you would call the IBM Watson API here
    // For now, let's mock the API call with a timeout and sample data
    setTimeout(() => {
      const mockResponse = generateMockResponse(text, features, language);
      setResults(mockResponse);
      setIsAnalyzing(false);
      
      toast({
        title: "Analysis complete",
        description: "Text has been successfully analyzed.",
      });
    }, 2000);
  };

  // Process target keywords into an array
  const getTargetKeywordsList = () => {
    return targetKeywords
      .split(',')
      .map(kw => kw.trim())
      .filter(Boolean);
  };

  return {
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
