
import { useState } from 'react';
import { toast } from "@/hooks/use-toast";
import { optimizeTextWithAI } from "../utils/optimizationUtils";
import { 
  isExactKeywordMatch, 
  isPartialKeywordMatch 
} from "../utils/optimizationUtils";

interface UseTextOptimizationProps {
  text: string;
  results: any;
  targetKeywords: string[];
}

interface KeywordStatus {
  exact: boolean;
  partial: boolean;
}

export const useTextOptimization = ({ text, results, targetKeywords }: UseTextOptimizationProps) => {
  const [apiKey, setApiKey] = useState<string>("");
  const [aiModel, setAiModel] = useState<string>("gpt-4o-mini");
  const [isOptimizing, setIsOptimizing] = useState<boolean>(false);
  const [optimizedText, setOptimizedText] = useState<string>("");
  
  // Check keyword status
  const checkKeywordStatus = (keyword: string): KeywordStatus => {
    if (!results || !results.keywords) return { exact: false, partial: false };
    
    // Check for exact matches first
    const exactMatch = results.keywords.some(kw => isExactKeywordMatch(kw.text, keyword));
    if (exactMatch) return { exact: true, partial: false };
    
    // If no exact match, check for partial matches
    const partialMatch = results.keywords.some(kw => isPartialKeywordMatch(kw.text, keyword));
    return { exact: false, partial: partialMatch };
  };
  
  // Keywords that need optimization (no exact or partial match)
  const keywordsToOptimize = targetKeywords.filter(keyword => {
    const status = checkKeywordStatus(keyword);
    return !status.exact && !status.partial;
  });
  
  // Keywords with only partial matches
  const keywordsWithPartialMatch = targetKeywords.filter(keyword => {
    const status = checkKeywordStatus(keyword);
    return !status.exact && status.partial;
  });
  
  // Keywords with exact matches
  const keywordsWithExactMatch = targetKeywords.filter(keyword => {
    const status = checkKeywordStatus(keyword);
    return status.exact;
  });
  
  // Check if optimization is needed
  const needsOptimization = keywordsToOptimize.length > 0;
  
  const handleOptimize = async () => {
    if (!apiKey) {
      toast({
        title: "API Key Required",
        description: "Please enter a valid OpenAI API key to proceed with optimization.",
        variant: "destructive",
      });
      return;
    }

    setIsOptimizing(true);
    try {
      const optimized = await optimizeTextWithAI(
        text,
        [...keywordsToOptimize, ...keywordsWithPartialMatch],
        results,
        apiKey,
        aiModel
      );
      setOptimizedText(optimized);
      toast({
        title: "Optimization Completed",
        description: "The text has been successfully optimized.",
      });
    } catch (error) {
      console.error("Error during optimization:", error);
      toast({
        title: "Optimization Error",
        description: error instanceof Error ? error.message : "An error occurred during text optimization.",
        variant: "destructive",
      });
    } finally {
      setIsOptimizing(false);
    }
  };

  return {
    apiKey,
    setApiKey,
    aiModel,
    setAiModel,
    isOptimizing,
    optimizedText,
    keywordsToOptimize,
    keywordsWithPartialMatch,
    keywordsWithExactMatch,
    needsOptimization,
    handleOptimize,
    checkKeywordStatus
  };
};
