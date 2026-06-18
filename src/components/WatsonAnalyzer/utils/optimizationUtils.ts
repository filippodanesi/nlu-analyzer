/**
 * Coordinates text optimization with the selected AI provider.
 */
import { generateOptimizationPrompt } from './promptUtils';
import { optimizeWithOpenAI } from './openAiUtils';
import { optimizeWithClaude } from './claudeUtils';

// Re-export keyword utilities for backward compatibility
export { isExactKeywordMatch, isPartialKeywordMatch, matchKeywordInText } from './keywordUtils';

/**
 * Optimizes text using an AI API. The provider is chosen from the model name.
 */
export const optimizeTextWithAI = async (
  originalText: string,
  targetKeywords: string[],
  analysisResults: any,
  apiKey: string,
  model: string = "o4-mini"
): Promise<string> => {
  const prompt = generateOptimizationPrompt(originalText, targetKeywords, analysisResults);

  if (model.startsWith("claude")) {
    return optimizeWithClaude(prompt, apiKey, model);
  }
  return optimizeWithOpenAI(prompt, apiKey, model);
};
