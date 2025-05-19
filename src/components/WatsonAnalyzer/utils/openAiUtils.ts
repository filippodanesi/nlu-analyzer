
/**
 * Utility functions for OpenAI API integration
 */

/**
 * Optimizes text using OpenAI GPT API
 */
export const optimizeWithOpenAI = async (
  prompt: string, 
  apiKey: string,
  model: string = "gpt-4o-mini"
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

  // Log the model being used to debug o4-mini issues
  console.log(`Using OpenAI model: ${model}`);

  // Determine if using o4 models which require different parameter names and restrictions
  const isO4Model = model.includes('o4-');

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
    // o4 models only support default temperature and use max_completion_tokens instead of max_tokens
    ...(isO4Model ? { 
      max_completion_tokens: 2000 
    } : { 
      temperature: 0.7,
      max_tokens: 2000 
    })
  };

  console.log("OpenAI API request body:", JSON.stringify(requestBody, null, 2));

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify(requestBody)
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    console.error("OpenAI API error:", errorData || response.statusText);
    throw new Error(
      errorData?.error?.message || `OpenAI API error: ${response.status} ${response.statusText}`
    );
  }

  const data = await response.json();
  console.log("OpenAI API response:", JSON.stringify(data, null, 2));
  return data.choices[0].message.content;
};
