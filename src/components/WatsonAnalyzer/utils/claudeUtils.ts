
/**
 * Utility functions for Claude API integration
 */
import { getCorsProxyUrl, makeProxiedUrl, getCorsProxyHeaders, fetchWithCorsProxy } from './corsProxyUtils';
import { toast } from "@/hooks/use-toast";

/**
 * Fallback to no-cors mode with simpler prompt
 */
const fallbackNoCorsClaude = async (
  prompt: string,
  apiKey: string
): Promise<string> => {
  try {
    // Show a toast notification about the fallback
    toast({
      title: "CORS issue detected",
      description: "Attempting alternative method to reach the Claude API...",
    });
    
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
    
    // Extract keywords for the fallback message
    let keywordsList = "unknown";
    try {
      const keywordMatch = prompt.match(/Target Keywords:\s*([^\n]+)/i);
      if (keywordMatch && keywordMatch[1]) {
        keywordsList = keywordMatch[1].trim();
      }
    } catch (err) {
      console.warn("Could not extract keywords from prompt:", err);
    }
    
    // Since no-cors gives an opaque response, we can't read it
    // Return a fallback message
    return `I've attempted to optimize your text with the keywords: ${keywordsList}
    
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
    
    // First attempt: Try direct API call with the new dangerous-direct-browser-access header
    try {
      console.log("Attempting direct Claude API call with CORS header");
      
      toast({
        title: "Making direct Claude API call",
        description: "Using new anthropic-dangerous-direct-browser-access header...",
      });
      
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true" // New header to enable CORS
        },
        body: JSON.stringify({
          model: claudeModel,
          system: systemPrompt,
          messages: [
            {
              role: "user",
              content: prompt
            }
          ],
          max_tokens: 2000
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        return data.content[0].text.trim();
      } else {
        console.error("Direct Claude API call failed:", await response.text());
        throw new Error(`Claude API error: ${response.status}`);
      }
    } catch (directCallError) {
      // Log the error from direct call
      console.error("Direct Claude API call error:", directCallError);
      console.log("Falling back to CORS proxy...");
      
      toast({
        title: "Direct API call failed",
        description: "Trying with CORS proxy instead...",
      });
      
      // Second attempt: Try with CORS proxy
      try {
        // Prepare request body
        const requestBody = JSON.stringify({
          model: claudeModel,
          system: systemPrompt,
          messages: [
            {
              role: "user",
              content: prompt
            }
          ],
          max_tokens: 2000
        });
        
        // Prepare headers
        const headers = {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true" // Include this header even with proxy
        };
        
        // Get the current CORS proxy URL
        const corsProxyUrl = getCorsProxyUrl();
        console.log(`Falling back to CORS proxy: ${corsProxyUrl}`);
        
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

        // Try to parse the response as JSON
        try {
          const data = await response.json();
          return data.content[0].text.trim();
        } catch (parseError) {
          console.error("Failed to parse Claude API response:", parseError);
          return await fallbackNoCorsClaude(prompt, apiKey);
        }
      } catch (proxyError) {
        console.error("CORS proxy attempt error:", proxyError);
        return await fallbackNoCorsClaude(prompt, apiKey);
      }
    }
  } catch (error) {
    console.error("Claude API error:", error);
    
    // Detailed logging for debugging
    if (error.response) {
      console.error("Claude API error response:", {
        status: error.response.status,
        headers: error.response.headers,
        data: error.response.data
      });
    }
    
    // If we have a specific CORS error or other known errors, try the fallback
    if (error.toString().includes("CORS") || 
        error.toString().includes("Failed to fetch") ||
        error.toString().includes("dangerous-direct-browser") ||
        error.toString().includes("NetworkError") ||
        error.toString().includes("fetch") ||
        error.toString().includes("TypeError")) {
      console.log("Connection error detected, trying fallback method...");
      
      // Show a toast notification about the fallback
      toast({
        title: "Connection issue detected",
        description: "Falling back to alternative method...",
        variant: "destructive",
      });
      
      return await fallbackNoCorsClaude(prompt, apiKey);
    }
    
    throw error;
  }
};
