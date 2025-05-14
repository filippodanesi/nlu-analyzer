
/**
 * Utility functions for Claude API integration
 */
import { getCorsProxyUrl, makeProxiedUrl, getCorsProxyHeaders } from './corsProxyUtils';

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
                        
    // Get the CORS proxy URL
    const corsProxyUrl = getCorsProxyUrl();
    
    // Create the proxied URL
    const baseUrl = "https://api.anthropic.com/v1/messages";
    const proxiedUrl = makeProxiedUrl(baseUrl, corsProxyUrl);
    
    // Get the proxy headers
    const proxyHeaders = getCorsProxyHeaders(corsProxyUrl);
    
    console.log(`Using Claude model: ${claudeModel}`);
    console.log(`Using CORS proxy: ${corsProxyUrl}`);
    
    const response = await fetch(proxiedUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "anthropic-dangerous-direct-browser-access": "true", // Add the required header
        ...proxyHeaders // Add any proxy-specific headers
      },
      body: JSON.stringify({
        model: claudeModel,
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
      console.error("Claude API error status:", response.status);
      
      // Try to get the error details
      let errorDetails = "";
      try {
        const errorData = await response.json();
        errorDetails = errorData.error?.message || JSON.stringify(errorData);
        console.error("Claude API error:", errorDetails);
      } catch (e) {
        errorDetails = "Unknown error";
      }
      
      // Try fallback approach if the proxy fails
      if (response.status === 403 || response.status === 0 || response.status === 401 || response.status === 404) {
        console.log("Attempting fallback method for Claude API...");
        return await fallbackNoCorsClaude(prompt, apiKey);
      }
      
      throw new Error(errorDetails || "Error in Claude optimization API");
    }

    const data = await response.json();
    return data.content[0].text.trim();
  } catch (error) {
    console.error("Claude API error:", error);
    
    // If we have a specific CORS error, try the fallback
    if (error.toString().includes("CORS") || 
        error.toString().includes("Failed to fetch") ||
        error.toString().includes("dangerous-direct-browser")) {
      console.log("CORS error detected, trying fallback method...");
      return await fallbackNoCorsClaude(prompt, apiKey);
    }
    
    throw error;
  }
};
