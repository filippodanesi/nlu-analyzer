
/**
 * Utility functions for Claude API integration using the official Anthropic SDK
 */
import Anthropic from '@anthropic-ai/sdk';
import { toast } from "@/hooks/use-toast";

/**
 * Fallback message for when the Anthropic SDK encounters an error
 */
const getFallbackMessage = (prompt: string, error?: Error): string => {
  try {
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
    
    // If we have an authentication error, return a clear message
    if (error?.message?.includes("401") || 
        error?.message?.includes("auth") || 
        error?.toString().includes("invalid x-api-key")) {
      return `Authentication Failed: Your Claude API key appears to be invalid.

Please check the following:
1. Make sure your API key is correctly entered in the AI Configuration settings
2. Verify that your Claude API key is active and has not expired
3. Ensure your account has access to the Claude API

The original text has been preserved.`;
    }
    
    // Return a general fallback message
    return `I've attempted to optimize your text with the keywords: ${keywordsList}
    
Due to API connection issues, I couldn't display the AI-optimized result directly. 

Options to resolve this:
1. Check that your Claude API key is valid
2. Use OpenAI instead (GPT-4o) which may have fewer connection restrictions
3. Try again in a few moments

The original text is preserved.`;
  } catch (fallbackError) {
    console.error("Error creating fallback message:", fallbackError);
    return "Could not optimize the text due to API connection issues. Please try again later.";
  }
};

/**
 * Optimizes text using Anthropic Claude API via the official SDK
 */
export const optimizeWithClaude = async (
  prompt: string, 
  apiKey: string,
  model: string = "claude-sonnet-4-20250514"
): Promise<string> => {
  try {
    // Validate API key first
    if (!apiKey || apiKey.trim() === "") {
      toast({
        title: "Missing API Key",
        description: "Please provide a valid Claude API key in the AI Configuration.",
        variant: "destructive",
      });
      throw new Error("Claude API key is missing");
    }

    // Check for likely invalid API key format
    if (!apiKey.startsWith("sk-ant-") && !apiKey.startsWith("sk-")) {
      console.warn("Claude API key appears to have invalid format. Should start with 'sk-ant-'");
      toast({
        title: "Invalid API Key Format",
        description: "Claude API keys typically start with 'sk-ant-'. Please check your key.",
        variant: "warning",
      });
    }
    
    // Use the specified Claude model or default to Claude 4 Sonnet
    const claudeModel = model || "claude-sonnet-4-20250514";
    console.log(`Using Claude model: ${claudeModel}`);
    
    // Get model name for display in toast
    const modelDisplayName = claudeModel.includes("4-") ? "Claude 4" : 
                             claudeModel.includes("3-haiku") ? "Claude 3 Haiku" : "Claude";
    
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

    // Create Anthropic client with browser support enabled
    const client = new Anthropic({
      apiKey: apiKey,
      dangerouslyAllowBrowser: true, // Enable browser support
    });

    toast({
      title: `Optimizing with ${modelDisplayName}`,
      description: `Using ${claudeModel} for optimization...`,
    });

    try {
      // Make the API request using the SDK
      const response = await client.messages.create({
        model: claudeModel,
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 2000
      });

      // Check if there's content in the response and handle different content types properly
      if (response.content && response.content.length > 0) {
        // Find the first text block in the content array
        const textContent = response.content.find(block => 
          'type' in block && block.type === 'text' && 'text' in block
        );
        
        // Return the text if found, otherwise handle appropriately
        if (textContent && 'text' in textContent) {
          console.log(`${modelDisplayName} optimization successful, received text response:`, textContent.text.substring(0, 100) + "...");
          return textContent.text.trim();
        } else {
          console.warn(`No text content found in ${modelDisplayName} response:`, response);
          return `${modelDisplayName} responded with an unexpected format. Please try again.`;
        }
      } else {
        return `${modelDisplayName} returned an empty response. Please try again.`;
      }
    } catch (sdkError) {
      console.error("Anthropic SDK error:", sdkError);
      
      // Show a specific toast for authentication errors
      if (sdkError instanceof Anthropic.AuthenticationError) {
        toast({
          title: "Authentication Failed",
          description: "Invalid Claude API key. Please check your API key in the AI Configuration.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Claude API Error",
          description: sdkError instanceof Error ? sdkError.message : "An error occurred during API call",
          variant: "destructive",
        });
      }
      
      // Return fallback message
      return getFallbackMessage(prompt, sdkError instanceof Error ? sdkError : new Error(String(sdkError)));
    }
  } catch (error) {
    console.error("Claude API error:", error);
    
    // Return fallback message
    return getFallbackMessage(prompt, error instanceof Error ? error : new Error(String(error)));
  }
};
