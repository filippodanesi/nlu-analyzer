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
 * Extracts and prepares entity information to improve optimization context
 */
const prepareEntityContext = (analysisResults: any): { 
  potentialIssues: string[],
  brandEntities: string[],
  productEntities: string[]
} => {
  const potentialIssues: string[] = [];
  const brandEntities: string[] = [];
  const productEntities: string[] = [];
  
  if (!analysisResults?.entities || analysisResults.entities.length === 0) {
    return { potentialIssues, brandEntities, productEntities };
  }

  // Process entities to identify different types and potential issues
  analysisResults.entities.forEach((entity: any) => {
    const text = entity.text || '';
    const type = entity.type || '';
    
    // Identify potential issues with entity recognition
    if (text.includes(' ') && ['Organization', 'Company', 'Brand'].includes(type)) {
      // Check if first word might be a verb/action (common sentence starters)
      const words = text.split(' ');
      const firstWord = words[0].toLowerCase();
      const commonVerbs = ['experience', 'discover', 'buy', 'shop', 'find', 'get', 'try'];
      
      if (commonVerbs.includes(firstWord)) {
        potentialIssues.push(`${entity.text} (${entity.type}) - may include verb "${firstWord}"`);
      }
    }
    
    // Categorize entities for better context
    if (['Organization', 'Company', 'Brand'].includes(type)) {
      brandEntities.push(text);
    } else if (['Product', 'ProductType'].includes(type)) {
      productEntities.push(text);
    }
  });

  return { potentialIssues, brandEntities, productEntities };
}

/**
 * Analyzes entities in text to help with optimization
 * This helps identify potential issues with entity recognition
 */
const analyzeEntitiesForOptimization = (analysisResults: any): string => {
  const { potentialIssues, brandEntities, productEntities } = prepareEntityContext(analysisResults);
  
  let analysisNotes = [];
  
  if (potentialIssues.length > 0) {
    analysisNotes.push(`Potential entity recognition issues: ${potentialIssues.join(', ')}`);
  }
  
  if (brandEntities.length > 0) {
    analysisNotes.push(`Identified brands: ${brandEntities.join(', ')}`);
  }
  
  if (productEntities.length > 0) {
    analysisNotes.push(`Identified products: ${productEntities.join(', ')}`);
  }
  
  return analysisNotes.length > 0 ? analysisNotes.join('\n') : "No obvious entity recognition issues";
}

/**
 * Optimizes text using an AI API
 */
export const optimizeTextWithAI = async (
  originalText: string,
  targetKeywords: string[],
  analysisResults: any,
  apiKey: string,
  model: string = "o4-mini"
): Promise<string> => {
  try {
    // Get entity analysis for better context
    const entityAnalysis = analyzeEntitiesForOptimization(analysisResults);
    console.log("Entity analysis for optimization:", entityAnalysis);
    
    // Clean multi-word keywords (filter out single-word generic terms)
    const optimizedKeywords = targetKeywords.filter(keyword => {
      // Keep multi-word keywords (2+ tokens)
      if (keyword.includes(' ')) return true;
      
      // Keep single words if they appear to be specific entities (brands, product names)
      const isSpecificEntity = analysisResults?.entities?.some((entity: any) => 
        entity.text.toLowerCase() === keyword.toLowerCase() && 
        ['Organization', 'Company', 'Brand', 'Product'].includes(entity.type)
      );
      
      return isSpecificEntity;
    });
    
    if (optimizedKeywords.length < targetKeywords.length) {
      console.log("Filtered generic single-word keywords for better optimization:", 
        targetKeywords.filter(kw => !optimizedKeywords.includes(kw)));
    }
    
    // Generate the optimization prompt with enhanced context
    const prompt = generateOptimizationPrompt(
      originalText, 
      targetKeywords,  // We still pass all keywords as requested by user
      analysisResults
    );
    
    // Log entity confidence to help with optimization quality
    if (analysisResults?.entities?.length > 0) {
      console.log("Entity confidence levels:", 
        analysisResults.entities.map((e: any) => `${e.text} (${e.type}): ${e.confidence || 'N/A'}`).join(', ')
      );
    }
    
    // Check which API to use based on the model name
    if (model.startsWith("claude")) {
      return await optimizeWithClaude(prompt, apiKey, model);
    } else {
      return await optimizeWithOpenAI(prompt, apiKey, model);
    }
  } catch (error) {
    console.error("Error in text optimization:", error);
    throw error;
  }
};
