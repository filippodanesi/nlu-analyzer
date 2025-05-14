
import { useState, useEffect } from 'react';
import { toast } from "@/hooks/use-toast";
import { 
  isKeywordInTopPositions, 
  isExactKeywordMatch, 
  isPartialKeywordMatch,
  optimizeTextWithAI
} from '../utils/optimizationUtils';

// Define the keyword status type
export type KeywordStatus = "missing" | "exact" | "partial" | "relevant";

// Define the AI provider type
export type AIProvider = "openai" | "anthropic";

interface UseTextOptimizationProps {
  text: string;
  results: any;
  targetKeywords: string[];
}

export const useTextOptimization = ({ text, results, targetKeywords }: UseTextOptimizationProps) => {
  // AI configuration
  const [apiKey, setApiKey] = useState(() => {
    return sessionStorage.getItem('ai_api_key') || "";
  });
  
  const [aiModel, setAiModel] = useState(() => {
    const savedModel = sessionStorage.getItem('ai_model') || "gpt-4o-mini";
    // Ensure we use the preferred Claude model
    if (savedModel.startsWith("claude-3-")) {
      return "claude-3-7-sonnet-20250219";
    }
    return savedModel;
  });
  
  const [aiProvider, setAiProvider] = useState<AIProvider>(() => {
    const savedModel = sessionStorage.getItem('ai_model') || "gpt-4o-mini";
    return savedModel.startsWith("claude") ? "anthropic" : "openai";
  });

  // CORS proxy configuration
  const [corsProxyUrl, setCorsProxyUrl] = useState(() => {
    return sessionStorage.getItem('cors_proxy_url') || "";
  });

  // Update corsProxyUrl when it changes in sessionStorage
  useEffect(() => {
    const handleStorageChange = () => {
      const newProxyUrl = sessionStorage.getItem('cors_proxy_url') || "";
      setCorsProxyUrl(newProxyUrl);
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Save to sessionStorage when values change
  const storeApiKey = (key: string) => {
    if (key) sessionStorage.setItem('ai_api_key', key);
    setApiKey(key);
  };

  const storeAiModel = (model: string) => {
    if (model) sessionStorage.setItem('ai_model', model);
    setAiModel(model);
    // Update provider based on model
    if (model.startsWith("claude")) {
      setAiProvider("anthropic");
    } else {
      setAiProvider("openai");
    }
  };
  
  // Optimization state
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizedText, setOptimizedText] = useState("");
  
  // Keywords statuses
  const checkKeywordStatus = (keyword: string): KeywordStatus => {
    if (!results || !results.keywords || !keyword) return "missing";
    
    // Look for exact match
    if (results.keywords.some((k: any) => isExactKeywordMatch(k.text, keyword))) {
      // Found an exact match in the keywords
      return "exact";
    }
    
    // Look for partial match
    if (results.keywords.some((k: any) => isPartialKeywordMatch(k.text, keyword))) {
      // Found a partial match in the keywords
      return "partial";
    }
    
    // Check if keyword is in relevant top positions
    if (isKeywordInTopPositions(keyword, results.keywords, 10)) {
      return "relevant";
    }
    
    return "missing";
  };
  
  // Get lists of keywords based on their status
  const keywordsToOptimize = targetKeywords.filter(kw => 
    checkKeywordStatus(kw) === "missing"
  );
  
  const keywordsWithPartialMatch = targetKeywords.filter(kw => 
    checkKeywordStatus(kw) === "partial"
  );
  
  // Check if we need optimization
  const needsOptimization = keywordsToOptimize.length > 0;
  
  // Handle optimize button click
  const handleOptimize = async () => {
    if (!text) {
      toast({
        title: "No text provided",
        description: "Please enter text to optimize.",
        variant: "destructive",
      });
      return;
    }
    
    if (!apiKey) {
      toast({
        title: "API Key required",
        description: "Please enter your API key in the AI Configuration.",
        variant: "destructive",
      });
      return;
    }
    
    setIsOptimizing(true);
    try {
      const optimizedContent = await optimizeTextWithAI(
        text,
        targetKeywords,
        results,
        apiKey,
        aiModel
      );
      
      setOptimizedText(optimizedContent);
      toast({
        title: "Text optimized",
        description: "The text has been optimized for your target keywords.",
      });
    } catch (error) {
      console.error("Error optimizing text:", error);
      toast({
        title: "Optimization failed",
        description: error instanceof Error ? error.message : "An error occurred during optimization.",
        variant: "destructive",
      });
    } finally {
      setIsOptimizing(false);
    }
  };
  
  return {
    // AI configuration
    apiKey,
    setApiKey: storeApiKey,
    aiModel,
    setAiModel: storeAiModel,
    aiProvider,
    setAiProvider,
    corsProxyUrl,
    setCorsProxyUrl,
    
    // Optimization state & actions
    isOptimizing,
    optimizedText,
    handleOptimize,
    
    // Keywords data
    keywordsToOptimize,
    keywordsWithPartialMatch,
    needsOptimization,
    checkKeywordStatus
  };
};
