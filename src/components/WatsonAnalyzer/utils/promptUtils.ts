
/**
 * Utility functions for generating AI prompts
 */

/**
 * Generates the prompt for text optimization
 */
export const generateOptimizationPrompt = (
  originalText: string,
  targetKeywords: string[],
  analysisResults: any
): string => {
  const keywordsString = targetKeywords.join(', ');
  
  // Extract entities from analysis results if available
  const entities = analysisResults && analysisResults.entities ? 
    analysisResults.entities.map((entity: any) => `${entity.text} (${entity.type})`).join(', ') : 
    'None detected';
  
  // Extract top keywords from analysis results if available
  const topKeywords = analysisResults && analysisResults.keywords ? 
    analysisResults.keywords.slice(0, 5).map((kw: any) => kw.text).join(', ') : 
    'None detected';
  
  return `Optimize this text for SEO while preserving its meaning and intent.

Original text:
${originalText}

Target keywords to optimize for: ${keywordsString}

Watson NLU detected entities: ${entities}
Watson NLU detected keywords: ${topKeywords}

Instructions:
1. Identify proper nouns, brands, and product names in the text - preserve them exactly as they appear.
2. Make sure brand names like "Triumph" are correctly identified as separate entities, not combined with other words.
3. If "Experience" is the first word of a sentence, make sure it's not erroneously combined with a brand name.
4. Strategically place the target keywords in important positions (beginning of paragraphs, headings if applicable).
5. Increase the density of target keywords while keeping the text natural and readable.
6. Use semantic variations of the target keywords where appropriate.
7. Ensure the text flows naturally and doesn't seem keyword-stuffed.
8. Preserve the original structure, meaning, and intent of the content.
9. Only include headings if they already exist in the original text.
10. Do not add any content that isn't directly related to the original text.
11. Make sure entity names are properly separated (e.g., "Experience" and "Triumph" should be separate if appropriate).

Provide only the optimized version of the text, without any additional content, explanations, or references.`;
};
