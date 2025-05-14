
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
2. Preserve the original structure exactly as provided.
3. IMPORTANT: Only include headings/titles if they already exist in the original text (marked with H1:, H2:, etc.). DO NOT add new headings if none exist in the original text.
4. Do not add any content that isn't directly related to the original text.
5. Do not reference any external APIs, libraries, or services that aren't mentioned in the original text.
6. Include the target keywords in strategic positions (beginning of paragraphs, existing headings).
7. Slightly increase the density of target keywords while maintaining natural flow.
8. Use synonyms and semantic variations of the target keywords where appropriate.
9. Keep the text natural and readable.
10. Preserve the original meaning, scope, and intent.
11. If headings are present (marked with H1:, H2:, etc.), optimize them while maintaining their format.

Provide only the optimized version of the exact text, without any additional content, explanations, or references.`;
};
