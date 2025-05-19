
import { useState } from 'react';
import { toast } from "@/hooks/use-toast";
import { optimizeTextWithAI } from '../../utils/optimizationUtils';
import { useCostTracker } from '../useCostTracker';
import { useKeywordAnalysis } from './useKeywordAnalysis';
import type { AIProvider } from './useOptimizationConfig';

interface UseOptimizationProcessProps {
  text: string;
  results: any;
  targetKeywords: string[];
  apiKey: string;
  aiModel: string;
  aiProvider: AIProvider;
}

export const useOptimizationProcess = ({ text, results, targetKeywords, apiKey, aiModel, aiProvider }: UseOptimizationProcessProps) => {
  const costTracker = useCostTracker();
  const { mockAnalysisForKeywords } = useKeywordAnalysis(results);
  
  // State for optimization
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizedText, setOptimizedText] = useState("");
  const [optimizedResults, setOptimizedResults] = useState<any>(null);
  const [lastCostRecord, setLastCostRecord] = useState<any>(null);
  
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
      console.log(`Starting optimization with ${aiProvider} model: ${aiModel}`);
      const optimizedContent = await optimizeTextWithAI(
        text,
        targetKeywords,
        results,
        apiKey,
        aiModel
      );
      
      console.log("Optimization successful, result length:", optimizedContent?.length || 0);
      
      // Verify we have content before setting state
      if (!optimizedContent || optimizedContent.trim() === "") {
        throw new Error("The AI returned an empty response. Please try again or try a different model.");
      }
      
      setOptimizedText(optimizedContent);
      
      // Create analysis results for the optimized text to check keywords
      const mockResults = mockAnalysisForKeywords(optimizedContent, targetKeywords);
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
      } else if (errorMessage.includes("o4") || errorMessage.includes("max_tokens") || errorMessage.includes("max_completion_tokens")) {
        errorMessage = "Error with o4 model. This may be due to parameter incompatibilities. Try switching to a different model like gpt-4o.";
      }
      
      toast({
        title: "Optimization failed",
        description: errorMessage,
        variant: "destructive",
      });
      
      // Clear optimization state on error
      setOptimizedText("");
      setOptimizedResults(null);
    } finally {
      setIsOptimizing(false);
    }
  };

  return {
    costTracker,
    lastCostRecord,
    isOptimizing,
    optimizedText,
    optimizedResults,
    handleOptimize
  };
};
