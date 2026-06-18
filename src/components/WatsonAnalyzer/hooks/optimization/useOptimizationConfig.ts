
import { useState, useEffect } from 'react';

// Define the AI provider type
export type AIProvider = "openai" | "anthropic";

/**
 * Hook for managing optimization configuration
 */
export const useOptimizationConfig = () => {
  // AI configuration
  const [apiKey, setApiKey] = useState(() => {
    return sessionStorage.getItem('ai_api_key') || "";
  });
  
  const [openAIKey, setOpenAIKey] = useState(() => {
    return sessionStorage.getItem('openai_api_key') || "";
  });
  
  const [anthropicKey, setAnthropicKey] = useState(() => {
    return sessionStorage.getItem('anthropic_api_key') || "";
  });
  
  const [aiModel, setAiModel] = useState(() => {
    const savedModel = sessionStorage.getItem('ai_model') || "o4-mini";
    // Map any legacy Claude id onto a model that still exists in models.ts
    if (savedModel.startsWith("claude") && savedModel !== "claude-opus-4-7") {
      return "claude-sonnet-4-6";
    }
    return savedModel;
  });
  
  const [aiProvider, setAiProvider] = useState<AIProvider>(() => {
    const savedModel = sessionStorage.getItem('ai_model') || "o4-mini";
    return savedModel.startsWith("claude") ? "anthropic" : "openai";
  });

  // Effect to manage provider-specific API keys
  useEffect(() => {
    if (aiProvider === "openai") {
      setApiKey(openAIKey);
    } else {
      setApiKey(anthropicKey);
    }
  }, [aiProvider, openAIKey, anthropicKey]);

  // Save to sessionStorage when values change
  const storeApiKey = (key: string) => {
    if (key) {
      if (aiProvider === "openai") {
        sessionStorage.setItem('openai_api_key', key);
        setOpenAIKey(key);
      } else {
        sessionStorage.setItem('anthropic_api_key', key);
        setAnthropicKey(key);
      }
      sessionStorage.setItem('ai_api_key', key);
    }
    setApiKey(key);
  };

  const storeAiModel = (model: string) => {
    if (model) sessionStorage.setItem('ai_model', model);
    setAiModel(model);
    // Update provider based on model
    const newProvider = model.startsWith("claude") ? "anthropic" : "openai";
    setAiProvider(newProvider);
    
    // Switch to the appropriate API key for the selected provider
    if (newProvider === "openai") {
      setApiKey(openAIKey);
    } else {
      setApiKey(anthropicKey);
    }
  };

  return {
    apiKey,
    setApiKey: storeApiKey,
    aiModel,
    setAiModel: storeAiModel,
    aiProvider,
    setAiProvider,
    openAIKey,
    anthropicKey,
  };
};
