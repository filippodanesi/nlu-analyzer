
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
  
  return `### TASK
Optimize this text for SEO while preserving its meaning, intent, and paragraph structure.

### ORIGINAL
${originalText}

### TARGET KEYWORDS
${keywordsString}

### WATSON CONTEXT
- Entities: ${entities}
- Top keywords: ${topKeywords}
- Categories: ${categories}

### ENTITY TAXONOMY (closed set)
Brand, ProductType, Material, Feature, Benefit

### KNOWLEDGE SNIPPETS
Triumph = global lingerie brand (est. 1886) – NOT the Canadian band  
"Experience <Brand>" → <Brand> is the entity, "Experience" is a verb/slogan.

### FEW-SHOT EXAMPLES
1. **Positive**  
   Text: "Discover Calvin Klein bralettes in cotton."  
   → Entities: Calvin Klein (Brand), bralettes (ProductType), cotton (Material)

2. **Positive**  
   Text: "Soft lace bralette by Intimissimi offers gentle support."  
   → Entities: Intimissimi (Brand), lace bralette (ProductType+Material), gentle support (Benefit)

3. **Negative**  
   Text: "Wire your payment before Friday."  
   → No Product-related entities

### INSTRUCTIONS
1. Identify entities using the taxonomy; ignore sentence-initial verbs.
2. Favour multi-word keyphrases (2-5 tokens); exclude generics ('styles').
3. Replace partial Watson matches with exact target keywords where natural.
4. Place target keywords at paragraph starts/ends without adding new sections.
5. Output **only** the optimized text – no JSON, no explanations.

### REMEMBER
Think step-by-step internally but do **not** reveal that reasoning.`;
};
