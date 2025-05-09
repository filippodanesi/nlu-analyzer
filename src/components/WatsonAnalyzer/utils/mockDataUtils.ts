
/**
 * Mock data generation utilities for Watson NLU API responses
 */

/**
 * Extract frequently used words from text
 */
export const getFrequentWords = (text: string) => {
  const words = text.toLowerCase()
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "")
    .split(/\s+/);
  
  const wordFrequency: Record<string, number> = {};
  words.forEach(word => {
    if (word.length > 3) { // Only consider words with more than 3 characters
      wordFrequency[word] = (wordFrequency[word] || 0) + 1;
    }
  });
  
  return Object.entries(wordFrequency)
    .sort((a, b) => b[1] - a[1])
    .map(entry => entry[0])
    .slice(0, 10);
};

/**
 * Generate mock keywords based on text content
 */
export const generateMockKeywords = (words: string[]) => {
  return words.map((word, index) => {
    const relevance = 0.98 - (index * 0.04);
    const sentimentScore = (Math.random() * 1.4) - 0.2; // Between -0.2 and 1.2
    return {
      text: word,
      relevance: parseFloat(relevance.toFixed(2)),
      sentiment: { score: parseFloat(sentimentScore.toFixed(2)) }
    };
  });
};

/**
 * Generate mock entities based on text content
 */
export const generateMockEntities = (text: string) => {
  const possibleEntities = [
    { text: "Triumph", type: "Organization" },
    { text: "bras", type: "Product" },
    { text: "straps", type: "Feature" },
    { text: "support", type: "Concept" },
    { text: "design", type: "Concept" },
    { text: "fabrics", type: "Material" },
    { text: "dresses", type: "Product" },
    { text: "tops", type: "Product" },
  ];
  
  return possibleEntities
    .filter(entity => text.toLowerCase().includes(entity.text.toLowerCase()))
    .map((entity, index) => {
      const relevance = 0.95 - (index * 0.05);
      const sentimentScore = (Math.random() * 1.2) - 0.2;
      return {
        ...entity,
        relevance: parseFloat(relevance.toFixed(2)),
        sentiment: { score: parseFloat(sentimentScore.toFixed(2)) }
      };
    });
};

/**
 * Generate mock concepts based on text content
 */
export const generateMockConcepts = (text: string) => {
  const possibleConcepts = [
    "Lingerie",
    "Fashion",
    "Apparel",
    "Clothing",
    "Undergarments",
    "Style",
    "Comfort",
    "Support"
  ];
  
  return possibleConcepts
    .slice(0, 5)
    .map((concept, index) => ({
      text: concept,
      relevance: parseFloat((0.98 - (index * 0.04)).toFixed(2))
    }));
};

/**
 * Generate mock categories based on text content
 */
export const generateMockCategories = (text: string) => {
  const lowerText = text.toLowerCase();
  
  const categories = [];
  
  if (lowerText.includes("bra") || lowerText.includes("support") || lowerText.includes("comfortable")) {
    categories.push({
      label: "shopping/apparel/underwear",
      score: 0.95
    });
  }
  
  if (lowerText.includes("style") || lowerText.includes("design") || lowerText.includes("dress")) {
    categories.push({
      label: "style and fashion/clothing",
      score: 0.82
    });
  }

  if (lowerText.includes("comfort") || lowerText.includes("fabric") || lowerText.includes("quality")) {
    categories.push({
      label: "shopping/consumer resources/product reviews",
      score: 0.74
    });
  }
  
  return categories.length > 0 ? categories : [
    { label: "shopping/apparel/underwear", score: 0.95 }
  ];
};

/**
 * Generate mock relations based on text content
 */
export const generateMockRelations = (text: string, featuresEnabled: boolean) => {
  if (!featuresEnabled) return [];
  
  const relations = [];
  
  if (text.toLowerCase().includes("triumph") && text.toLowerCase().includes("bra")) {
    relations.push({
      type: "providerOf",
      sentence: "Triumph provides strapless bras designed for secure support.",
      score: 0.87,
      args: [
        { 
          text: "Triumph", 
          entities: [{ type: "Organization" }] 
        },
        { 
          text: "strapless bras", 
          entities: [{ type: "Product" }] 
        }
      ]
    });
  }
  
  if (text.toLowerCase().includes("support") && text.toLowerCase().includes("bra")) {
    relations.push({
      type: "featureOf",
      sentence: "Support is a key feature of the strapless bras.",
      score: 0.82,
      args: [
        { 
          text: "Support", 
          entities: [{ type: "Feature" }] 
        },
        { 
          text: "strapless bras", 
          entities: [{ type: "Product" }] 
        }
      ]
    });
  }
  
  return relations;
};

/**
 * Generate complete mock Watson NLU API response
 */
export const generateMockResponse = (text: string, features: {
  keywords: boolean;
  entities: boolean;
  concepts: boolean;
  relations: boolean;
  categories: boolean;
}, language: string) => {
  // Analyze input text to extract keywords
  const frequentWords = getFrequentWords(text);

  return {
    language: language,
    keywords: features.keywords ? generateMockKeywords(frequentWords) : [],
    entities: features.entities ? generateMockEntities(text) : [],
    concepts: features.concepts ? generateMockConcepts(text) : [],
    categories: features.categories ? generateMockCategories(text) : [],
    relations: features.relations ? generateMockRelations(text, features.relations) : [],
  };
};

/**
 * Calculate text statistics
 */
export const calculateTextStats = (text: string) => {
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  const sentenceCount = (text.match(/[.!?]+/g) || []).length || 1;
  const charCount = text.length;

  return {
    wordCount,
    sentenceCount,
    charCount,
  };
};
