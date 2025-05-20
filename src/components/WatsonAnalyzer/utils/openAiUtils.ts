
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
• Insert ALL target keywords verbatim in high-impact positions while keeping the text natural.  
• After internal reasoning, output **only** the optimized text with correct spacing and punctuation – no JSON, no explanations, no markup.`;

  // Log the model being used to debug o4-mini issues
  console.log(`Using OpenAI model: ${model}`);
  
  // Handle specific models parameters differently
  const isO4MiniModel = model === "gpt-4o-mini";
  const isNewModel = model.includes('o1') || model.includes('o4');
  
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
        throw new Error("gpt-4o-mini requires 'max_completion_tokens' instead of 'max_tokens'. The system has made this change but the API call failed. Please try again.");
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
