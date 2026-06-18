
/**
 * Utility functions for Claude API integration using the official Anthropic SDK
 */
import Anthropic from '@anthropic-ai/sdk';
import { toast } from "@/hooks/use-toast";
import { OPTIMIZATION_SYSTEM_PROMPT } from './optimizationSystemPrompt';
import { AI_MODEL } from './aiConfig';

const DEFAULT_CLAUDE_MODEL = AI_MODEL;

/**
 * Fallback message for when the Anthropic SDK encounters an error
 */
const getFallbackMessage = (error?: Error): string => {
  // If we have an authentication error, return a clear message
  if (
    error?.message?.includes("401") ||
    error?.message?.includes("auth") ||
    error?.toString().includes("invalid x-api-key")
  ) {
    return `Authentication Failed: Your Claude API key appears to be invalid.

Please check the following:
1. Make sure your API key is correctly entered in the AI Configuration settings
2. Verify that your Claude API key is active and has not expired
3. Ensure your account has access to the Claude API

The original text has been preserved.`;
  }

  // Return a general fallback message
  return `Due to API connection issues, the AI-optimized result could not be generated.

Options to resolve this:
1. Check that your Claude API key is valid
2. Use OpenAI instead, which may have fewer connection restrictions
3. Try again in a few moments

The original text has been preserved.`;
};

/**
 * Optimizes text using Anthropic Claude API via the official SDK
 */
export const optimizeWithClaude = async (
  prompt: string,
  apiKey: string,
  model: string = DEFAULT_CLAUDE_MODEL
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
      toast({
        title: "Invalid API Key Format",
        description: "Claude API keys typically start with 'sk-ant-'. Please check your key.",
        variant: "warning",
      });
    }

    const claudeModel = model || DEFAULT_CLAUDE_MODEL;

    // Create Anthropic client with browser support enabled
    const client = new Anthropic({
      apiKey: apiKey,
      dangerouslyAllowBrowser: true, // Enable browser support
    });

    toast({
      title: "Optimizing with Claude",
      description: `Using ${claudeModel} for optimization...`,
    });

    try {
      // Make the API request using the SDK
      const response = await client.messages.create({
        model: claudeModel,
        system: OPTIMIZATION_SYSTEM_PROMPT,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 2000
      });

      // Find the first text block in the content array
      if (response.content && response.content.length > 0) {
        const textContent = response.content.find(block =>
          'type' in block && block.type === 'text' && 'text' in block
        );

        if (textContent && 'text' in textContent) {
          return textContent.text.trim();
        }

        return "Claude responded with an unexpected format. Please try again.";
      }

      return "Claude returned an empty response. Please try again.";
    } catch (sdkError) {
      console.error("Anthropic SDK error:", sdkError);

      if (sdkError instanceof Anthropic.AuthenticationError) {
        toast({
          title: "Authentication Failed",
          description: "Invalid Claude API key. Please check your API key in the AI Configuration.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Claude API Error",
          description: sdkError instanceof Error ? sdkError.message : "An error occurred during the API call",
          variant: "destructive",
        });
      }

      return getFallbackMessage(sdkError instanceof Error ? sdkError : new Error(String(sdkError)));
    }
  } catch (error) {
    console.error("Claude API error:", error);
    return getFallbackMessage(error instanceof Error ? error : new Error(String(error)));
  }
};
