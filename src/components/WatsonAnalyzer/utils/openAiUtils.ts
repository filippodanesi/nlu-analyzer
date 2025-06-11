
/**
 * Utility functions for OpenAI API integration
 */

/**
 * Optimizes text using OpenAI GPT API
 */
export const optimizeWithOpenAI = async (
  prompt: string, 
  apiKey: string,
  model: string = "o4-mini"
): Promise<string> => {
  // Enhanced unified system prompt for better entity handling
const systemPrompt = `You are a senior SEO content optimizer and linguistic stylist, specialized in fashion and lingerie. You work exclusively for Triumph and are deeply familiar with the Triumph Brand Book, tone of voice, and values.

Your task is to optimize content for SEO while aligning strictly with the Triumph brand personality.

Follow these rules:

1. Always respect Triumph's tone of voice: direct, intentional, earnest, and personal. Do not use humor, puns, or sales language.
2. Preserve the authentic voice of the original text, including paragraph count, structure, tone, and style.
3. Enhance Named Entity Recognition (NER) using the following taxonomy: Brand, ProductType, Material, Feature, Benefit.
4. Avoid generic one-word entities. Return rich multi-word phrases (2–5 tokens) with strong fashion/lifestyle relevance.
5. Use all provided keywords verbatim in high-impact, natural positions. Optimize for SEO performance without keyword stuffing.
6. NEVER use inappropriate or objectifying language (e.g. "sexy", "boobs", "tits"). Keep language elegant and refined.
7. Avoid verb-brand fusion at the start of sentences (e.g. write “Discover the Triumph Fit” not “DiscoverTriumphFit”).
8. When multiple interpretations of an entity are possible, prefer the fashion-related one using the KNOWLEDGE SNIPPETS if provided.
9. Communicate benefits emotionally but concretely, using Triumph’s brand attributes: empathy, intuition, dynamism, courageous, dedicated, open-minded.
10. Do not output JSON, explanations, or markdown — only return the optimized plain text with correct punctuation and spacing.`;

  // Log the model being used to debug o4-mini issues
  console.log(`Using OpenAI model: ${model}`);
  
  // Handle specific models parameters differently
  const isO4MiniModel = model === "o4-mini";
  const isNewModel = model.includes('o3') || model.includes('o4');
  
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
    // Model-specific parameters
    ...(isNewModel ? { 
      max_completion_tokens: 4000
    } : { 
      temperature: 0.7,
      max_tokens: 4000 
    })
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
      
      // Enhanced error handling with specific guidance for o4-mini issues
      if (isO4MiniModel && errorData?.error?.message?.includes("max_tokens")) {
        throw new Error("o4-mini requires 'max_completion_tokens' instead of 'max_tokens'. The system has made this change but the API call failed. Please try again.");
      }
      
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
