
import { useState } from 'react';
import { AI_MODEL } from '../../utils/aiConfig';

const STORAGE_KEY = 'anthropic_api_key';

/**
 * Minimal AI configuration: a single Anthropic API key. The model is fixed
 * (AI_MODEL), so there is no provider/model selection to get wrong.
 */
export const useOptimizationConfig = () => {
  const [apiKey, setApiKeyState] = useState(() => sessionStorage.getItem(STORAGE_KEY) || "");

  const setApiKey = (key: string) => {
    const trimmed = (key || "").trim();
    if (trimmed) {
      sessionStorage.setItem(STORAGE_KEY, trimmed);
    } else {
      sessionStorage.removeItem(STORAGE_KEY);
    }
    setApiKeyState(trimmed);
  };

  return { apiKey, setApiKey, aiModel: AI_MODEL };
};
