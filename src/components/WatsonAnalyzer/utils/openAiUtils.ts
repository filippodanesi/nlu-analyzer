
/**
 * Utility functions for OpenAI API integration
 */
import { OPTIMIZATION_SYSTEM_PROMPT } from './optimizationSystemPrompt';

/**
 * Optimizes text using OpenAI API
 */
export const optimizeWithOpenAI = async (
  prompt: string,
  apiKey: string,
  model: string = "o4-mini"
): Promise<string> => {
  // Reasoning models (o3 / o4 family) use a different token parameter and
  // do not accept a custom temperature.
  const isReasoningModel = model.includes('o3') || model.includes('o4');

  const requestBody = {
    model: model,
    messages: [
      { role: "system", content: OPTIMIZATION_SYSTEM_PROMPT },
      { role: "user", content: prompt }
    ],
    ...(isReasoningModel
      ? { max_completion_tokens: 4000 }
      : { temperature: 0.7, max_tokens: 4000 })
  };

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
      throw new Error(
        errorData?.error?.message || `OpenAI API error: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();

    // Safely extract the content from the response
    if (!data.choices?.[0]?.message?.content) {
      throw new Error("Invalid response format from OpenAI API");
    }

    return data.choices[0].message.content;
  } catch (error) {
    console.error("OpenAI API call failed:", error);
    throw error;
  }
};
