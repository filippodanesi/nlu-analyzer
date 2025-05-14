
/**
 * Utility functions for keyword analysis and matching
 */

/**
 * Checks if a target keyword is in top positions
 */
export const isKeywordInTopPositions = (
  targetKeyword: string,
  keywords: any[],
  topN: number = 3
): boolean => {
  if (!keywords || keywords.length === 0 || !targetKeyword) return false;
  
  // Check if the keyword is among the top N positions
  const topKeywords = keywords.slice(0, topN);
  return topKeywords.some(kw => 
    kw.text.toLowerCase().includes(targetKeyword.toLowerCase())
  );
};

/**
 * Checks if there's an exact keyword match
 */
export const isExactKeywordMatch = (
  text: string,
  targetKeyword: string
): boolean => {
  if (!text || !targetKeyword) return false;
  
  // Convert both to lowercase and check for exact match
  return text.toLowerCase() === targetKeyword.toLowerCase();
};

/**
 * Checks if there's a partial keyword match
 */
export const isPartialKeywordMatch = (
  text: string,
  targetKeyword: string
): boolean => {
  if (!text || !targetKeyword) return false;
  
  // Convert both to lowercase and check if the text includes the keyword
  return text.toLowerCase().includes(targetKeyword.toLowerCase()) && 
         text.toLowerCase() !== targetKeyword.toLowerCase();
};
