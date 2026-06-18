
import { useState } from 'react';
import { toast } from "@/hooks/use-toast";
import { optimizeTextWithAI } from '../../utils/optimizationUtils';

interface UseOptimizationProcessProps {
  text: string;
  results: any;
  targetKeywords: string[];
  apiKey: string;
  aiModel: string;
}

export const useOptimizationProcess = ({ text, results, targetKeywords, apiKey, aiModel }: UseOptimizationProcessProps) => {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizedText, setOptimizedText] = useState("");

  const handleOptimize = async () => {
    if (!text) {
      toast({ title: "No text provided", description: "Please enter text to optimize.", variant: "destructive" });
      return;
    }
    if (!apiKey) {
      toast({ title: "API key required", description: "Add your Anthropic API key first.", variant: "destructive" });
      return;
    }

    setIsOptimizing(true);
    try {
      const optimizedContent = await optimizeTextWithAI(text, targetKeywords, results, apiKey, aiModel);
      if (!optimizedContent || optimizedContent.trim() === "") {
        throw new Error("The AI returned an empty response. Please try again.");
      }
      setOptimizedText(optimizedContent);
      toast({ title: "Text optimized", description: "The text has been optimized for your target keywords." });
    } catch (error) {
      console.error("Error optimizing text:", error);
      let errorMessage = error instanceof Error ? error.message : "An error occurred during optimization.";
      if (errorMessage.includes("401") || errorMessage.includes("authentication") || errorMessage.includes("invalid")) {
        errorMessage = "Authentication failed. Please check your Anthropic API key.";
      }
      toast({ title: "Optimization failed", description: errorMessage, variant: "destructive" });
    } finally {
      setIsOptimizing(false);
    }
  };

  return { isOptimizing, optimizedText, handleOptimize };
};
