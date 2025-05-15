
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
  // Enhanced unified system prompt for better entity handling
  const systemPrompt = `You are an expert SEO content optimizer with deep expertise in NER.

Core rules:
• Use the ENTITY TAXONOMY provided in the user prompt (Brand, ProductType, Material, Feature, Benefit).  
• Never merge a sentence-initial verb with a brand name.  
• Disambiguate entities with the KNOWLEDGE SNIPPETS section; if multiple senses exist, pick the fashion-related one.  
• Return multi-word keyphrases (2-5 tokens), exclude single-word generics.  
• Preserve meaning, tone, paragraph count, and authentic voice.  
• Insert target keywords verbatim in high-impact positions while keeping the text natural.  
• After internal reasoning, output **only** the optimized text with correct spacing and punctuation – no JSON, no explanations, no markup.`;

  // Determine if using o4 models which require different parameter names and restrictions
  const isO4Model = model.startsWith('o4-');

  // Configure API request body based on model type
  const requestBody = {
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
    // o4 models only support default temperature (1.0) and use max_completion_tokens instead of max_tokens
    ...(isO4Model ? { 
      max_completion_tokens: 2000 
    } : { 
      temperature: 0.7,
      max_tokens: 2000 
    })
  };

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify(requestBody)
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || "Error in OpenAI optimization API");
  }

  const data = await response.json();
  return data.choices[0].message.content.trim();
};
