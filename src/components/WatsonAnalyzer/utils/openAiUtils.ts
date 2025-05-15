
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
          content: "You are an expert in SEO and content optimization focused on accurate entity recognition. You carefully identify brand names, product names, and other entities in text. You never combine the first word of a sentence with a brand name unless it's actually part of the brand. For example, if a sentence begins with 'Experience Triumph's products', you recognize that 'Triumph' is the brand, not 'Experience Triumph'."
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
