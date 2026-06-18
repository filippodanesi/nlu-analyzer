
/**
 * Builds the user message for text optimization.
 *
 * All brand, SEO, structure and style rules live in OPTIMIZATION_SYSTEM_PROMPT.
 * This message only supplies the material to work with: the target keywords,
 * the signals Watson already extracted, and the original text. Keeping the two
 * separate avoids the contradictions the old combined prompt suffered from.
 */
export const generateOptimizationPrompt = (
  originalText: string,
  targetKeywords: string[],
  analysisResults: any
): string => {
  const keywordsString = targetKeywords.length ? targetKeywords.join(', ') : 'None provided';

  const topKeywords = analysisResults?.keywords?.length
    ? analysisResults.keywords.slice(0, 5).map((kw: any) => kw.text).join(', ')
    : 'None detected';

  const entities = analysisResults?.entities?.length
    ? analysisResults.entities.map((entity: any) => `${entity.text} (${entity.type})`).join(', ')
    : 'None detected';

  const categories = analysisResults?.categories?.length
    ? analysisResults.categories.slice(0, 2).map((cat: any) => cat.label).join(', ')
    : 'None detected';

  return `### TASK
Rewrite the original text below, applying every brand, SEO, structure and style rule from your instructions. Return only the optimized text.

### TARGET KEYWORDS (use each one verbatim)
${keywordsString}

### SIGNALS FROM WATSON NLU (context only)
- Keywords already prominent: ${topKeywords}
- Entities detected: ${entities}
- Categories: ${categories}

### ORIGINAL TEXT
${originalText}`;
};
