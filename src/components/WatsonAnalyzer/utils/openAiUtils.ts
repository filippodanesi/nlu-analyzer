
/**
 * Utility functions for OpenAI API integration
 */

/**
 * Optimizes text using OpenAI API
 */
export const optimizeWithOpenAI = async (
  prompt: string, 
  apiKey: string, 
  model: string
): Promise<string> => {
  // Enhanced system prompt with detailed instructions for entity handling
  const systemPrompt = `You are an expert SEO content optimizer with deep expertise in natural language processing and entity recognition.

Key capabilities:
1. You precisely identify brand names, product names, and other entities in text.
2. You never combine the first word of a sentence with a brand name unless it's actually part of the brand.
3. You understand the critical distinction between sentence-initial words and entity names that follow.
4. You recognize that in phrases like "Experience Triumph's products," "Triumph" is the brand, not "Experience Triumph."
5. Similarly, in phrases like "Buy Samsung phones," you correctly identify "Samsung" as the entity, not "Buy Samsung."
6. You're skilled at preserving the meaning and tone of the original text while naturally integrating target keywords.
7. You maintain the authentic voice and flow of the content while optimizing it for search engines.
8. You focus on making exact keyword matches whenever possible rather than just semantic variations.
9. You ensure consistent entity identification throughout the text, especially for brands and products.

Your goal is to create content that performs well in search results while remaining natural and valuable to human readers.`;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: model,
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || "Error in OpenAI optimization API");
  }

  const data = await response.json();
  return data.choices[0].message.content.trim();
};
