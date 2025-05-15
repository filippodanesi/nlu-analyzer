
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
  apiKey: string
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

    // Create Anthropic client with browser support enabled
    const client = new Anthropic({
      apiKey: apiKey,
      dangerouslyAllowBrowser: true, // Enable browser support
    });

    toast({
      title: "Optimizing with Claude",
      description: "Using the Anthropic SDK for secure API access...",
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
          return textContent.text.trim();
        } else {
          console.warn("No text content found in Claude response:", response);
          return "Claude responded with an unexpected format. Please try again.";
        }
      } else {
        return "Claude returned an empty response. Please try again.";
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
