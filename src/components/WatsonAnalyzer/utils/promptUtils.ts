
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
  
  return `Optimize this exact text for the following target keywords: ${keywordsString}.

Original text:
${originalText}

Instructions:
1. Only optimize the EXACT text provided above.
2. Do not add any content that isn't directly related to the original text.
3. Do not reference any external APIs, libraries, or services that aren't mentioned in the original text.
4. Include the target keywords in strategic positions (beginning, headings, first paragraphs)
5. Slightly increase the density of target keywords while maintaining natural flow
6. Use synonyms and semantic variations of the target keywords where appropriate
7. Keep the text natural and readable
8. Preserve the original meaning, scope, and intent

Provide only the optimized version of the exact text, without any additional content, explanations, or references.`;
};
