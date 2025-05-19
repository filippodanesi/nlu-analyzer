
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

  // Determine if using o4 models which require different parameter names
  const isO4Model = model.includes('o4-mini');

  // Configure API request body based on model type
  const requestBody = isO4Model ? {
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
    max_completion_tokens: 4000 // Use max_completion_tokens for o4-mini model
  } : {
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
    max_tokens: 4000 // Use max_tokens for other models
  };

  console.log("OpenAI API request body:", JSON.stringify(requestBody, null, 2));

  try {
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
    
    // Safely extract the content from the response
    if (!data.choices || !data.choices[0] || !data.choices[0].message || !data.choices[0].message.content) {
      console.error("Unexpected API response format:", data);
      throw new Error("Invalid response format from OpenAI API");
    }
    
    return data.choices[0].message.content;
  } catch (error) {
    console.error("OpenAI API call failed:", error);
    throw error;
  }
};
