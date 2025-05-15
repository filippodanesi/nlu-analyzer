
/**
 * Utility functions for Claude API integration
 */
import { getCorsProxyUrl, makeProxiedUrl, getCorsProxyHeaders, fetchWithCorsProxy } from './corsProxyUtils';

/**
 * Fallback to no-cors mode with simpler prompt
 */
const fallbackNoCorsClaude = async (
  prompt: string,
  apiKey: string
): Promise<string> => {
  try {
    // Get a simpler prompt (only keywords, shorter length)
    const simplePrompt = prompt.split('\n').slice(0, 3).join('\n');
    
    // Try with no-cors mode (will result in an opaque response)
    await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "anthropic-dangerous-direct-browser-access": "true" // Add the required header
      },
      body: JSON.stringify({
        model: "claude-3-7-sonnet-20250219", // Always use the preferred model
        system: "Optimize text with keywords",
        messages: [{ role: "user", content: simplePrompt }],
        max_tokens: 1000
      })
    });
    
    // Since no-cors gives an opaque response, we can't read it
    // Return a fallback message
    return `I've attempted to optimize your text with the keywords: ${prompt.split(':')[1]?.split('.')[0] || '(keywords not found)'}.
    
Due to browser security restrictions (CORS), I couldn't display the AI-optimized result directly. 

Options to resolve this:
1. Try a different CORS proxy in the "CORS Proxy" settings
2. Use OpenAI instead (GPT-4o) which has fewer CORS restrictions
3. Consider setting up a simple backend service to handle these API calls

The original text is preserved.`;
  } catch (error) {
    console.error("Error in fallback no-cors mode:", error);
    throw new Error("CORS issues prevented optimization. Try using OpenAI models instead.");
  }
};

/**
 * Optimizes text using Anthropic Claude API
 */
export const optimizeWithClaude = async (
  prompt: string, 
  apiKey: string
): Promise<string> => {
  try {
    // Always use the preferred Claude model
    const claudeModel = "claude-3-7-sonnet-20250219";
                        
    console.log(`Using Claude model: ${claudeModel}`);
    
    // Prepare request body
    const requestBody = JSON.stringify({
      model: claudeModel,
      system: "You are an expert in SEO and content optimization focused on accurate entity recognition. You carefully identify brand names, product names, and other entities in text. You never combine the first word of a sentence with a brand name unless it's actually part of the brand. For example, if a sentence begins with 'Experience Triumph's products', you recognize that 'Triumph' is the brand, not 'Experience Triumph'.",
      messages: [
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000
    });
    
    // Prepare headers
    const headers = {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true" // Required header
    };
    
    // Use our enhanced fetch function with CORS proxy support
    const response = await fetchWithCorsProxy(
      "https://api.anthropic.com/v1/messages",
      {
        method: "POST",
        headers,
        body: requestBody
      }
    );

    // If we're using no-cors mode, we'll get an opaque response
    if (response.type === 'opaque') {
      console.log("Received opaque response, using fallback...");
      return await fallbackNoCorsClaude(prompt, apiKey);
    }

    const data = await response.json();
    return data.content[0].text.trim();
  } catch (error) {
    console.error("Claude API error:", error);
    
    // If we have a specific CORS error, try the fallback
    if (error.toString().includes("CORS") || 
        error.toString().includes("Failed to fetch") ||
        error.toString().includes("dangerous-direct-browser") ||
        error.toString().includes("NetworkError")) {
      console.log("CORS error detected, trying fallback method...");
      return await fallbackNoCorsClaude(prompt, apiKey);
    }
    
    throw error;
  }
};
