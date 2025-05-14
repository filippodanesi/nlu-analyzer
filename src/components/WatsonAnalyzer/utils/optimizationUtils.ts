
// Utility functions for AI-based text optimization

/**
 * Checks if a target keyword is in top positions
 */
export const isKeywordInTopPositions = (
  targetKeyword: string,
  keywords: any[],
  topN: number = 3
): boolean => {
  if (!keywords || keywords.length === 0 || !targetKeyword) return false;
  
  // Check if the keyword is among the top N positions
  const topKeywords = keywords.slice(0, topN);
  return topKeywords.some(kw => 
    kw.text.toLowerCase().includes(targetKeyword.toLowerCase())
  );
};

/**
 * Checks if there's an exact keyword match
 */
export const isExactKeywordMatch = (
  text: string,
  targetKeyword: string
): boolean => {
  if (!text || !targetKeyword) return false;
  
  // Convert both to lowercase and check for exact match
  return text.toLowerCase() === targetKeyword.toLowerCase();
};

/**
 * Checks if there's a partial keyword match
 */
export const isPartialKeywordMatch = (
  text: string,
  targetKeyword: string
): boolean => {
  if (!text || !targetKeyword) return false;
  
  // Convert both to lowercase and check if the text includes the keyword
  return text.toLowerCase().includes(targetKeyword.toLowerCase()) && 
         text.toLowerCase() !== targetKeyword.toLowerCase();
};

/**
 * Generates the prompt for text optimization
 */
export const generateOptimizationPrompt = (
  originalText: string,
  targetKeywords: string[],
  analysisResults: any
): string => {
  const keywordsString = targetKeywords.join(', ');
  
  return `Optimize this exact text for the following target keywords: ${keywordsString}.

Original text:
${originalText}

Instructions:
1. Only optimize the EXACT text provided above.
2. Do not add any content that isn't directly related to the original text.
3. Do not reference any external APIs, libraries, or services that aren't mentioned in the original text.
4. Include the target keywords in strategic positions (beginning, headings, first paragraphs)
5. Slightly increase the density of target keywords while maintaining natural flow
6. Use synonyms and semantic variations of the target keywords where appropriate
7. Keep the text natural and readable
8. Preserve the original meaning, scope, and intent

Provide only the optimized version of the exact text, without any additional content, explanations, or references.`;
};

/**
 * Optimizes text using an AI API
 */
export const optimizeTextWithAI = async (
  originalText: string,
  targetKeywords: string[],
  analysisResults: any,
  apiKey: string,
  model: string = "gpt-4o-mini"
): Promise<string> => {
  try {
    const prompt = generateOptimizationPrompt(originalText, targetKeywords, analysisResults);
    
    // Check which API to use based on the model name
    if (model.startsWith("claude")) {
      return await optimizeWithClaude(prompt, apiKey, model);
    } else {
      return await optimizeWithOpenAI(prompt, apiKey, model);
    }
  } catch (error) {
    console.error("Error in text optimization:", error);
    throw error;
  }
};

/**
 * Optimizes text using OpenAI API
 */
const optimizeWithOpenAI = async (
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
          content: "You are an assistant specialized in SEO and keyword optimization. Your task is to optimize the exact text provided without adding any content that wasn't in the original. Never reference external tools or services not mentioned in the original text."
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

/**
 * Optimizes text using Anthropic Claude API
 */
const optimizeWithClaude = async (
  prompt: string, 
  apiKey: string, 
  model: string
): Promise<string> => {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01"
    },
    body: JSON.stringify({
      model: model,
      system: "You are an assistant specialized in SEO and keyword optimization. Your task is to optimize the exact text provided without adding any content that wasn't in the original. Never reference external tools or services not mentioned in the original text.",
      messages: [
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
    throw new Error(error.error?.message || "Error in Claude optimization API");
  }

  const data = await response.json();
  return data.content[0].text.trim();
};
