
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
 * Analyzes entities in text to help with optimization
 * This helps identify potential issues with entity recognition
 */
const analyzeEntitiesForOptimization = (analysisResults: any): string => {
  if (!analysisResults?.entities || analysisResults.entities.length === 0) {
    return "No entities detected";
  }

  // Look for potentially problematic entity recognition
  const potentialIssues = analysisResults.entities
    .filter((entity: any) => {
      // Look for entities that might include first words of sentences
      const text = entity.text || '';
      return text.includes(' ') && 
        ['Organization', 'Company', 'Person', 'Brand'].includes(entity.type);
    })
    .map((entity: any) => {
      return `${entity.text} (${entity.type})`;
    })
    .join(', ');

  return potentialIssues.length > 0 ? 
    `Potential entity recognition issues to fix: ${potentialIssues}` : 
    "No obvious entity recognition issues";
}

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
    // Get any additional entity analysis notes
    const entityAnalysis = analyzeEntitiesForOptimization(analysisResults);
    console.log("Entity analysis for optimization:", entityAnalysis);
    
    // Generate the optimization prompt
    const prompt = generateOptimizationPrompt(originalText, targetKeywords, analysisResults);
    
    // Log entity confidence to help with optimization quality
    if (analysisResults?.entities?.length > 0) {
      console.log("Entity confidence levels:", 
        analysisResults.entities.map((e: any) => `${e.text} (${e.type}): ${e.confidence || 'N/A'}`).join(', ')
      );
    }
    
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
