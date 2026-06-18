/**
 * Coordinates text optimization with Claude.
 */
import { generateOptimizationPrompt } from './promptUtils';
import { optimizeWithClaude } from './claudeUtils';
import { AI_MODEL } from './aiConfig';

// Re-export keyword utilities for backward compatibility
export { isExactKeywordMatch, isPartialKeywordMatch, matchKeywordInText } from './keywordUtils';

/**
 * Optimizes text using Claude (the single configured model).
 */
export const optimizeTextWithAI = async (
  originalText: string,
  targetKeywords: string[],
  analysisResults: any,
  apiKey: string,
  model: string = AI_MODEL
): Promise<string> => {
  const prompt = generateOptimizationPrompt(originalText, targetKeywords, analysisResults);
  return optimizeWithClaude(prompt, apiKey, model);
};
