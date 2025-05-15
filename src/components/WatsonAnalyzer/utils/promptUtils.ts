
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
  
  // Extract categories for better context
  const categories = analysisResults && analysisResults.categories ?
    analysisResults.categories.slice(0, 2).map((cat: any) => cat.label).join(', ') :
    'None detected';
  
  return `Optimize this text for SEO while preserving its meaning and intent.

Original text:
${originalText}

Target keywords to optimize for: ${keywordsString}

Watson NLU detected entities: ${entities}
Watson NLU detected keywords: ${topKeywords}
Watson NLU detected categories: ${categories}

Instructions:
1. Carefully identify distinct entities in the text, especially brand names, product names, and proper nouns.
2. Treat the first word of sentences separately from any brand or entity names that follow it.
3. For example, in "Experience Triumph's products", recognize that "Triumph" is the brand name, not "Experience Triumph".
4. Similarly, in other contexts like "Buy Samsung phones", recognize "Samsung" as the entity, not "Buy Samsung".
5. Strategically place the target keywords in high-impact positions (beginning of paragraphs, headings, and near the start and end of the content).
6. Increase the density of target keywords while maintaining natural readability.
7. Use target keywords verbatim when possible rather than just semantic variations.
8. For partial matches in the original Watson analysis, convert them to exact matches where natural.
9. Maintain paragraph structure and overall flow similar to the original.
10. Don't artificially introduce new sections, headers, or formatting that wasn't in the original.
11. Ensure the text sounds natural to human readers while incorporating the target keywords.
12. Pay special attention to proper spacing between sentences and proper punctuation.
13. If entity disambiguation is available in the analysis results, use this information to properly identify entities.

Remember: The goal is to improve SEO performance while maintaining the authentic voice and intent of the original content.

Provide only the optimized version of the text, without any additional content, explanations, or references.`;
};
