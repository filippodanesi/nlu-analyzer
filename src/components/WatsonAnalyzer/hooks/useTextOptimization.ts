
import { useState, useEffect } from 'react';
import { toast } from "@/hooks/use-toast";
import { 
  isKeywordInTopPositions, 
  isExactKeywordMatch, 
  isPartialKeywordMatch,
  optimizeTextWithAI
} from '../utils/optimizationUtils';
import { useCostTracker } from './useCostTracker';

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
  // Cost tracker
  const costTracker = useCostTracker();
  
  // Last optimization cost record
  const [lastCostRecord, setLastCostRecord] = useState<any>(null);
  
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
  // Add a state to store optimized results for keyword checking
  const [optimizedResults, setOptimizedResults] = useState<any>(null);
  
  // Keywords statuses
  const checkKeywordStatus = (keyword: string, resultsToUse = results): KeywordStatus => {
    if (!resultsToUse || !resultsToUse.keywords || !keyword) return "missing";
    
    // Log the results we're using to check keywords
    console.log("Checking keyword status for:", keyword);
    console.log("Using results:", resultsToUse.keywords ? 
      `${resultsToUse.keywords.length} keywords found` : "No keywords in results");
    
    // Look for exact match
    if (resultsToUse.keywords.some((k: any) => isExactKeywordMatch(k.text, keyword))) {
      // Found an exact match in the keywords
      console.log(`Found exact match for keyword "${keyword}"`);
      return "exact";
    }
    
    // Look for partial match
    if (resultsToUse.keywords.some((k: any) => isPartialKeywordMatch(k.text, keyword))) {
      // Found a partial match in the keywords
      console.log(`Found partial match for keyword "${keyword}"`);
      return "partial";
    }
    
    // Additional check - just look for the keyword as a substring (case insensitive)
    const lowerKeyword = keyword.toLowerCase().trim();
    if (resultsToUse.keywords.some((k: any) => 
      k.text.toLowerCase().trim().includes(lowerKeyword) || 
      lowerKeyword.includes(k.text.toLowerCase().trim())
    )) {
      console.log(`Found substring match for keyword "${keyword}"`);
      return "partial";
    }
    
    // Check if keyword is in relevant top positions
    if (isKeywordInTopPositions(keyword, resultsToUse.keywords, 10)) {
      console.log(`Found relevant match for keyword "${keyword}"`);
      return "relevant";
    }
    
    console.log(`No match found for keyword "${keyword}"`);
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
  
  // Mock analysis for optimized text to check keywords
  const mockAnalysisForKeywords = (optimizedContent: string) => {
    // Create a simple mock result with keywords from the text
    // This helps us visually show the keywords in the optimized text
    const mockResults = { ...results };
    
    // Extract all phrases from the optimized content
    const words = optimizedContent.split(/\s+/);
    const mockKeywords = [];

    // Add target keywords that are exactly present in the optimized text
    for (const keyword of targetKeywords) {
      const lowerKeyword = keyword.toLowerCase().trim();
      const lowerContent = optimizedContent.toLowerCase();
      
      if (lowerContent.includes(lowerKeyword)) {
        mockKeywords.push({
          text: keyword,
          relevance: 0.95,
          count: 1
        });
      }
    }
    
    // Now add other potential keywords from the text
    for (let i = 0; i < words.length; i++) {
      // Create 1-3 word phrases
      for (let j = 1; j <= 3; j++) {
        if (i + j <= words.length) {
          const phrase = words.slice(i, i + j).join(" ");
          
          // Skip very short phrases and those we already added
          if (phrase.length < 3 || mockKeywords.some(k => k.text.toLowerCase() === phrase.toLowerCase())) {
            continue;
          }
          
          mockKeywords.push({
            text: phrase,
            relevance: 0.7 - (0.1 * j), // Longer phrases get slightly lower relevance
            count: 1
          });
        }
      }
    }
    
    // Sort by relevance and take top 15
    mockResults.keywords = mockKeywords
      .sort((a, b) => b.relevance - a.relevance)
      .slice(0, 15);
    
    return mockResults;
  };
  
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

    // Validate API key format
    if (aiProvider === "anthropic" && !apiKey.startsWith("sk-ant-") && !apiKey.startsWith("sk-")) {
      toast({
        title: "API Key format warning",
        description: "Claude API keys typically start with 'sk-ant-'. Your key may not be valid.",
        variant: "warning",
      });
    } else if (aiProvider === "openai" && !apiKey.startsWith("sk-")) {
      toast({
        title: "API Key format warning",
        description: "OpenAI API keys typically start with 'sk-'. Your key may not be valid.",
        variant: "warning",
      });
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
      
      // Create analysis results for the optimized text to check keywords
      const mockResults = mockAnalysisForKeywords(optimizedContent);
      setOptimizedResults(mockResults);
      console.log("Created mock results for optimized text:", mockResults);
      
      // Track the cost of this optimization
      const costRecord = costTracker.trackOperation(aiModel, text, optimizedContent);
      setLastCostRecord(costRecord);
      
      const remainingBudget = costTracker.remainingBudget[aiProvider];
      
      toast({
        title: "Text optimized",
        description: `The text has been optimized for your target keywords. Cost: $${costRecord?.estimatedCost.toFixed(5) || '0.00'}, Remaining budget: $${remainingBudget.toFixed(2)}`,
      });
    } catch (error) {
      console.error("Error optimizing text:", error);
      
      // Provide more specific error messages
      let errorMessage = error instanceof Error ? error.message : "An error occurred during optimization.";
      
      // Add specific suggestions for common errors
      if (errorMessage.includes("401") || errorMessage.includes("authentication") || errorMessage.includes("invalid")) {
        errorMessage = "Authentication failed. Please check your API key in the AI Configuration.";
      } else if (errorMessage.includes("CORS")) {
        errorMessage = "CORS error detected. Try using a different CORS proxy in settings or switch to OpenAI.";
      }
      
      toast({
        title: "Optimization failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsOptimizing(false);
    }
  };
  
  return {
    // Cost tracking
    costTracker,
    lastCostRecord,
    
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
    optimizedResults,
    handleOptimize,
    
    // Keywords data
    keywordsToOptimize,
    keywordsWithPartialMatch,
    needsOptimization,
    checkKeywordStatus
  };
};

