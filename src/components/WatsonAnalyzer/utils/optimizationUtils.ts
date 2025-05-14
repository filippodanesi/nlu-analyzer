
/**
 * Main optimization utilities that coordinate text optimization with AI
 */
import { generateOptimizationPrompt } from './promptUtils';
import { optimizeWithOpenAI } from './openAiUtils';
import { optimizeWithClaude } from './claudeUtils';

// Re-export keyword utilities for backward compatibility
export { 
  isKeywordInTopPositions, 
  isExactKeywordMatch, 
  isPartialKeywordMatch 
} from './keywordUtils';

/**
 * Optimizes text using an AI API
 */
export const optimizeTextWithAI = async (
  originalText: string,
  targetKeywords: string[],
  analysisResults: any,
  apiKey: string,
  model: string = "gpt-4o-mini"
): Promise<string> => {
  try {
    const prompt = generateOptimizationPrompt(originalText, targetKeywords, analysisResults);
    
    // Check which API to use based on the model name
    if (model.startsWith("claude")) {
      return await optimizeWithClaude(prompt, apiKey);
    } else {
      return await optimizeWithOpenAI(prompt, apiKey, model);
    }
  } catch (error) {
    console.error("Error in text optimization:", error);
    throw error;
  }
};
